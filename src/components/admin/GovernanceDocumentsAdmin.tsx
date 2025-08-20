// Governance Documents Admin Dashboard for BLKOUT Community
// Allows admin users to upload and manage official documents, meeting minutes, and governance records

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Upload, Trash2, Edit, Eye, Download, 
  Calendar, User, Tag, AlertCircle, CheckCircle,
  Plus, Search, Filter, Archive, Clock,
  Gavel, Scale, BarChart3, Users, Heart,
  File, Image, Video, AudioLines, X
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import PageLoadingDebug from '../debug/PageLoadingDebug'
import { useGovernanceDocuments, useGovernanceFileUpload, useCommunityMeetings } from '../../hooks/useSupabase'

interface OfficialDocument {
  id: string
  title: string
  type: 'minutes' | 'agenda' | 'resolution' | 'report' | 'policy' | 'financial' | 'legal'
  meeting_id?: string
  meeting_title?: string
  file_url: string
  file_name: string
  file_size: string
  file_type: string
  description: string
  uploaded_by: string
  uploaded_date: string
  is_public: boolean
  is_archived: boolean
  tags: string[]
  status: 'draft' | 'review' | 'published' | 'archived'
  version: number
  related_proposal_id?: string
}

interface Meeting {
  id: string
  title: string
  date: string
  type: 'council' | 'community' | 'working-group' | 'special'
}

interface GovernanceDocumentsAdminProps {
  userRole: 'admin' | 'moderator' | 'council'
}

