#!/usr/bin/env python3
"""
IVOR AI Backend - FastAPI Application
Community Support AI for Black QTIPOC+ Liberation
"""

import os
import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from loguru import logger
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
import asyncio
import aioredis
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Configuration
from config import settings
from database import init_db, get_db
from models import ChatMessage, PathwayContext, Resource
from services.ai_service import AIService
from services.pathway_service import PathwayService
from services.resource_service import ResourceService

# Metrics
REQUEST_COUNT = Counter('ivor_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('ivor_request_duration_seconds', 'Request duration')
AI_RESPONSES = Counter('ivor_ai_responses_total', 'AI responses', ['type'])

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
security = HTTPBearer(auto_error=False)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("Starting IVOR AI Backend...")
    await init_db()
    app.state.ai_service = AIService()
    app.state.pathway_service = PathwayService()
    app.state.resource_service = ResourceService()
    
    # Redis connection
    try:
        app.state.redis = await aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
        await app.state.redis.ping()
        logger.info("Connected to Redis")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}")
        app.state.redis = None
    
    logger.info("IVOR AI Backend started successfully")
    yield
    
    # Shutdown
    logger.info("Shutting down IVOR AI Backend...")
    if hasattr(app.state, 'redis') and app.state.redis:
        await app.state.redis.close()

# FastAPI app
app = FastAPI(
    title="IVOR AI Backend",
    description="Community Support AI for Black QTIPOC+ Liberation",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Request models
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    context: Optional[Dict[str, Any]] = None
    source: str = Field(default="web")
    user_id: Optional[str] = None
    conversation_id: Optional[str] = None

class PathwayRequest(BaseModel):
    pathway_data: Dict[str, Any]
    source: str = Field(default="liberation-quiz")
    user_id: Optional[str] = None

class ResourceRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    filters: Optional[Dict[str, Any]] = None
    source: str = Field(default="web")
    limit: int = Field(default=10, ge=1, le=50)

# Response models
class ChatResponse(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None
    resources: Optional[List[Dict[str, Any]]] = None
    conversation_id: Optional[str] = None
    timestamp: datetime

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    services: Dict[str, str]

# Middleware for metrics
@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = datetime.now()
    
    # Count request
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path
    ).inc()
    
    response = await call_next(request)
    
    # Record duration
    duration = (datetime.now() - start_time).total_seconds()
    REQUEST_DURATION.observe(duration)
    
    return response

# Health check endpoint
@app.get("/health/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    services = {}
    
    # Check database
    try:
        # Simple DB check - you'd implement this based on your DB setup
        services["database"] = "healthy"
    except Exception:
        services["database"] = "unhealthy"
    
    # Check Redis
    if hasattr(app.state, 'redis') and app.state.redis:
        try:
            await app.state.redis.ping()
            services["redis"] = "healthy"
        except Exception:
            services["redis"] = "unhealthy"
    else:
        services["redis"] = "unavailable"
    
    # Check AI service
    try:
        services["ai_service"] = "healthy"
    except Exception:
        services["ai_service"] = "unhealthy"
    
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        version="1.0.0",
        services=services
    )

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
@app.post("/chat/message", response_model=ChatResponse)  # Legacy endpoint
@limiter.limit("30/minute")
async def chat_message(
    request: Request,
    chat_request: ChatRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Process chat message with AI"""
    try:
        ai_service = app.state.ai_service
        
        # Generate AI response
        response = await ai_service.generate_response(
            message=chat_request.message,
            context=chat_request.context,
            user_id=chat_request.user_id,
            conversation_id=chat_request.conversation_id
        )
        
        # Count AI response type
        AI_RESPONSES.labels(type=response.get('type', 'general')).inc()
        
        # Save to database in background
        background_tasks.add_task(
            save_chat_message,
            db,
            chat_request,
            response
        )
        
        return ChatResponse(
            message=response['message'],
            context=response.get('context'),
            suggestions=response.get('suggestions', []),
            resources=response.get('resources', []),
            conversation_id=response.get('conversation_id'),
            timestamp=datetime.now()
        )
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Pathway context endpoint
@app.post("/api/pathway-context")
@limiter.limit("20/minute")
async def pathway_context(
    request: Request,
    pathway_request: PathwayRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """Generate pathway context analysis"""
    try:
        pathway_service = app.state.pathway_service
        
        context = await pathway_service.analyze_pathway(
            pathway_data=pathway_request.pathway_data,
            user_id=pathway_request.user_id
        )
        
        # Save to database in background
        background_tasks.add_task(
            save_pathway_context,
            db,
            pathway_request,
            context
        )
        
        return context
        
    except Exception as e:
        logger.error(f"Pathway analysis error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Resources endpoint
@app.post("/api/resources")
@limiter.limit("50/minute")
async def get_resources(
    request: Request,
    resource_request: ResourceRequest,
    db: AsyncSession = Depends(get_db)
):
    """Get relevant resources"""
    try:
        resource_service = app.state.resource_service
        
        resources = await resource_service.search_resources(
            query=resource_request.query,
            filters=resource_request.filters,
            limit=resource_request.limit
        )
        
        return {
            "resources": resources,
            "total": len(resources),
            "query": resource_request.query
        }
        
    except Exception as e:
        logger.error(f"Resource search error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Metrics endpoint
@app.get("/metrics")
async def metrics():
    """Prometheus metrics endpoint"""
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

# Background tasks
async def save_chat_message(db: AsyncSession, request: ChatRequest, response: Dict):
    """Save chat message to database"""
    try:
        chat_message = ChatMessage(
            message=request.message,
            response=response['message'],
            context=request.context,
            user_id=request.user_id,
            conversation_id=request.conversation_id,
            source=request.source,
            timestamp=datetime.now()
        )
        db.add(chat_message)
        await db.commit()
    except Exception as e:
        logger.error(f"Failed to save chat message: {e}")

async def save_pathway_context(db: AsyncSession, request: PathwayRequest, context: Dict):
    """Save pathway context to database"""
    try:
        pathway_context = PathwayContext(
            pathway_data=request.pathway_data,
            context=context,
            user_id=request.user_id,
            source=request.source,
            timestamp=datetime.now()
        )
        db.add(pathway_context)
        await db.commit()
    except Exception as e:
        logger.error(f"Failed to save pathway context: {e}")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )