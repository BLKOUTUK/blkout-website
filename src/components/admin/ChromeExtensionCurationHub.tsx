// Chrome Extension Community Curation Hub
// Enables members and community organisers to manually curate content
// Feeds submissions back to IVOR's knowledge base for improved automated discovery

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ManualSubmission {
  id?: string;
  title: string;
  url: string;
  description: string;
  submissionType: 'event' | 'news' | 'organization' | 'resource';
  submittedBy: string;
  submissionDate: Date;
  location?: string;
  eventDate?: Date;
  organizationName?: string;
  liberationRelevance: number; // 0.0-1.0
  liberationFocus: string[];
  sourceType: 'chrome-extension' | 'manual-form' | 'community-suggestion';
  verificationStatus: 'pending' | 'verified' | 'needs-review' | 'rejected';
  ivorTrainingValue: number; // How valuable this is for IVOR training
  communityVotes: number;
  tags: string[];
}

interface CurationStats {
  totalSubmissions: number;
  verifiedSubmissions: number;
  ivorIntegrations: number;
  communityContributors: number;
  sourcesIdentified: number;
}

const ChromeExtensionCurationHub: React.FC = () => {
  const [submissions, setSubmissions] = useState<ManualSubmission[]>([]);
  const [stats, setStats] = useState<CurationStats>({
    totalSubmissions: 0,
    verifiedSubmissions: 0,
    ivorIntegrations: 0,
    communityContributors: 0,
    sourcesIdentified: 0
  });
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'training'>('pending');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [newSubmission, setNewSubmission] = useState<Partial<ManualSubmission>>({
    submissionType: 'event',
    liberationFocus: [],
    tags: []
  });

  useEffect(() => {
    loadSubmissions();
    loadStats();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('manual_content_submissions')
        .select(`
          *,
          submitted_by_profile:submitted_by(email, display_name)
        `)
        .order('submission_date', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Get comprehensive curation statistics
      const [submissionsCount, verifiedCount, contributorsCount] = await Promise.all([
        supabase.from('manual_content_submissions').select('id', { count: 'exact', head: true }),
        supabase.from('manual_content_submissions').select('id', { count: 'exact', head: true }).eq('verification_status', 'verified'),
        supabase.from('manual_content_submissions').select('submitted_by', { count: 'exact', head: true }).distinct()
      ]);

      setStats({
        totalSubmissions: submissionsCount.count || 0,
        verifiedSubmissions: verifiedCount.count || 0,
        ivorIntegrations: Math.floor((verifiedCount.count || 0) * 0.8), // Estimate
        communityContributors: contributorsCount.count || 0,
        sourcesIdentified: Math.floor((submissionsCount.count || 0) * 0.3) // Estimate new sources identified
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSubmissionApproval = async (submissionId: string, action: 'verify' | 'reject' | 'needs-review') => {
    try {
      const { error } = await supabase
        .from('manual_content_submissions')
        .update({ 
          verification_status: action === 'verify' ? 'verified' : action,
          verified_at: action === 'verify' ? new Date().toISOString() : null
        })
        .eq('id', submissionId);

      if (error) throw error;

      // If verified, potentially integrate with IVOR training
      if (action === 'verify') {
        await integrateWithIVOR(submissionId);
      }

      loadSubmissions();
      loadStats();
    } catch (error) {
      console.error('Error updating submission:', error);
    }
  };

  const integrateWithIVOR = async (submissionId: string) => {
    try {
      // Add to IVOR training queue
      const { error } = await supabase
        .from('ivor_training_queue')
        .insert({
          source_type: 'manual_submission',
          source_id: submissionId,
          training_priority: 'high',
          added_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('✅ Added to IVOR training queue:', submissionId);
    } catch (error) {
      console.error('Error integrating with IVOR:', error);
    }
  };

  const handleManualSubmission = async () => {
    try {
      const submissionData = {
        ...newSubmission,
        submitted_by: 'current-user', // Would be actual user ID
        submission_date: new Date().toISOString(),
        source_type: 'manual-form',
        verification_status: 'pending'
      };

      const { error } = await supabase
        .from('manual_content_submissions')
        .insert(submissionData);

      if (error) throw error;

      setShowSubmissionForm(false);
      setNewSubmission({
        submissionType: 'event',
        liberationFocus: [],
        tags: []
      });
      loadSubmissions();
      loadStats();
    } catch (error) {
      console.error('Error submitting content:', error);
    }
  };

  const renderCurationStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="text-2xl font-bold text-purple-600">{stats.totalSubmissions}</div>
        <div className="text-sm text-purple-700">Total Submissions</div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="text-2xl font-bold text-green-600">{stats.verifiedSubmissions}</div>
        <div className="text-sm text-green-700">Verified Content</div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="text-2xl font-bold text-blue-600">{stats.ivorIntegrations}</div>
        <div className="text-sm text-blue-700">IVOR Integrations</div>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="text-2xl font-bold text-orange-600">{stats.communityContributors}</div>
        <div className="text-sm text-orange-700">Contributors</div>
      </div>
      <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
        <div className="text-2xl font-bold text-pink-600">{stats.sourcesIdentified}</div>
        <div className="text-sm text-pink-700">New Sources Found</div>
      </div>
    </div>
  );

  const renderChromeExtensionInvitation = () => (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6 rounded-lg mb-6">
      <div className="flex items-center gap-4">
        <div className="text-4xl">🧩</div>
        <div>
          <h3 className="text-xl font-bold mb-2">Install BLKOUT Chrome Extension</h3>
          <p className="mb-4">Help curate community content while browsing! One-click submissions feed directly into IVOR's knowledge base.</p>
          <div className="flex gap-3">
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50">
              📥 Install Extension
            </button>
            <button className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:bg-opacity-10">
              📖 Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubmissionCard = (submission: ManualSubmission) => (
    <div key={submission.id} className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-lg">{submission.title}</h4>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs ${
              submission.submissionType === 'event' ? 'bg-blue-100 text-blue-700' :
              submission.submissionType === 'news' ? 'bg-green-100 text-green-700' :
              submission.submissionType === 'organization' ? 'bg-purple-100 text-purple-700' :
              'bg-orange-100 text-orange-700'
            }`}>
              {submission.submissionType}
            </span>
            <span>via {submission.sourceType}</span>
            <span>by {submission.submittedBy}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {submission.verificationStatus === 'pending' && (
            <>
              <button
                onClick={() => handleSubmissionApproval(submission.id!, 'verify')}
                className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
              >
                ✅ Verify
              </button>
              <button
                onClick={() => handleSubmissionApproval(submission.id!, 'needs-review')}
                className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600"
              >
                ⏳ Review
              </button>
              <button
                onClick={() => handleSubmissionApproval(submission.id!, 'reject')}
                className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
              >
                ❌ Reject
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-3">{submission.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {submission.liberationFocus.map(focus => (
          <span key={focus} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
            {focus}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
        <div>
          <strong>Liberation Relevance:</strong> {(submission.liberationRelevance * 100).toFixed(0)}%
        </div>
        <div>
          <strong>IVOR Training Value:</strong> {submission.ivorTrainingValue}/10
        </div>
        {submission.location && (
          <div>
            <strong>Location:</strong> {submission.location}
          </div>
        )}
        {submission.organizationName && (
          <div>
            <strong>Organization:</strong> {submission.organizationName}
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
        <a 
          href={submission.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          🔗 View Original
        </a>
        <div className="text-xs text-gray-500">
          {new Date(submission.submissionDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );

  const filteredSubmissions = submissions.filter(submission => {
    if (activeTab === 'pending') return submission.verificationStatus === 'pending';
    if (activeTab === 'verified') return submission.verificationStatus === 'verified';
    if (activeTab === 'training') return submission.ivorTrainingValue >= 7;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🧩 Community Curation Hub</h1>
        <p className="text-gray-600">
          Members and community organisers help curate information and identify relevant sources. 
          Submissions improve IVOR's knowledge base and automated discovery.
        </p>
      </div>

      {renderChromeExtensionInvitation()}
      {renderCurationStats()}

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-purple-600'
          }`}
        >
          ⏳ Pending Review ({submissions.filter(s => s.verificationStatus === 'pending').length})
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'verified'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-purple-600'
          }`}
        >
          ✅ Verified ({submissions.filter(s => s.verificationStatus === 'verified').length})
        </button>
        <button
          onClick={() => setActiveTab('training')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'training'
              ? 'border-purple-500 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-purple-600'
          }`}
        >
          🤖 IVOR Training ({submissions.filter(s => s.ivorTrainingValue >= 7).length})
        </button>
      </div>

      {/* Manual Submission Button */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {activeTab === 'pending' ? 'Pending Community Submissions' :
             activeTab === 'verified' ? 'Verified Community Content' :
             'High-Value IVOR Training Content'}
          </h2>
        </div>
        <button
          onClick={() => setShowSubmissionForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          ➕ Manual Submission
        </button>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === 'pending' ? 'No pending submissions' :
             activeTab === 'verified' ? 'No verified content yet' :
             'No high-value training content yet'}
          </div>
        ) : (
          filteredSubmissions.map(renderSubmissionCard)
        )}
      </div>

      {/* Manual Submission Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Manual Content Submission</h3>
              <button
                onClick={() => setShowSubmissionForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleManualSubmission(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newSubmission.title || ''}
                    onChange={(e) => setNewSubmission({...newSubmission, title: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">URL</label>
                  <input
                    type="url"
                    value={newSubmission.url || ''}
                    onChange={(e) => setNewSubmission({...newSubmission, url: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={newSubmission.submissionType || 'event'}
                    onChange={(e) => setNewSubmission({...newSubmission, submissionType: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="event">Event</option>
                    <option value="news">News Article</option>
                    <option value="organization">Organization</option>
                    <option value="resource">Resource</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newSubmission.description || ''}
                    onChange={(e) => setNewSubmission({...newSubmission, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Submit for Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmissionForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChromeExtensionCurationHub;