// Community Instagram Source Manager
// Allows community members to suggest and verify grassroots Black LGBT Instagram accounts
// Addresses the critical gap of smaller organizations without websites

import React, { useState, useEffect } from 'react';
import { instagramContentDiscoveryService, InstagramSource } from '../../services/instagramContentDiscovery';
import { supabase } from '../../lib/supabase';

interface InstagramSourceSuggestion {
  id: string;
  suggested_handle: string;
  suggested_organization_name: string;
  location: string;
  focus_areas: string[];
  suggested_by: string;
  suggestion_reason: string;
  community_vouches: number;
  status: 'pending' | 'approved' | 'rejected' | 'needs_more_info';
  created_at: string;
}

interface CommunityInstagramSourceManagerProps {
  className?: string;
}

const CommunityInstagramSourceManager: React.FC<CommunityInstagramSourceManagerProps> = ({ 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'verified' | 'pending' | 'suggest'>('verified');
  const [verifiedSources, setVerifiedSources] = useState<InstagramSource[]>([]);
  const [pendingSuggestions, setPendingSuggestions] = useState<InstagramSourceSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New suggestion form state
  const [newSuggestion, setNewSuggestion] = useState({
    handle: '',
    organizationName: '',
    location: '',
    focusAreas: [] as string[],
    reason: ''
  });

  const liberationFocusOptions = [
    'Black liberation and racial justice',
    'LGBTQ+ rights and queer liberation', 
    'Trans rights and gender justice',
    'Disability justice and accessibility',
    'Economic justice and cooperative economics',
    'Community organizing and mutual aid',
    'Youth empowerment and mentorship',
    'Environmental justice',
    'Housing rights and community ownership',
    'Cultural preservation and celebration',
    'Mental health and community care',
    'Education and skill sharing',
    'Arts and creative expression',
    'Spiritual and healing practices'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [verifiedResult, pendingResult] = await Promise.all([
        supabase
          .from('instagram_sources')
          .select('*')
          .eq('verified_community_org', true)
          .eq('active', true)
          .order('organization_name'),
        supabase
          .from('instagram_source_suggestions')
          .select('*')
          .eq('status', 'pending')
          .order('community_vouches', { ascending: false })
      ]);

      if (verifiedResult.data) {
        setVerifiedSources(verifiedResult.data);
      }
      
      if (pendingResult.data) {
        setPendingSuggestions(pendingResult.data);
      }
    } catch (error) {
      console.error('Failed to load Instagram source data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestSource = async () => {
    try {
      if (!newSuggestion.handle || !newSuggestion.organizationName || !newSuggestion.location) {
        alert('Please fill in all required fields');
        return;
      }

      // Get current user (would need auth integration)
      const currentUserId = 'current-user-id'; // Placeholder

      const { error } = await supabase
        .from('instagram_source_suggestions')
        .insert([{
          suggested_handle: newSuggestion.handle.startsWith('@') 
            ? newSuggestion.handle 
            : `@${newSuggestion.handle}`,
          suggested_organization_name: newSuggestion.organizationName,
          location: newSuggestion.location,
          focus_areas: newSuggestion.focusAreas,
          suggested_by: currentUserId,
          suggestion_reason: newSuggestion.reason
        }]);

      if (error) throw error;

      // Reset form
      setNewSuggestion({
        handle: '',
        organizationName: '',
        location: '',
        focusAreas: [],
        reason: ''
      });

      // Refresh data
      await loadData();
      
      alert('Instagram source suggested! It will be reviewed by the community.');
    } catch (error) {
      console.error('Failed to suggest Instagram source:', error);
      alert('Failed to suggest Instagram source. Please try again.');
    }
  };

  const handleVouchForSuggestion = async (suggestionId: string) => {
    try {
      // Increment vouch count
      const { error } = await supabase
        .from('instagram_source_suggestions')
        .update({ 
          community_vouches: supabase.sql`community_vouches + 1`
        })
        .eq('id', suggestionId);

      if (error) throw error;
      
      await loadData();
      alert('Your vouch has been recorded!');
    } catch (error) {
      console.error('Failed to vouch for suggestion:', error);
      alert('Failed to vouch. Please try again.');
    }
  };

  const handleApproveSuggestion = async (suggestion: InstagramSourceSuggestion) => {
    try {
      // Create verified Instagram source
      const success = await instagramContentDiscoveryService.addCommunityInstagramSource(
        suggestion.suggested_handle,
        suggestion.suggested_organization_name,
        suggestion.location,
        suggestion.focus_areas,
        'community-approved'
      );

      if (success) {
        // Update suggestion status
        await supabase
          .from('instagram_source_suggestions')
          .update({ 
            status: 'approved',
            reviewed_by: 'current-user-id', // Placeholder
            reviewed_at: new Date().toISOString()
          })
          .eq('id', suggestion.id);

        await loadData();
        alert(`${suggestion.suggested_organization_name} approved as Instagram source!`);
      }
    } catch (error) {
      console.error('Failed to approve suggestion:', error);
      alert('Failed to approve suggestion. Please try again.');
    }
  };

  const handleFocusAreaToggle = (focusArea: string) => {
    const updatedAreas = newSuggestion.focusAreas.includes(focusArea)
      ? newSuggestion.focusAreas.filter(area => area !== focusArea)
      : [...newSuggestion.focusAreas, focusArea];
    
    setNewSuggestion(prev => ({ ...prev, focusAreas: updatedAreas }));
  };

  const VerifiedSourceCard: React.FC<{ source: InstagramSource }> = ({ source }) => (
    <div className="bg-white rounded-lg p-6 border-l-4 border-green-500 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{source.organization_name}</h3>
          <a 
            href={`https://instagram.com/${source.handle.replace('@', '')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 font-mono"
          >
            {source.handle}
          </a>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 text-xs rounded ${
            source.trust_level === 'high' ? 'bg-green-100 text-green-800' :
            source.trust_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-700'
          }`}>
            {source.trust_level} trust
          </span>
          <div className="text-sm text-gray-500 mt-1">{source.location}</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {source.focus_areas.map(area => (
          <span 
            key={area} 
            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
          >
            {area}
          </span>
        ))}
      </div>
      
      {source.events_discovered_count > 0 && (
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <div className="text-sm text-green-800">
            <strong>Impact:</strong> Discovered {source.events_discovered_count} events
            {source.avg_relevance_score && (
              <span> • Avg relevance: {(source.avg_relevance_score * 100).toFixed(0)}%</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const PendingSuggestionCard: React.FC<{ suggestion: InstagramSourceSuggestion }> = ({ suggestion }) => (
    <div className="bg-white rounded-lg p-6 border-l-4 border-yellow-500 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{suggestion.suggested_organization_name}</h3>
          <a 
            href={`https://instagram.com/${suggestion.suggested_handle.replace('@', '')}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 font-mono"
          >
            {suggestion.suggested_handle}
          </a>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-purple-600">{suggestion.community_vouches}</div>
          <div className="text-sm text-gray-500">community vouches</div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600 text-sm">{suggestion.suggestion_reason}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestion.focus_areas.map(area => (
          <span 
            key={area} 
            className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
          >
            {area}
          </span>
        ))}
        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
          {suggestion.location}
        </span>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={() => handleVouchForSuggestion(suggestion.id)}
          className="flex-1 bg-purple-100 text-purple-800 px-3 py-2 rounded text-sm hover:bg-purple-200"
        >
          👍 Vouch ({suggestion.community_vouches})
        </button>
        <button
          onClick={() => handleApproveSuggestion(suggestion)}
          className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600"
        >
          ✅ Approve
        </button>
        <a
          href={`https://instagram.com/${suggestion.suggested_handle.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 text-center"
        >
          📱 Check Account
        </a>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Community Instagram Source Manager</h2>
        <p className="text-pink-100">
          📱 Discover events from grassroots Black LGBT organizations on Instagram
        </p>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{verifiedSources.length}</div>
            <div className="text-sm text-pink-200">Verified Sources</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{pendingSuggestions.length}</div>
            <div className="text-sm text-pink-200">Pending Review</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {verifiedSources.reduce((sum, source) => sum + (source.events_discovered_count || 0), 0)}
            </div>
            <div className="text-sm text-pink-200">Events Discovered</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'verified', label: `Verified Sources (${verifiedSources.length})`, icon: '✅' },
              { key: 'pending', label: `Pending Review (${pendingSuggestions.length})`, icon: '⏳' },
              { key: 'suggest', label: 'Suggest New Source', icon: '💡' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Verified Sources */}
          {activeTab === 'verified' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Community-Verified Instagram Sources
              </h3>
              <p className="text-gray-600">
                These grassroots Black LGBT organizations are trusted sources for event discovery.
              </p>
              
              {verifiedSources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No verified sources yet. Help the community by suggesting Instagram accounts!
                </div>
              ) : (
                <div className="grid gap-4">
                  {verifiedSources.map(source => (
                    <VerifiedSourceCard key={source.id} source={source} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending Suggestions */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Community Suggestions Pending Review
              </h3>
              <p className="text-gray-600">
                Help verify these suggested grassroots organizations by vouching or reviewing their Instagram accounts.
              </p>
              
              {pendingSuggestions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending suggestions. Great job community!
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingSuggestions.map(suggestion => (
                    <PendingSuggestionCard key={suggestion.id} suggestion={suggestion} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Suggest New Source */}
          {activeTab === 'suggest' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Suggest a Grassroots Black LGBT Instagram Account
                </h3>
                <p className="text-gray-600">
                  Know a community organization that organizes events on Instagram? 
                  Help us discover grassroots Black LGBT organizing!
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  🎯 What we're looking for:
                </h4>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Grassroots Black LGBT organizations (any size)</li>
                  <li>• Community groups that organize events, workshops, or gatherings</li>
                  <li>• Mutual aid networks and support groups</li>
                  <li>• Cultural collectives and creative spaces</li>
                  <li>• Activist groups and organizing collectives</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Handle *
                  </label>
                  <input
                    type="text"
                    value={newSuggestion.handle}
                    onChange={(e) => setNewSuggestion(prev => ({ ...prev, handle: e.target.value }))}
                    placeholder="@blackpridelondon"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={newSuggestion.organizationName}
                    onChange={(e) => setNewSuggestion(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="Black Pride London"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newSuggestion.location}
                    onChange={(e) => setNewSuggestion(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="London, Birmingham, Online, etc."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Liberation Focus (select all that apply)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {liberationFocusOptions.map(option => (
                      <label key={option} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={newSuggestion.focusAreas.includes(option)}
                          onChange={() => handleFocusAreaToggle(option)}
                          className="text-purple-600 rounded"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why should we add this account?
                  </label>
                  <textarea
                    value={newSuggestion.reason}
                    onChange={(e) => setNewSuggestion(prev => ({ ...prev, reason: e.target.value }))}
                    rows={4}
                    placeholder="Tell us about the organization, what events they organize, why they're important to the community..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={handleSuggestSource}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  💡 Suggest Instagram Source
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityInstagramSourceManager;