// Content Submission Form for Community Liberation Platform
// Federated Independence Architecture - Works with or without external services
// File: src/components/ContentSubmissionForm.tsx

import React, { useState } from 'react';
import { publicationService } from '../services/publicationService';

interface ContentSubmissionFormProps {
  onSubmit?: (content: any) => void;
  className?: string;
}

interface ContentFormData {
  title: string;
  content: string;
  type: 'article' | 'event' | 'governance' | 'general';
  priority: 'low' | 'medium' | 'high';
}

const ContentSubmissionForm: React.FC<ContentSubmissionFormProps> = ({ 
  onSubmit, 
  className = '' 
}) => {
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    content: '',
    type: 'general',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Create submission object
      const submission = {
        ...formData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        status: 'pending',
        author: 'Community Submitted',
        source: 'web_form'
      };

      // Store locally for independence (fallback)
      const existingSubmissions = JSON.parse(
        localStorage.getItem('contentSubmissions') || '[]'
      );
      existingSubmissions.push(submission);
      localStorage.setItem('contentSubmissions', JSON.stringify(existingSubmissions));

      let databaseSuccess = false;
      let errorMessage = '';

      // Try to submit to database using publicationService
      try {
        const contentType = (formData.type === 'event') ? 'events' : 'newsroom_articles';
        
        const submissionData = {
          title: formData.title,
          content: formData.content,
          priority: formData.priority,
          source: 'web_form',
          author: 'Community Submitted',
          ...(formData.type === 'event' ? {
            event_date: new Date().toISOString().split('T')[0],
            location: 'TBA'
          } : {})
        };

        const result = await publicationService.submitContent(submissionData, contentType);
        
        if (result && result.id) {
          databaseSuccess = true;
          console.log(`Content submitted to ${contentType}:`, result.id);
        } else {
          errorMessage = 'Submission failed - no result returned';
        }
      } catch (dbError) {
        console.error('Database submission failed:', dbError);
        errorMessage = dbError instanceof Error ? dbError.message : 'Network error';
      }

      // Optional callback for enhanced functionality
      if (onSubmit) {
        await onSubmit(submission);
      }

      // Set success/fallback message
      if (databaseSuccess) {
        setMessage('✅ Content submitted successfully to moderation queue!');
      } else {
        setMessage(`⚠️ Content saved locally (${errorMessage}) - will sync when services available`);
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'general',
        priority: 'medium'
      });

    } catch (error) {
      setMessage('⚠️ Submission saved locally - will sync when services available');
      console.error('Content submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`content-submission-form ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Submit Content</h2>
      
      {message && (
        <div className={`p-4 rounded-lg mb-4 ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ContentFormData['type'] }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="general">General</option>
            <option value="article">Article</option>
            <option value="event">Event</option>
            <option value="governance">Governance</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as ContentFormData['priority'] }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } transition-colors`}
        >
          {loading ? 'Submitting...' : 'Submit Content'}
        </button>
      </form>
    </div>
  );
};

export default ContentSubmissionForm;