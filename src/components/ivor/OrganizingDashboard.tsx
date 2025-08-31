// IVOR Organizing Dashboard - Democratic Project Coordination
// Community-driven project management and resource mobilization interface

import React, { useState, useEffect } from 'react';
import { ivorAPI } from '../../lib/api-client';

export interface OrganizingProject {
  id?: string;
  title: string;
  description: string;
  project_type: 'housing' | 'healthcare' | 'safety' | 'economic' | 'education' | 'policy';
  journey_stage: string;
  community_need_areas: string[];
  organizing_stage: 'awareness' | 'education' | 'action' | 'leadership' | 'system_change';
  liberation_objectives: string[];
  democratic_validation_score: number;
  community_support_level: number;
  status: 'proposed' | 'validated' | 'active' | 'completed' | 'archived';
  skills_needed: string[];
}

interface OrganizingDashboardProps {
  session_id: string;
  user_context?: {
    location?: string;
    empowerment_goals?: string[];
    organizing_experience?: 'none' | 'some' | 'experienced';
    available_time?: 'low' | 'medium' | 'high';
    skills?: string[];
  };
}

interface ProjectValidation {
  project_id: string;
  validation_type: 'peer_review' | 'community_consensus' | 'expert_validation' | 'lived_experience';
  cultural_authenticity_score: number;
  liberation_alignment_score: number;
  feedback_text: string;
  validation_status: 'pending' | 'approved' | 'needs_revision' | 'rejected';
}

