// Proposal Voting Interface for BLKOUT's Cooperative Democracy
// Enables secure, transparent voting with real-time results and community discussion

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Vote, ThumbsUp, ThumbsDown, Clock, Users, MessageCircle, 
  Eye, Shield, CheckCircle, AlertCircle, Info, Heart,
  Calendar, User, Scale, Gavel, TrendingUp, Award,
  Lock, Unlock, Bell, Share2, Flag
} from 'lucide-react'
import LoadingSpinner from '../common/LoadingSpinner'

interface VotingOption {
  id: string
  label: string
  description: string
  icon: React.ElementType
  color: string
  bgColor: string
}

interface Comment {
  id: string
  user: string
  content: string
  timestamp: string
  role: 'member' | 'moderator' | 'council'
  likes: number
  replies: Comment[]
}

interface ProposalVotingInterfaceProps {
  proposalId: string
  title: string
  description: string
  category: string
  proposer: string
  createdAt: string
  votingDeadline: string
  votesFor: number
  votesAgainst: number
  votesAbstain: number
  totalEligible: number
  userVote?: 'for' | 'against' | 'abstain' | null
  userCanVote: boolean
  discussionCount: number
  onVote: (vote: 'for' | 'against' | 'abstain') => void
  onDiscussion: () => void
}

