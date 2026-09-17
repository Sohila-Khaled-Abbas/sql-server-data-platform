import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { COURSE_VIDEOS } from '../data/videoCatalog.js';

const ProgressContext = createContext(null);

const STORAGE_KEY_WATCHED = 'omniflow_watched_videos';
const STORAGE_KEY_ATTACHMENTS = 'omniflow_student_attachments';
const STORAGE_KEY_CHALLENGES = 'omniflow_completed_challenges';
const STORAGE_KEY_QUIZ = 'omniflow_quiz_score';

export function computeStudentRank(percent) {
  if (percent >= 90) return { rank: "Lead DBRE & High Availability Architect", icon: "👑", color: "#CC292B" };
  if (percent >= 70) return { rank: "Senior Data Platform Engineer", icon: "🌟", color: "#0078D4" };
  if (percent >= 50) return { rank: "T-SQL Software Engineer", icon: "🚀", color: "#107C41" };
  if (percent >= 25) return { rank: "Junior Database Developer", icon: "🌱", color: "#8B5CF6" };
  return { rank: "Apprentice Data Explorer", icon: "🧭", color: "#94A3B8" };
}

export function ProgressProvider({ children }) {
  const [watchedVideos, setWatchedVideos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_WATCHED) || '[]');
    } catch {
      return [];
    }
  });

  const [studentAttachments, setStudentAttachments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_ATTACHMENTS) || '[]');
    } catch {
      return [];
    }
  });

  const [completedChallenges, setCompletedChallenges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_CHALLENGES) || '[]');
    } catch {
      return [];
    }
  });

  const [activeLessonId, setActiveLessonId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WATCHED, JSON.stringify(watchedVideos));
  }, [watchedVideos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ATTACHMENTS, JSON.stringify(studentAttachments));
  }, [studentAttachments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  const toggleWatched = useCallback((videoId) => {
    setWatchedVideos(prev => {
      const idx = prev.indexOf(videoId);
      if (idx > -1) {
        return prev.filter(id => id !== videoId);
      } else {
        return [...prev, videoId];
      }
    });
  }, []);

  const addStudentAttachment = useCallback((attachment) => {
    const newAtt = {
      ...attachment,
      id: 'att-user-' + Date.now(),
      dateAdded: new Date().toISOString()
    };
    setStudentAttachments(prev => [...prev, newAtt]);
    return newAtt;
  }, []);

  const markChallengeComplete = useCallback((challengeId, xp) => {
    setCompletedChallenges(prev => {
      if (!prev.includes(challengeId)) {
        return [...prev, challengeId];
      }
      return prev;
    });
  }, []);

  const saveStudentNote = useCallback((videoId, noteText) => {
    localStorage.setItem(`omniflow_notes_${videoId}`, noteText);
  }, []);

  const getStudentNote = useCallback((videoId) => {
    return localStorage.getItem(`omniflow_notes_${videoId}`) || '';
  }, []);

  const openLessonModal = useCallback((videoId) => {
    setActiveLessonId(videoId);
  }, []);

  const closeLessonModal = useCallback(() => {
    setActiveLessonId(null);
  }, []);

  // Stats
  const totalVideos = COURSE_VIDEOS.length;
  const watchedCount = watchedVideos.length;
  const progressPercent = Math.round((watchedCount / totalVideos) * 100);
  const totalXp = (watchedCount * 50) + (completedChallenges.length * 75);
  const rankInfo = useMemo(() => computeStudentRank(progressPercent), [progressPercent]);

  const value = {
    watchedVideos,
    toggleWatched,
    studentAttachments,
    addStudentAttachment,
    completedChallenges,
    markChallengeComplete,
    saveStudentNote,
    getStudentNote,
    activeLessonId,
    openLessonModal,
    closeLessonModal,
    totalVideos,
    watchedCount,
    progressPercent,
    totalXp,
    rankInfo
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