export const OrganizingDashboard: React.FC<OrganizingDashboardProps> = ({
  session_id,
  user_context = {}
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'opportunities' | 'create' | 'validate'>('projects');
  const [activeProjects, setActiveProjects] = useState<OrganizingProject[]>([]);
  const [opportunities, setOpportunities] = useState<OrganizingOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<OrganizingProject | null>(null);
  
  // Project creation form state
  const [newProject, setNewProject] = useState<Partial<OrganizingProject>>({
    title: '',
    description: '',
    project_type: 'housing',
    journey_stage: 'action',
    community_need_areas: [],
    organizing_stage: 'awareness',
    collaboration_requirements: {},
    resource_needs: {},
    skills_needed: [],
    community_impact_goals: [],
    liberation_objectives: [],
    democratic_validation_score: 0,
    community_support_level: 0,
    success_metrics: {},
    coordinator_info: {},
    status: 'proposed'
  });

  // Validation form state
  const [validation, setValidation] = useState<Partial<ProjectValidation>>({
    validation_type: 'peer_review',
    cultural_authenticity_score: 80,
    liberation_alignment_score: 80,
    feedback_text: '',
    validation_status: 'pending'
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load all dashboard data
   */
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadActiveProjects(),
        loadOrganizingOpportunities()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load active organizing projects
   */
  const loadActiveProjects = async () => {
    try {
      const result = await ivorAPI.getActiveProjects({
        geographic_area: user_context.location
      });
      
      if (result.success) {
        setActiveProjects(result.data || []);
      } else {
        console.error('Error loading projects:', result.error);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  /**
   * Load organizing opportunities
   */
  const loadOrganizingOpportunities = async () => {
    try {
      // Mock opportunities for demo
      const mockOpportunities = [
        {
          opportunity_type: 'housing_campaign' as const,
          urgency_level: 'high' as const,
          geographic_area: user_context.location || 'Local Area',
          community_readiness_score: 87,
          liberation_relevance: 92,
          required_skills: ['tenant_organizing', 'community_outreach', 'legal_advocacy'],
          timeline_estimate: '3-6 months',
          collaboration_potential: 85
        },
        {
          opportunity_type: 'healthcare_access' as const,
          urgency_level: 'medium' as const,
          geographic_area: user_context.location || 'Local Area',
          community_readiness_score: 78,
          liberation_relevance: 88,
          required_skills: ['healthcare_advocacy', 'community_education', 'policy_research'],
          timeline_estimate: '2-4 months',
          collaboration_potential: 79
        }
      ];
      
      setOpportunities(mockOpportunities);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    }
  };

  /**
   * Create new organizing project
   */
  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert('Please fill in title and description');
      return;
    }

    setIsLoading(true);
    try {
      const result = await ivorAPI.createProject(
        newProject,
        {
          session_id,
          empowerment_goals: user_context.empowerment_goals || [],
          location: user_context.location
        }
      );

      if (result.success) {
        alert('Project created successfully! Community validation in progress.');
        setShowProjectForm(false);
        setNewProject({
          title: '',
          description: '',
          project_type: 'housing',
          journey_stage: 'action',
          community_need_areas: [],
          organizing_stage: 'awareness',
          liberation_objectives: [],
          democratic_validation_score: 0,
          community_support_level: 0,
          status: 'proposed',
          skills_needed: []
        });
        await loadActiveProjects();
      } else {
        alert(`Error creating project: ${result.error}`);
      }

    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Submit community validation
   */
  const handleSubmitValidation = async () => {
    if (!selectedProject || !validation.feedback_text) {
      alert('Please select a project and provide feedback');
      return;
    }

    setIsLoading(true);
    try {
      const result = await organizingCoordination.submitCommunityValidation(
        selectedProject.id!,
        {
          validator_session_id: session_id,
          validation_type: validation.validation_type!,
          validation_criteria: ['cultural_authenticity', 'liberation_alignment', 'community_impact'],
          cultural_authenticity_score: validation.cultural_authenticity_score!,
          liberation_alignment_score: validation.liberation_alignment_score!,
          community_impact_assessment: {
            expected_reach: validation.cultural_authenticity_score! + validation.liberation_alignment_score! / 2
          },
          feedback_text: validation.feedback_text!,
          validation_status: validation.validation_status!,
          created_at: new Date().toISOString()
        }
      );

      if (result.success) {
        alert('Validation submitted successfully!');
        setValidation({
          validation_type: 'peer_review',
          cultural_authenticity_score: 80,
          liberation_alignment_score: 80,
          feedback_text: '',
          validation_status: 'pending'
        });
        setSelectedProject(null);
        await loadActiveProjects();
      } else {
        alert(`Error submitting validation: ${result.error}`);
      }

    } catch (error) {
      console.error('Error submitting validation:', error);
      alert('Error submitting validation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Join organizing project
   */
  const handleJoinProject = async (project: OrganizingProject) => {
    try {
      // Publish community event for project participation
      await eventCoordination.publishEvent({
        event_type: 'ProjectUpdate',
        source_domain: 'organizing',
        target_domains: ['community', 'core'],
        event_data: {
          action: 'user_joined_project',
          project_id: project.id,
          project_type: project.project_type,
          user_session_id: session_id,
          user_skills: user_context.skills || [],
          available_time: user_context.available_time || 'medium'
        },
        journey_context: {
          stage: project.journey_stage,
          organizing_stage: project.organizing_stage
        },
        liberation_relevance_score: project.democratic_validation_score,
        cultural_sensitivity_check: true,
        community_consent_verified: true
      });

      alert('Successfully joined project! You will receive coordination updates.');

    } catch (error) {
      console.error('Error joining project:', error);
      alert('Error joining project. Please try again.');
    }
  };

  /**
   * Get urgency color for opportunities
   */
  const getUrgencyColor = (urgency: string) => {
    const colors = {
      critical: 'text-red-400 border-red-500/50',
      high: 'text-orange-400 border-orange-500/50',
      medium: 'text-yellow-400 border-yellow-500/50',
      low: 'text-green-400 border-green-500/50'
    };
    return colors[urgency as keyof typeof colors] || colors.medium;
  };

  /**
   * Get project type icon
   */
  const getProjectTypeIcon = (type: string) => {
    const icons = {
      housing: '🏠',
      healthcare: '🏥',
      safety: '🛡️',
      economic: '💰',
      education: '📚',
      policy: '📋'
    };
    return icons[type as keyof typeof icons] || '⚡';
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg border border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-red-600 p-4 rounded-t-lg">
        <h2 className="text-xl font-bold text-white">IVOR Organizing Dashboard</h2>
        <p className="text-sm text-gray-200">Democratic community project coordination</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="flex space-x-0">
          {[
            { id: 'projects', label: 'Active Projects', icon: '📋' },
            { id: 'opportunities', label: 'Opportunities', icon: '💡' },
            { id: 'create', label: 'Create Project', icon: '➕' },
            { id: 'validate', label: 'Community Validation', icon: '✅' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-purple-300 border-purple-500 bg-purple-900/20'
                  : 'text-gray-400 border-transparent hover:text-purple-200 hover:border-purple-500/30'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Active Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Active Community Projects</h3>
              <button
                onClick={loadActiveProjects}
                className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 text-sm rounded border border-purple-500/30 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? '⟳' : '🔄'} Refresh
              </button>
            </div>

            <div className="grid gap-4">
              {activeProjects.map(project => (
                <div key={project.id} className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-4 rounded-lg border border-gray-600/50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getProjectTypeIcon(project.project_type)}</span>
                      <div>
                        <h4 className="font-semibold text-white">{project.title}</h4>
                        <p className="text-sm text-gray-300 capitalize">{project.project_type} • {project.organizing_stage.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-purple-300">Validation: {project.democratic_validation_score}%</div>
                      <div className="text-green-300">Support: {project.community_support_level}%</div>
                    </div>
                  </div>

                  <p className="text-gray-200 mb-3 text-sm">{project.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                    <div>
                      <span className="text-purple-300">Liberation Goals:</span>
                      <div className="text-gray-300 mt-1">
                        {project.liberation_objectives.slice(0, 2).map(goal => (
                          <span key={goal} className="inline-block bg-purple-900/30 px-2 py-1 rounded mr-1 mb-1">
                            {goal.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-300">Skills Needed:</span>
                      <div className="text-gray-300 mt-1">
                        {project.skills_needed.slice(0, 3).map(skill => (
                          <span key={skill} className="inline-block bg-blue-900/30 px-2 py-1 rounded mr-1 mb-1">
                            {skill.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      Status: <span className={`capitalize ${project.status === 'validated' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleJoinProject(project)}
                        className="px-3 py-1 bg-green-600/20 hover:bg-green-600/40 text-green-200 text-sm rounded border border-green-500/30 transition-colors"
                      >
                        Join Project
                      </button>
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 text-sm rounded border border-purple-500/30 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {activeProjects.length === 0 && !isLoading && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">📋</div>
                  <p>No active projects found in your area.</p>
                  <p className="text-sm mt-1">Create a new project to get started!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Organizing Opportunities</h3>
              <button
                onClick={loadOrganizingOpportunities}
                className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 text-sm rounded border border-purple-500/30 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? '⟳' : '🔄'} Refresh
              </button>
            </div>

            <div className="grid gap-4">
              {opportunities.map((opp, index) => (
                <div key={index} className={`bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-4 rounded-lg border ${getUrgencyColor(opp.urgency_level)}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white capitalize">{opp.opportunity_type.replace('_', ' ')}</h4>
                      <p className="text-sm text-gray-300">
                        {opp.geographic_area} • Urgency: <span className="capitalize">{opp.urgency_level}</span>
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-purple-300">Readiness: {opp.community_readiness_score}%</div>
                      <div className="text-yellow-300">Liberation: {opp.liberation_relevance}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                    <div>
                      <span className="text-green-300">Required Skills:</span>
                      <div className="text-gray-300 mt-1">
                        {opp.required_skills.slice(0, 3).map(skill => (
                          <span key={skill} className="inline-block bg-green-900/30 px-2 py-1 rounded mr-1 mb-1">
                            {skill.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-300">Timeline:</span>
                      <div className="text-gray-300 mt-1">{opp.timeline_estimate}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400">
                      Collaboration Potential: {opp.collaboration_potential}%
                    </div>
                    <button
                      onClick={() => {
                        setNewProject({
                          ...newProject,
                          title: `${opp.opportunity_type.replace('_', ' ')} - ${opp.geographic_area}`,
                          project_type: opp.opportunity_type.includes('housing') ? 'housing' 
                            : opp.opportunity_type.includes('healthcare') ? 'healthcare'
                            : 'policy',
                          skills_needed: opp.required_skills,
                          community_impact_goals: opp.expected_impact.liberation_outcomes || []
                        });
                        setActiveTab('create');
                      }}
                      className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/40 text-orange-200 text-sm rounded border border-orange-500/30 transition-colors"
                    >
                      Start Project
                    </button>
                  </div>
                </div>
              ))}

              {opportunities.length === 0 && !isLoading && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-2">💡</div>
                  <p>No organizing opportunities identified yet.</p>
                  <p className="text-sm mt-1">Check back as community patterns emerge!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create Project Tab */}
        {activeTab === 'create' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Create Community Project</h3>
            
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-6 rounded-lg border border-gray-600/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={newProject.title || ''}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Housing Justice Coalition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
                  <select
                    value={newProject.project_type || 'housing'}
                    onChange={(e) => setNewProject({...newProject, project_type: e.target.value as OrganizingProject['project_type']})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="housing">🏠 Housing Justice</option>
                    <option value="healthcare">🏥 Healthcare Access</option>
                    <option value="safety">🛡️ Community Safety</option>
                    <option value="economic">💰 Economic Justice</option>
                    <option value="education">📚 Educational Equity</option>
                    <option value="policy">📋 Policy Reform</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={newProject.description || ''}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your project's goals, community impact, and liberation focus..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Organizing Stage</label>
                  <select
                    value={newProject.organizing_stage || 'awareness'}
                    onChange={(e) => setNewProject({...newProject, organizing_stage: e.target.value as OrganizingProject['organizing_stage']})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="awareness">Awareness Building</option>
                    <option value="education">Community Education</option>
                    <option value="action">Direct Action</option>
                    <option value="leadership">Leadership Development</option>
                    <option value="system_change">System Change</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Journey Stage</label>
                  <select
                    value={newProject.journey_stage || 'action'}
                    onChange={(e) => setNewProject({...newProject, journey_stage: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="action">Action</option>
                    <option value="campaign_participation">Campaign Participation</option>
                    <option value="leadership">Leadership</option>
                    <option value="organizing">Community Organizing</option>
                    <option value="system_change">System Change</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setNewProject({
                    title: '',
                    description: '',
                    project_type: 'housing',
                    journey_stage: 'action',
                    community_need_areas: [],
                    organizing_stage: 'awareness',
                    collaboration_requirements: {},
                    resource_needs: {},
                    skills_needed: [],
                    community_impact_goals: [],
                    liberation_objectives: [],
                    democratic_validation_score: 0,
                    community_support_level: 0,
                    success_metrics: {},
                    coordinator_info: {},
                    status: 'proposed'
                  })}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Clear Form
                </button>
                <button
                  onClick={handleCreateProject}
                  disabled={isLoading || !newProject.title || !newProject.description}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Community Validation Tab */}
        {activeTab === 'validate' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Community Project Validation</h3>
            
            <div className="bg-gradient-to-r from-green-900/20 to-blue-600/20 p-4 rounded-lg border border-green-500/30">
              <h4 className="font-medium text-green-200 mb-2">Community Validation Process</h4>
              <p className="text-sm text-green-100">
                Help ensure projects align with community values, cultural authenticity, and liberation goals through peer review and validation.
              </p>
            </div>

            {/* Project Selection */}
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-4 rounded-lg border border-gray-600/50">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Project to Validate</label>
              <select
                value={selectedProject?.id || ''}
                onChange={(e) => setSelectedProject(activeProjects.find(p => p.id === e.target.value) || null)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a project...</option>
                {activeProjects.filter(p => p.status === 'proposed').map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title} ({project.project_type})
                  </option>
                ))}
              </select>
            </div>

            {selectedProject && (
              <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/30 p-6 rounded-lg border border-gray-600/50">
                <h4 className="font-semibold text-white mb-3">Validating: {selectedProject.title}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Validation Type</label>
                    <select
                      value={validation.validation_type || 'peer_review'}
                      onChange={(e) => setValidation({...validation, validation_type: e.target.value as ProjectValidation['validation_type']})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="peer_review">Peer Review</option>
                      <option value="community_consensus">Community Consensus</option>
                      <option value="expert_validation">Expert Validation</option>
                      <option value="lived_experience">Lived Experience</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Validation Status</label>
                    <select
                      value={validation.validation_status || 'pending'}
                      onChange={(e) => setValidation({...validation, validation_status: e.target.value as ProjectValidation['validation_status']})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="approved">✅ Approved</option>
                      <option value="needs_revision">🔄 Needs Revision</option>
                      <option value="rejected">❌ Rejected</option>
                      <option value="pending">⏳ Pending Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cultural Authenticity Score</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={validation.cultural_authenticity_score || 80}
                      onChange={(e) => setValidation({...validation, cultural_authenticity_score: Number(e.target.value)})}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400">{validation.cultural_authenticity_score || 80}%</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Liberation Alignment Score</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={validation.liberation_alignment_score || 80}
                      onChange={(e) => setValidation({...validation, liberation_alignment_score: Number(e.target.value)})}
                      className="w-full"
                    />
                    <div className="text-center text-sm text-gray-400">{validation.liberation_alignment_score || 80}%</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Validation Feedback</label>
                  <textarea
                    value={validation.feedback_text || ''}
                    onChange={(e) => setValidation({...validation, feedback_text: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                    placeholder="Provide detailed feedback on cultural authenticity, liberation alignment, and community impact..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitValidation}
                    disabled={isLoading || !validation.feedback_text}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Validation'}
                  </button>
                </div>
              </div>
            )}

            {activeProjects.filter(p => p.status === 'proposed').length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">✅</div>
                <p>No projects currently pending validation.</p>
                <p className="text-sm mt-1">Check back when new projects are proposed!</p>
              </div>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                <span className="text-white">Processing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizingDashboard;