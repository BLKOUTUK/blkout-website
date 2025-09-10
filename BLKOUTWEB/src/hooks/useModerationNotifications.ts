import { useState, useEffect, useCallback } from 'react';
import { publicationService } from '../services/publicationService';

interface NotificationData {
  pendingCount: number;
  lastChecked: string;
  hasNewContent: boolean;
}

interface ModerationNotificationHook {
  pendingCount: number;
  hasNewContent: boolean;
  isLoading: boolean;
  error: string | null;
  refreshCount: () => Promise<void>;
  markAsViewed: () => void;
}

export const useModerationNotifications = (
  pollInterval: number = 30000, // 30 seconds
  enabled: boolean = true
): ModerationNotificationHook => {
  const [data, setData] = useState<NotificationData>({
    pendingCount: 0,
    lastChecked: new Date().toISOString(),
    hasNewContent: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastViewedCount, setLastViewedCount] = useState(0);

  // Fetch pending count
  const fetchPendingCount = useCallback(async () => {
    if (!enabled) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const count = await publicationService.getPendingCount();
      const now = new Date().toISOString();
      
      setData(prev => ({
        pendingCount: count,
        lastChecked: now,
        hasNewContent: count > lastViewedCount
      }));
      
    } catch (err) {
      console.error('Failed to fetch pending count:', err);
      setError('Failed to fetch notification count');
    } finally {
      setIsLoading(false);
    }
  }, [enabled, lastViewedCount]);

  // Manual refresh function
  const refreshCount = useCallback(async () => {
    await fetchPendingCount();
  }, [fetchPendingCount]);

  // Mark notifications as viewed
  const markAsViewed = useCallback(() => {
    setLastViewedCount(data.pendingCount);
    setData(prev => ({
      ...prev,
      hasNewContent: false
    }));
  }, [data.pendingCount]);

  // Set up polling
  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetchPendingCount();

    // Set up interval polling
    const interval = setInterval(fetchPendingCount, pollInterval);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, pollInterval, fetchPendingCount]);

  // Browser notification support
  useEffect(() => {
    if (data.hasNewContent && data.pendingCount > 0) {
      // Check if browser supports notifications
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Content Moderation', {
          body: `${data.pendingCount} items awaiting moderation`,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    }
  }, [data.hasNewContent, data.pendingCount]);

  return {
    pendingCount: data.pendingCount,
    hasNewContent: data.hasNewContent,
    isLoading,
    error,
    refreshCount,
    markAsViewed
  };
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};