const GovernanceDocumentsAdmin: React.FC<GovernanceDocumentsAdminProps> = ({
  userRole
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<OfficialDocument | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  // Use real data from Supabase
  const { 
    documents, 
    loading: documentsLoading, 
    error: documentsError,
    uploadDocument 
  } = useGovernanceDocuments({ 
    type: filterType === 'all' ? undefined : filterType,
    status: filterStatus === 'all' ? undefined : filterStatus,
    limit: 100 
  })
  
  const { 
    meetings, 
    loading: meetingsLoading 
  } = useCommunityMeetings({ 
    limit: 50 
  })
  
  const { uploadFile, uploading } = useGovernanceFileUpload()

  const loading = documentsLoading || meetingsLoading

  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'minutes' as OfficialDocument['type'],
    meeting_id: '',
    description: '',
    tags: [] as string[],
    is_public: true,
    file: null as File | null
  })

  // Transform documents data to match our interface
  const transformedDocuments: OfficialDocument[] = documents?.map(doc => ({
    ...doc,
    // Ensure we have the expected fields
    meeting_title: doc.meeting_id ? meetings?.find(m => m.id === doc.meeting_id)?.title : undefined,
    uploaded_by: doc.uploaded_by_name || 'Unknown User'
  })) || []

  const documentTypes = [
    { value: 'minutes', label: 'Meeting Minutes', icon: Gavel, color: 'text-purple-400' },
    { value: 'agenda', label: 'Meeting Agenda', icon: Calendar, color: 'text-blue-400' },
    { value: 'resolution', label: 'Resolution', icon: Scale, color: 'text-emerald-400' },
    { value: 'report', label: 'Report', icon: BarChart3, color: 'text-amber-400' },
    { value: 'policy', label: 'Policy Document', icon: FileText, color: 'text-indigo-400' },
    { value: 'financial', label: 'Financial Document', icon: BarChart3, color: 'text-green-400' },
    { value: 'legal', label: 'Legal Document', icon: Scale, color: 'text-red-400' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-400 bg-gray-900/20'
      case 'review': return 'text-amber-400 bg-amber-900/20'
      case 'published': return 'text-emerald-400 bg-emerald-900/20'
      case 'archived': return 'text-indigo-400 bg-indigo-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return FileText
    if (fileType.includes('image')) return Image
    if (fileType.includes('video')) return Video
    if (fileType.includes('audio')) return AudioLines
    return File
  }

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title.trim()) return

    try {
      // First upload the file
      const fileResult = await uploadFile(uploadForm.file, 'governance')
      
      // Create document record in database
      const documentData = {
        title: uploadForm.title,
        type: uploadForm.type,
        meeting_id: uploadForm.meeting_id || null,
        file_url: fileResult.url,
        file_name: uploadForm.file.name,
        file_size: `${(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB`,
        file_type: uploadForm.file.type,
        description: uploadForm.description,
        is_public: uploadForm.is_public,
        tags: uploadForm.tags,
        status: 'draft'
      }

      await uploadDocument(documentData)
      setShowUploadModal(false)
      resetUploadForm()
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      type: 'minutes',
      meeting_id: '',
      description: '',
      tags: [],
      is_public: true,
      file: null
    })
  }

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      // This would call a delete function from useGovernanceDocuments
      console.log('Delete document:', documentId)
      // For now, we'll just log it - the actual delete would trigger a refetch
    }
  }

  const handleStatusUpdate = async (documentId: string, newStatus: OfficialDocument['status']) => {
    // This would call an update function from useGovernanceDocuments
    console.log('Update document status:', documentId, newStatus)
    // For now, we'll just log it - the actual update would trigger a refetch
  }

  const filteredDocuments = transformedDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-8 text-center">
        <LoadingSpinner size="lg" color="purple" text="Loading governance documents..." />
      </div>
    )
  }

  return (
    <>
      <PageLoadingDebug 
        pageName="Admin Governance Documents"
        dependencies={['Supabase', 'Governance Hooks', 'File Upload']}
      />
      <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white heading-block uppercase">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Governance Documents
            </span>
          </h1>
          <p className="text-indigo-300 mt-2">
            Manage official documents, meeting records, and governance materials
          </p>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-indigo-800/30 border border-indigo-700/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-indigo-800/30 border border-indigo-700/30 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-indigo-800/30 border border-indigo-700/30 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="text-sm text-indigo-300">
            {filteredDocuments.length} of {transformedDocuments.length} documents
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => {
          const typeInfo = documentTypes.find(t => t.value === document.type)
          const FileIcon = getFileTypeIcon(document.file_type)
          
          return (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-indigo-800/30 border border-indigo-700/30 p-6 hover:bg-indigo-800/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-purple-600/20 flex items-center justify-center">
                    {typeInfo?.icon ? (
                      <typeInfo.icon className={`w-6 h-6 ${typeInfo.color}`} />
                    ) : (
                      <FileText className="w-6 h-6 text-purple-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{document.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                        {document.status.toUpperCase()}
                      </span>
                      {!document.is_public && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-900/20 text-red-400">
                          PRIVATE
                        </span>
                      )}
                    </div>
                    
                    <p className="text-indigo-200 mb-3 line-clamp-2">
                      {document.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-indigo-300">
                      <div className="flex items-center space-x-1">
                        <FileIcon className="w-4 h-4" />
                        <span>{document.file_name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Archive className="w-4 h-4" />
                        <span>{document.file_size}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{document.uploaded_by}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(document.uploaded_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {document.meeting_title && (
                      <div className="mt-2 text-sm">
                        <span className="text-indigo-400">Related to: </span>
                        <span className="text-white font-medium">{document.meeting_title}</span>
                      </div>
                    )}
                    
                    {document.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        <Tag className="w-4 h-4 text-indigo-400" />
                        <div className="flex flex-wrap gap-1">
                          {document.tags.map((tag, index) => (
                            <span key={index} className="bg-indigo-700/30 text-indigo-300 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => window.open(document.file_url, '_blank')}
                    className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-800/30 rounded transition-colors"
                    title="View document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {/* Download logic */}}
                    className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-800/30 rounded transition-colors"
                    title="Download document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  
                  {(userRole === 'admin' || userRole === 'moderator') && (
                    <>
                      <button
                        onClick={() => setSelectedDocument(document)}
                        className="p-2 text-amber-400 hover:text-amber-300 hover:bg-amber-800/30 rounded transition-colors"
                        title="Edit document"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(document.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-800/30 rounded transition-colors"
                        title="Delete document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  
                  {/* Status Update Dropdown */}
                  <select
                    value={document.status}
                    onChange={(e) => handleStatusUpdate(document.id, e.target.value as OfficialDocument['status'])}
                    className="bg-indigo-800/30 border border-indigo-700/30 text-white text-xs px-2 py-1 rounded focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No documents found</h3>
          <p className="text-indigo-300 mb-4">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Start by uploading your first governance document.'
            }
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Upload First Document
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-indigo-900 border border-indigo-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Upload New Document</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 text-indigo-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Document Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                      placeholder="Enter document title"
                      className="w-full bg-indigo-800/30 border border-indigo-700/30 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Document Type *
                      </label>
                      <select
                        value={uploadForm.type}
                        onChange={(e) => setUploadForm({...uploadForm, type: e.target.value as any})}
                        className="w-full bg-indigo-800/30 border border-indigo-700/30 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        {documentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Related Meeting (Optional)
                      </label>
                      <select
                        value={uploadForm.meeting_id}
                        onChange={(e) => setUploadForm({...uploadForm, meeting_id: e.target.value})}
                        className="w-full bg-indigo-800/30 border border-indigo-700/30 text-white p-3 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select meeting</option>
                        {meetings.map(meeting => (
                          <option key={meeting.id} value={meeting.id}>
                            {meeting.title} - {new Date(meeting.date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      placeholder="Brief description of the document"
                      rows={3}
                      className="w-full bg-indigo-800/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      File *
                    </label>
                    <div className="border-2 border-dashed border-indigo-600/30 rounded-lg p-6 text-center">
                      {uploadForm.file ? (
                        <div className="flex items-center justify-center space-x-3">
                          <FileText className="w-8 h-8 text-emerald-400" />
                          <div>
                            <p className="text-white font-medium">{uploadForm.file.name}</p>
                            <p className="text-indigo-300 text-sm">
                              {(uploadForm.file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                          <button
                            onClick={() => setUploadForm({...uploadForm, file: null})}
                            className="p-1 text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                          <p className="text-white mb-2">Click to upload or drag and drop</p>
                          <p className="text-indigo-400 text-sm">PDF, DOC, DOCX, TXT, MD up to 10MB</p>
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) setUploadForm({...uploadForm, file})
                            }}
                            accept=".pdf,.doc,.docx,.txt,.md"
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="inline-block mt-4 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors"
                          >
                            Choose File
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={uploadForm.is_public}
                        onChange={(e) => setUploadForm({...uploadForm, is_public: e.target.checked})}
                        className="w-4 h-4 text-purple-600 border-indigo-700 rounded focus:ring-purple-500"
                      />
                      <span className="text-white">Make document public</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-indigo-700">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleUpload}
                    disabled={!uploadForm.file || !uploadForm.title.trim() || uploading}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {uploading ? (
                      <>
                        <LoadingSpinner size="sm" color="white" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Document</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  )
}

export default GovernanceDocumentsAdmin