const ProposalVotingInterface: React.FC<ProposalVotingInterfaceProps> = ({
  proposalId,
  title,
  description,
  category,
  proposer,
  createdAt,
  votingDeadline,
  votesFor,
  votesAgainst,
  votesAbstain,
  totalEligible,
  userVote,
  userCanVote,
  discussionCount,
  onVote,
  onDiscussion
}) => {
  const [selectedVote, setSelectedVote] = useState<'for' | 'against' | 'abstain' | null>(userVote || null)
  const [isVoting, setIsVoting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showDiscussion, setShowDiscussion] = useState(false)
  
  // Mock discussion data
  const [comments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Maya Chen',
      content: 'This approach aligns perfectly with our restorative justice values. I strongly support moving away from punitive moderation toward healing-centered approaches.',
      timestamp: '2025-08-19T14:30:00Z',
      role: 'council',
      likes: 23,
      replies: [
        {
          id: '1-1',
          user: 'Jordan Rivers',
          content: 'Agreed! The trauma-informed component is especially important for our community.',
          timestamp: '2025-08-19T15:15:00Z',
          role: 'moderator',
          likes: 8,
          replies: []
        }
      ]
    },
    {
      id: '2',
      user: 'Alex Thompson',
      content: 'I appreciate the intention but have concerns about implementation. How do we ensure accountability while maintaining the healing focus?',
      timestamp: '2025-08-19T16:20:00Z',
      role: 'member',
      likes: 15,
      replies: []
    }
  ])

  const totalVotes = votesFor + votesAgainst + votesAbstain
  const participationRate = (totalVotes / totalEligible) * 100
  const daysLeft = Math.ceil((new Date(votingDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  
  const votingOptions: VotingOption[] = [
    {
      id: 'for',
      label: 'Support',
      description: 'I support this proposal and believe it will benefit our community',
      icon: ThumbsUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-900/20 border-emerald-600/30 hover:bg-emerald-800/30'
    },
    {
      id: 'against',
      label: 'Oppose',
      description: 'I oppose this proposal and believe it needs significant changes',
      icon: ThumbsDown,
      color: 'text-red-400',
      bgColor: 'bg-red-900/20 border-red-600/30 hover:bg-red-800/30'
    },
    {
      id: 'abstain',
      label: 'Abstain',
      description: 'I choose not to vote on this proposal at this time',
      icon: Clock,
      color: 'text-gray-400',
      bgColor: 'bg-gray-900/20 border-gray-600/30 hover:bg-gray-800/30'
    }
  ]

  const handleVote = async (vote: 'for' | 'against' | 'abstain') => {
    setIsVoting(true)
    setSelectedVote(vote)
    setShowConfirmation(true)
  }

  const confirmVote = async () => {
    if (!selectedVote) return
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      onVote(selectedVote)
      setShowConfirmation(false)
    } catch (error) {
      console.error('Voting failed:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const getVotePercentage = (votes: number) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0'
  }

  return (
    <div className="max-w-4xl mx-auto bg-indigo-900/30 backdrop-blur-sm border border-indigo-700/30 p-8">
      {/* Proposal Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600/20 flex items-center justify-center">
              <Gavel className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <div className="flex items-center space-x-3 text-sm text-indigo-300">
                <span>by {proposer}</span>
                <span>•</span>
                <span>{category}</span>
                <span>•</span>
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-amber-400 font-medium mb-1">
              {daysLeft > 0 ? `${daysLeft} days left` : 'Voting ended'}
            </div>
            <div className="text-xs text-indigo-400">
              Ends: {new Date(votingDeadline).toLocaleDateString()}
            </div>
          </div>
        </div>

        <p className="text-indigo-100 leading-relaxed mb-6">
          {description}
        </p>

        {/* Voting Status Bar */}
        <div className="bg-indigo-800/30 p-4 border border-indigo-700/20 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-200">
                Participation: {participationRate.toFixed(1)}% ({totalVotes}/{totalEligible})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-indigo-300">{discussionCount} comments</span>
            </div>
          </div>
          
          {userVote && (
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-300 font-medium">
                You voted: {userVote.charAt(0).toUpperCase() + userVote.slice(1)}
              </span>
            </div>
          )}
          
          <div className="w-full bg-indigo-900/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${participationRate}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Voting Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-900/20 border border-emerald-600/30 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <ThumbsUp className="w-6 h-6 text-emerald-400 mr-2" />
            <span className="text-lg font-bold text-emerald-400">Support</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{votesFor}</div>
          <div className="text-sm text-emerald-300">{getVotePercentage(votesFor)}%</div>
          <div className="w-full bg-emerald-900/30 rounded-full h-2 mt-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getVotePercentage(votesFor)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-600/30 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <ThumbsDown className="w-6 h-6 text-red-400 mr-2" />
            <span className="text-lg font-bold text-red-400">Oppose</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{votesAgainst}</div>
          <div className="text-sm text-red-300">{getVotePercentage(votesAgainst)}%</div>
          <div className="w-full bg-red-900/30 rounded-full h-2 mt-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getVotePercentage(votesAgainst)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-900/20 border border-gray-600/30 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-gray-400 mr-2" />
            <span className="text-lg font-bold text-gray-400">Abstain</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{votesAbstain}</div>
          <div className="text-sm text-gray-300">{getVotePercentage(votesAbstain)}%</div>
          <div className="w-full bg-gray-900/30 rounded-full h-2 mt-2">
            <div 
              className="bg-gray-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getVotePercentage(votesAbstain)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Voting Interface */}
      {userCanVote && !userVote && daysLeft > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Vote className="w-6 h-6 text-purple-400 mr-3" />
            Cast Your Vote
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {votingOptions.map((option) => (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVote(option.id as any)}
                disabled={isVoting}
                className={`p-6 border transition-all duration-300 ${option.bgColor} ${
                  selectedVote === option.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <option.icon className={`w-8 h-8 ${option.color} mx-auto mb-3`} />
                <div className={`text-lg font-bold ${option.color} mb-2`}>
                  {option.label}
                </div>
                <div className="text-sm text-indigo-200">
                  {option.description}
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-900/20 border border-blue-600/30">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-200">
                <p className="font-medium mb-1">Your vote is important!</p>
                <p>Voting is anonymous and secure. Your decision will be recorded permanently on the blockchain for transparency.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discussion Toggle */}
      <div className="border-t border-indigo-700/30 pt-6">
        <button
          onClick={() => setShowDiscussion(!showDiscussion)}
          className="flex items-center justify-between w-full bg-indigo-800/30 p-4 hover:bg-indigo-800/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-bold text-white">Community Discussion ({discussionCount})</span>
          </div>
          <motion.div
            animate={{ rotate: showDiscussion ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-indigo-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showDiscussion && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-indigo-800/20 p-4 border border-indigo-700/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{comment.user}</div>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className={`px-2 py-1 rounded-full ${
                              comment.role === 'council' ? 'bg-purple-600/20 text-purple-300' :
                              comment.role === 'moderator' ? 'bg-emerald-600/20 text-emerald-300' :
                              'bg-indigo-600/20 text-indigo-300'
                            }`}>
                              {comment.role.toUpperCase()}
                            </span>
                            <span className="text-indigo-400">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-indigo-400">
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes}</span>
                      </div>
                    </div>
                    
                    <p className="text-indigo-100 mb-3">{comment.content}</p>
                    
                    {comment.replies.length > 0 && (
                      <div className="ml-8 space-y-3 border-l-2 border-indigo-700/30 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="bg-indigo-900/30 p-3 rounded">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-white text-sm">{reply.user}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                reply.role === 'council' ? 'bg-purple-600/20 text-purple-300' :
                                reply.role === 'moderator' ? 'bg-emerald-600/20 text-emerald-300' :
                                'bg-indigo-600/20 text-indigo-300'
                              }`}>
                                {reply.role.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-indigo-100 text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Comment Form */}
                <div className="bg-indigo-800/20 p-4 border border-indigo-700/20">
                  <h4 className="text-lg font-bold text-white mb-3">Join the Discussion</h4>
                  <textarea 
                    className="w-full bg-indigo-900/30 border border-indigo-700/30 text-white p-3 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                    placeholder="Share your thoughts on this proposal..."
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-indigo-300">
                      Remember: Keep discussions respectful and focused on the proposal.
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vote Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && selectedVote && (
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
              className="bg-indigo-900 border border-indigo-700 p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Vote className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Your Vote</h3>
                <p className="text-indigo-200 mb-6">
                  You are about to vote <span className="font-bold text-purple-300">
                    {selectedVote.toUpperCase()}
                  </span> on this proposal. This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={confirmVote}
                    disabled={isVoting}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isVoting ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      'Confirm Vote'
                    )}
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isVoting}
                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProposalVotingInterface