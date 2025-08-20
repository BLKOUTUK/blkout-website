// API Types for BLKOUTNXT Supabase Integration
// Updated to work with the new /home/robbe/blkoutnxt-api backend

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  current_page: number
  total_pages: number
  total_items: number
  items_per_page: number
  has_next_page: boolean
  has_prev_page: boolean
}

// Newsroom API Types
export interface ApiArticle {
  id: string
  title: string
  excerpt?: string
  content?: string
  author_id: string
  category: string
  tags: string[]
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    full_name: string
    avatar_url?: string
    bio?: string
  }
}

export interface CreateArticleRequest {
  title: string
  content: string
  excerpt?: string
  category: string
  tags?: string[]
  featured_image?: string
  status?: 'draft' | 'published'
  seo_title?: string
  seo_description?: string
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  published_at?: string
}

export interface ArticleQuery {
  page?: number
  limit?: number
  category?: string
  status?: 'draft' | 'published' | 'archived'
  author_id?: string
  search?: string
  sort?: 'title' | 'published_at' | 'created_at' | 'updated_at'
  order?: 'asc' | 'desc'
}

// Events API Types
export interface ApiEvent {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  address?: string
  event_type: 'workshop' | 'conference' | 'meetup' | 'fundraiser' | 'protest' | 'celebration' | 'education' | 'health'
  organizer_id: string
  max_attendees?: number
  registration_required: boolean
  registration_url?: string
  cost: number
  featured_image?: string
  tags: string[]
  status: 'draft' | 'published' | 'cancelled'
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    full_name: string
    avatar_url?: string
    bio?: string
  }
}

export interface CreateEventRequest {
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  address?: string
  event_type: 'workshop' | 'conference' | 'meetup' | 'fundraiser' | 'protest' | 'celebration' | 'education' | 'health'
  max_attendees?: number
  registration_required?: boolean
  registration_url?: string
  cost?: number
  featured_image?: string
  tags?: string[]
  status?: 'draft' | 'published'
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {}

export interface EventQuery {
  page?: number
  limit?: number
  start_date?: string
  end_date?: string
  event_type?: string
  location?: string
  status?: 'draft' | 'published' | 'cancelled'
  organizer_id?: string
  search?: string
  sort?: 'title' | 'start_date' | 'created_at' | 'updated_at'
  order?: 'asc' | 'desc'
}

// User Profile Types
export interface ApiProfile {
  id: string
  full_name?: string
  avatar_url?: string
  bio?: string
  role: 'user' | 'admin' | 'editor'
  created_at: string
  updated_at: string
}

// Authentication Types
export interface AuthRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    role: string
    full_name?: string
    avatar_url?: string
  }
  session: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
}

// Error Types
export interface ApiError {
  error: string
  message: string
  details?: any
  code?: string
}

// API Configuration
export interface ApiConfig {
  baseUrl: string
  timeout: number
  retries: number
  headers?: Record<string, string>
}

// Loading States
export interface LoadingState {
  loading: boolean
  error: string | null
  success: boolean
}

// Filter and Search Types
export interface SearchFilters {
  query?: string
  category?: string
  status?: string
  dateRange?: 'today' | 'week' | 'month' | 'all'
  location?: string
  tags?: string[]
}

// Community Types (matching API schema)
export interface CommunityMember {
  id: string
  name: string
  role: string
  bio?: string
  avatar_url?: string
  social_links?: Record<string, string>
  expertise?: string[]
  created_at: string
}

// Real-time Subscription Types
export interface SubscriptionCallback<T = any> {
  (data: T): void
}

export interface WebSocketMessage<T = any> {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  schema: string
  table: string
  commit_timestamp: string
  eventType: string
  new?: T
  old?: T
}

// Frontend-specific computed types
export interface ComputedArticle extends ApiArticle {
  readTime: number
  isBreaking: boolean
  publishedAtFormatted: string
  authorName: string
  authorInitials: string
}

export interface ComputedEvent extends ApiEvent {
  isUpcoming: boolean
  isPast: boolean
  isToday: boolean
  daysUntil: number
  formattedDate: string
  formattedTime: string
  isFree: boolean
  organizerName: string
}

// Bulk operations
export interface BulkOperation {
  action: 'publish' | 'archive' | 'delete' | 'update_status'
  ids: string[]
  data?: any
}

export interface BulkResponse {
  successful: string[]
  failed: Array<{
    id: string
    error: string
  }>
  total: number
}