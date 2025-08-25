-- IVOR Health Knowledge System Database Schema
-- Transforms menrus.co.uk content into queryable knowledge base

-- Main content table storing scraped health information
CREATE TABLE health_content (
    id SERIAL PRIMARY KEY,
    url VARCHAR(500) UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100), -- HIV, PrEP, Testing, Mental Health, etc.
    subcategory VARCHAR(100), -- Testing, Treatment, Support, Living_Well, Prevention, etc.
    service_stage VARCHAR(100), -- Pre_exposure, Testing, New_diagnosis, Long_term_care, Ongoing_support
    tags TEXT[], -- Array of searchable tags
    location VARCHAR(100), -- London, South London, Birmingham, etc.
    target_audience VARCHAR(100), -- Gay men, Bi men, Trans men, etc.
    content_type VARCHAR(50), -- Article, Directory, Guide, FAQ
    last_scraped TIMESTAMP DEFAULT NOW(),
    content_hash VARCHAR(64), -- To detect content changes
    is_active BOOLEAN DEFAULT true,
    source_credibility_score INTEGER DEFAULT 5 -- 1-10 rating
);

-- Vector embeddings for semantic search
CREATE TABLE content_embeddings (
    id SERIAL PRIMARY KEY,
    content_id INTEGER REFERENCES health_content(id) ON DELETE CASCADE,
    embedding_vector FLOAT[1536], -- OpenAI embedding dimension
    chunk_text TEXT NOT NULL, -- Original text chunk for context
    chunk_index INTEGER, -- Position within the full content
    chunk_tokens INTEGER -- Token count for this chunk
);

-- Query logs to learn and improve responses
CREATE TABLE user_query_logs (
    id SERIAL PRIMARY KEY,
    original_query TEXT NOT NULL,
    processed_query TEXT, -- Cleaned/normalized version
    intent_category VARCHAR(100), -- HIV_testing, PrEP_info, etc.
    matched_content_ids INTEGER[],
    response_generated TEXT,
    response_sources TEXT[], -- URLs used in response
    user_feedback VARCHAR(20), -- helpful, not_helpful, partially_helpful
    timestamp TIMESTAMP DEFAULT NOW(),
    session_id VARCHAR(100),
    user_location VARCHAR(100) -- For geographic relevance
);

-- Health service directory (extracted structured data)
CREATE TABLE health_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    service_type VARCHAR(100), -- Testing, PrEP, Treatment, Ongoing_Care, Support_Groups, Mental_Health, Advocacy
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    website VARCHAR(500),
    email VARCHAR(200),
    opening_hours JSONB, -- Flexible schedule storage
    services_offered TEXT[],
    target_populations TEXT[],
    cost_info TEXT,
    booking_info TEXT,
    accessibility_info TEXT,
    languages_supported TEXT[],
    last_verified TIMESTAMP,
    source_content_id INTEGER REFERENCES health_content(id)
);

-- Create indexes for performance
CREATE INDEX idx_health_content_category ON health_content(category);
CREATE INDEX idx_health_content_location ON health_content(location);
CREATE INDEX idx_health_content_tags ON health_content USING GIN(tags);
CREATE INDEX idx_health_services_city ON health_services(city);
CREATE INDEX idx_health_services_service_type ON health_services(service_type);
CREATE INDEX idx_query_logs_intent ON user_query_logs(intent_category);

-- Enable vector similarity search (requires pgvector extension)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE INDEX idx_content_embeddings_vector ON content_embeddings 
USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 100);

-- Sample data structure views
CREATE VIEW health_services_summary AS 
SELECT 
    hs.name,
    hs.service_type,
    hs.city,
    hs.services_offered,
    hc.url as source_url,
    hc.last_scraped
FROM health_services hs
JOIN health_content hc ON hs.source_content_id = hc.id
WHERE hc.is_active = true;

-- Function to find similar content by embedding
CREATE OR REPLACE FUNCTION find_similar_content(
    query_embedding FLOAT[1536],
    match_threshold FLOAT DEFAULT 0.8,
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    content_id INTEGER,
    title TEXT,
    chunk_text TEXT,
    similarity FLOAT,
    url VARCHAR(500),
    category VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ce.content_id,
        hc.title,
        ce.chunk_text,
        1 - (ce.embedding_vector <=> query_embedding) as similarity,
        hc.url,
        hc.category
    FROM content_embeddings ce
    JOIN health_content hc ON ce.content_id = hc.id
    WHERE hc.is_active = true
    AND 1 - (ce.embedding_vector <=> query_embedding) > match_threshold
    ORDER BY ce.embedding_vector <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;