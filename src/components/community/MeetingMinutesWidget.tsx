// Meeting Minutes Archive Widget for BLKOUT Community Governance
// Displays official meeting records, upcoming meetings, and document transparency

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Calendar, Clock, Download, Eye, Users, 
  Archive, ChevronRight, ExternalLink, Bell,
  CheckCircle, AlertCircle, Info, Gavel, Star,
  MapPin, Video, Mic, Coffee, Hash
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'
import { useCommunityMeetings } from '../../hooks/useSupabase'

interface MeetingRecord {
  id: string
  title: string
  date: string
  type: 'council' | 'community' | 'working-group' | 'special'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  attendees_count?: number
  duration?: string
  location: string
  virtual_link?: string
  agenda_items: string[]
  minutes_url?: string
  recording_url?: string
  documents: OfficialDocument[]
  summary?: string
  decisions_made: string[]
  action_items: ActionItem[]
  next_meeting_date?: string
}

interface OfficialDocument {
  id: string
  title: string
  type: 'minutes' | 'agenda' | 'resolution' | 'report' | 'policy' | 'financial'
  url: string
  uploaded_date: string
  file_size: string
  description?: string
}

interface ActionItem {
  id: string
  task: string
  assignee: string
  due_date: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

interface MeetingMinutesWidgetProps {
  showArchive?: boolean
  maxRecentMeetings?: number
}

const MeetingMinutesWidget: React.FC<MeetingMinutesWidgetProps> = ({
  showArchive = true,
  maxRecentMeetings = 3
}) => {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(null)
  const [showFullArchive, setShowFullArchive] = useState(false)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'recent' | 'archive'>('recent')

  // Use real data from Supabase
  const { 
    meetings, 
    loading, 
    error 
  } = useCommunityMeetings({ 
    limit: 50 
  })

  // Transform meetings data to match our interface and add mock detailed data
  const transformedMeetings: MeetingRecord[] = meetings?.map(meeting => ({
    ...meeting,
    // Add mock detailed data for demonstration - this would come from the database
    agenda_items: meeting.agenda_items || [
      'Welcome & Community Updates',
      'Governance Updates',
      'Working Group Reports',
      'Open Floor Discussion'
    ],
    documents: [],
    decisions_made: meeting.decisions_made || [],
    action_items: meeting.action_items || [],
    virtual_link: meeting.virtual_link || `https://meet.blkoutuk.com/${meeting.type}-meeting`,
    summary: meeting.summary || 'Meeting summary will be available after completion.',
    minutes_url: meeting.minutes_url,
    recording_url: meeting.recording_url
  })) || []

  const upcomingMeetings = transformedMeetings.filter(m => m.status === 'scheduled')
  const recentMeetings = transformedMeetings
    .filter(m => m.status === 'completed')
    .slice(0, maxRecentMeetings)
  const archivedMeetings = transformedMeetings.filter(m => m.status === 'completed')

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'council': return 'text-purple-400 bg-purple-900/20'
      case 'community': return 'text-emerald-400 bg-emerald-900/20'
      case 'working-group': return 'text-blue-400 bg-blue-900/20'
      case 'special': return 'text-amber-400 bg-amber-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-amber-400 bg-amber-900/20'
      case 'in-progress': return 'text-blue-400 bg-blue-900/20'
      case 'completed': return 'text-emerald-400 bg-emerald-900/20'
      case 'cancelled': return 'text-red-400 bg-red-900/20'
      default: return 'text-gray-400 bg-gray-900/20'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-GB', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  const MeetingCard: React.FC<{ meeting: MeetingRecord; isUpcoming?: boolean }> = ({ 
    meeting, 
    isUpcoming = false 
  }) => {
    const formatted = formatDate(meeting.date)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-indigo-800/30 border border-indigo-700/30 p-6 hover:bg-indigo-800/50 transition-all duration-300 group cursor-pointer"
        onClick={() => setSelectedMeeting(meeting)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600/20 flex items-center justify-center">
              <Gavel className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                {meeting.title}
              </h3>
              <div className="flex items-center space-x-3 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMeetingTypeColor(meeting.type)}`}>
                  {meeting.type.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
                  {meeting.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-white">{formatted.date}</div>
            <div className="text-xs text-indigo-300">{formatted.time}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-4 text-sm text-indigo-300">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{meeting.location}</span>
            </div>
            {meeting.attendees_count && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{meeting.attendees_count} attended</span>
              </div>
            )}
            {meeting.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{meeting.duration}</span>
              </div>
            )}
          </div>

          {meeting.agenda_items && meeting.agenda_items.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-indigo-200 mb-2">Key Agenda Items:</h4>
              <ul className="text-sm text-indigo-300 space-y-1">
                {meeting.agenda_items.slice(0, 3).map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Hash className="w-3 h-3 mt-1 text-indigo-400" />
                    <span>{item}</span>
                  </li>
                ))}
                {meeting.agenda_items.length > 3 && (
                  <li className="text-xs text-indigo-400">
                    +{meeting.agenda_items.length - 3} more items
                  </li>
                )}
              </ul>
            </div>
          )}

          {meeting.documents && meeting.documents.length > 0 && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-emerald-400">
                <FileText className="w-4 h-4" />
                <span>{meeting.documents.length} documents</span>
              </div>
              {meeting.recording_url && (
                <div className="flex items-center space-x-1 text-blue-400">
                  <Video className="w-4 h-4" />
                  <span>Recording available</span>
                </div>
              )}
            </div>
          )}

          {isUpcoming && meeting.virtual_link && (
            <div className="bg-blue-900/20 border border-blue-600/30 p-3 rounded">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-200">Join virtually</span>
                </div>
                <button className="text-blue-300 hover:text-blue-200 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-indigo-700/30 flex items-center justify-between">
          <div className="flex space-x-3 text-sm">
            {meeting.minutes_url && (
              <button className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 transition-colors">
                <FileText className="w-4 h-4" />
                <span>Minutes</span>
              </button>
            )}
            {meeting.recording_url && (
              <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors">
                <Video className="w-4 h-4" />
                <span>Recording</span>
              </button>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8 text-center">
        <LoadingSpinner size="md" color="purple" text="Loading meeting records..." />
      </div>
    )
  }

  return (
    <div className="bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600/20 flex items-center justify-center">
            <Archive className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white heading-block uppercase">
              Official Meeting Records
            </h2>
            <p className="text-indigo-300 text-sm">
              Transparent governance through documented decisions
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <span className="text-sm text-amber-300 font-medium">
            {upcomingMeetings.length} upcoming
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-indigo-800/30 p-1 rounded">
        {[
          { id: 'upcoming', label: 'Upcoming', count: upcomingMeetings.length },
          { id: 'recent', label: 'Recent', count: recentMeetings.length },
          { id: 'archive', label: 'Archive', count: archivedMeetings.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-indigo-300 hover:text-white hover:bg-indigo-700/50'
            }`}
          >
            <span>{tab.label}</span>
            <span className="bg-indigo-900/50 px-2 py-1 rounded-full text-xs">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'upcoming' && (
          <motion.div
            key="upcoming"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} isUpcoming />
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                <p className="text-indigo-300">No upcoming meetings scheduled</p>
                <p className="text-sm text-indigo-400 mt-2">
                  Check back soon for new meeting announcements
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'recent' && (
          <motion.div
            key="recent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {recentMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </motion.div>
        )}

        {activeTab === 'archive' && (
          <motion.div
            key="archive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {archivedMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meeting Details Modal */}
      <AnimatePresence>
        {selectedMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedMeeting(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-indigo-900 border border-indigo-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content would go here - detailed meeting view */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {selectedMeeting.title}
                </h3>
                <p className="text-indigo-200">
                  Detailed meeting view would be implemented here with full agenda,
                  participant lists, decisions, action items, and document downloads.
                </p>
                <button
                  onClick={() => setSelectedMeeting(null)}
                  className="mt-4 bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-indigo-700/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-emerald-900/20 border border-emerald-600/30 p-4">
            <div className="text-2xl font-bold text-emerald-400">
              {archivedMeetings.length}
            </div>
            <div className="text-sm text-emerald-300">Completed Meetings</div>
          </div>
          <div className="bg-amber-900/20 border border-amber-600/30 p-4">
            <div className="text-2xl font-bold text-amber-400">
              {upcomingMeetings.length}
            </div>
            <div className="text-sm text-amber-300">Scheduled Meetings</div>
          </div>
          <div className="bg-purple-900/20 border border-purple-600/30 p-4">
            <div className="text-2xl font-bold text-purple-400">
              {transformedMeetings.reduce((total, meeting) => total + (meeting.documents?.length || 0), 0)}
            </div>
            <div className="text-sm text-purple-300">Official Documents</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeetingMinutesWidget