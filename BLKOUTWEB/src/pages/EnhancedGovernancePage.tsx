// Enhanced Governance Page with Optional IVOR Integration
// Demonstrates federated independence - full functionality alone, enhanced when IVOR available
// File: src/pages/EnhancedGovernancePage.tsx

import React, { useState, useEffect } from 'react';
import { governanceEnhancement } from '../services/GracefulEnhancement';
import { serviceDiscovery } from '../services/OptionalServiceDiscovery';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'draft' | 'active' | 'approved' | 'rejected';
  created_at: string;
  votes?: any[];
  wisdomInsights?: any;
  relatedEvents?: any[];
  enhanced?: boolean;
}

interface ServiceStatus {
  name: string;
  available: boolean;
  responseTime?: number;
  capabilities: string[];
}

export const EnhancedGovernancePage: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [showServiceStatus, setShowServiceStatus] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    proposer: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadGovernanceData();
    checkServiceStatuses();
    
    // Refresh service statuses every 30 seconds
    const interval = setInterval(checkServiceStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadGovernanceData = async () => {
    setLoading(true);
    try {
      // Load local proposals with optional enhancements
      const demoProposals = [
        {
          id: 'prop_1',
          title: 'Community Safety Guidelines Update',
          description: 'Proposal to update our community safety guidelines to better protect vulnerable members.',
          proposer: 'SafetyCommittee',
          status: 'active' as const,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          votes: []
        },
        {
          id: 'prop_2', 
          title: 'Resource Allocation for Community Events',
          description: 'Proposal to allocate 30% of community funds toward organizing local events and gatherings.',
          proposer: 'EventsTeam',
          status: 'active' as const,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          votes: []
        }
      ];

      // Enhance each proposal with optional services
      const enhancedProposals = await Promise.all(
        demoProposals.map(async (proposal) => {
          try {
            const result = await governanceEnhancement.displayProposal(proposal);
            return result.baseData;
          } catch (error) {
            console.warn(`Failed to enhance proposal ${proposal.id}:`, error);
            return proposal;
          }
        })
      );

      setProposals(enhancedProposals);
    } catch (error) {
      console.error('Failed to load governance data:', error);
      // Fallback to basic proposals
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  const checkServiceStatuses = async () => {
    try {
      const services = serviceDiscovery.getAllServices();
      const statuses = await Promise.all(
        services.map(async (service) => {
          try {
            const available = await serviceDiscovery.isServiceAvailable(service.name);
            const health = serviceDiscovery.getServiceHealth(service.name);
            
            return {
              name: service.name,
              available,
              responseTime: health?.responseTime,
              capabilities: service.capabilities
            };
          } catch (error) {
            return {
              name: service.name,
              available: false,
              capabilities: service.capabilities
            };
          }
        })
      );
      
      setServiceStatuses(statuses);
    } catch (error) {
      console.error('Failed to check service statuses:', error);
    }
  };

  const handleCreateProposal = async () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const proposal = {
        id: 'prop_' + Date.now(),
        ...newProposal,
        status: 'draft' as const,
        created_at: new Date().toISOString(),
        votes: []
      };

      // Enhance the new proposal
      const result = await governanceEnhancement.displayProposal(proposal);
      const enhancedProposal = result.baseData;

      setProposals(prev => [enhancedProposal, ...prev]);
      setNewProposal({ title: '', description: '', proposer: '' });
      setShowCreateForm(false);

    } catch (error) {
      console.error('Failed to create proposal:', error);
      alert('Failed to create proposal. Please try again.');
    }
  };

  const handleVote = async (proposalId: string, choice: 'approve' | 'reject') => {
    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return;

      // Conduct voting with optional enhancements
      await governanceEnhancement.conductVoting(proposal);
      
      // Update proposal with vote
      const updatedProposals = proposals.map(p => 
        p.id === proposalId 
          ? { 
              ...p, 
              votes: [...(p.votes || []), { 
                choice, 
                timestamp: new Date().toISOString(),
                voter: 'current_user'
              }]
            }
          : p
      );

      setProposals(updatedProposals);
      
    } catch (error) {
      console.error('Voting failed:', error);
      alert('Voting failed. Please try again.');
    }
  };

  const getProposalStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availableServicesCount = serviceStatuses.filter(s => s.available).length;
  const totalServicesCount = serviceStatuses.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading governance system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-black py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Democratic Governance
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Community-driven decision making with optional AI wisdom and federated enhancements
          </p>
        </div>

        {/* Service Status Indicator */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowServiceStatus(!showServiceStatus)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-1">
              <div className={`w-3 h-3 rounded-full ${availableServicesCount > 0 ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-sm">
                {availableServicesCount}/{totalServicesCount} services available
              </span>
            </div>
            <svg className={`w-4 h-4 transition-transform ${showServiceStatus ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Create Proposal
          </button>
        </div>

        {/* Service Status Details */}
        {showServiceStatus && (
          <div className="mb-6 bg-gray-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Federation Services Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {serviceStatuses.map(service => (
                <div key={service.name} className="bg-gray-700 rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{service.name}</h4>
                    <div className={`w-2 h-2 rounded-full ${service.available ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {service.available ? 'Available' : 'Unavailable'}
                  </p>
                  {service.responseTime && (
                    <p className="text-gray-400 text-xs">
                      Response: {service.responseTime}ms
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {service.capabilities.slice(0, 2).map(cap => (
                      <span key={cap} className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Proposal Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-white text-lg font-semibold mb-4">Create New Proposal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={newProposal.title}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="Proposal title"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Description</label>
                  <textarea
                    value={newProposal.description}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="Detailed description of the proposal"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Proposer</label>
                  <input
                    type="text"
                    value={newProposal.proposer}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, proposer: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                    placeholder="Your name or committee name"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateProposal}
                  className="flex-1 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Create Proposal
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Proposals List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {proposals.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No active proposals</div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
              >
                Create First Proposal
              </button>
            </div>
          ) : (
            proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => setSelectedProposal(proposal)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-lg">{proposal.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProposalStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                    {proposal.enhanced && (
                      <div className="flex items-center text-green-400 text-xs">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Enhanced
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {proposal.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>By: {proposal.proposer}</span>
                  <span>{new Date(proposal.created_at).toLocaleDateString()}</span>
                </div>

                {proposal.wisdomInsights && (
                  <div className="mt-3 p-3 bg-violet-900/30 rounded border-l-2 border-violet-400">
                    <div className="flex items-center text-violet-300 text-xs mb-1">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      AI Wisdom ({proposal.wisdomInsights.source})
                    </div>
                    <p className="text-gray-200 text-sm">
                      {proposal.wisdomInsights.insight}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(proposal.id, 'approve');
                    }}
                    className="flex-1 py-2 px-4 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                  >
                    Approve ({proposal.votes?.filter(v => v.choice === 'approve').length || 0})
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(proposal.id, 'reject');
                    }}
                    className="flex-1 py-2 px-4 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Reject ({proposal.votes?.filter(v => v.choice === 'reject').length || 0})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detailed Proposal Modal */}
        {selectedProposal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-xl font-semibold">{selectedProposal.title}</h3>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-300 font-medium mb-2">Description</h4>
                  <p className="text-white">{selectedProposal.description}</p>
                </div>

                {selectedProposal.wisdomInsights && (
                  <div className="p-4 bg-violet-900/30 rounded border-l-4 border-violet-400">
                    <h4 className="text-violet-300 font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      AI Wisdom from {selectedProposal.wisdomInsights.source}
                    </h4>
                    <p className="text-gray-200">{selectedProposal.wisdomInsights.insight}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      Relevance: {Math.round(selectedProposal.wisdomInsights.relevance * 100)}% | 
                      Confidence: {Math.round(selectedProposal.wisdomInsights.confidence * 100)}%
                    </div>
                  </div>
                )}

                {selectedProposal.relatedEvents && selectedProposal.relatedEvents.length > 0 && (
                  <div>
                    <h4 className="text-gray-300 font-medium mb-2">Related Events</h4>
                    <div className="space-y-2">
                      {selectedProposal.relatedEvents.map((event, index) => (
                        <div key={index} className="p-2 bg-gray-700 rounded">
                          <p className="text-white text-sm">{event.title || 'Community Event'}</p>
                          <p className="text-gray-400 text-xs">{event.date || 'Date TBD'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-gray-300 font-medium mb-2">Voting Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-900/30 rounded">
                      <div className="text-green-400 text-lg font-semibold">
                        {selectedProposal.votes?.filter(v => v.choice === 'approve').length || 0}
                      </div>
                      <div className="text-green-300 text-sm">Approve</div>
                    </div>
                    <div className="p-3 bg-red-900/30 rounded">
                      <div className="text-red-400 text-lg font-semibold">
                        {selectedProposal.votes?.filter(v => v.choice === 'reject').length || 0}
                      </div>
                      <div className="text-red-300 text-sm">Reject</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedGovernancePage;