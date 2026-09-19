import { create } from 'zustand';

export const useProgressStore = create((set, get) => ({
  xp: parseInt(localStorage.getItem('user_xp') || '0', 10),
  totalXp: parseInt(localStorage.getItem('user_xp') || '0', 10),
  completedLessons: JSON.parse(localStorage.getItem('completed_lessons') || '[]'),
  watchedVideos: JSON.parse(localStorage.getItem('completed_lessons') || '[]'),
  completedChallenges: JSON.parse(localStorage.getItem('completed_challenges') || '[]'),
  studentAttachments: JSON.parse(localStorage.getItem('student_attachments') || '[]'),
  activeLessonId: null,
  isLessonModalOpen: false,

  addXP: (amount) => {
    set((state) => {
      const newXP = state.xp + amount;
      localStorage.setItem('user_xp', newXP.toString());
      return { xp: newXP, totalXp: newXP };
    });
  },
  
  toggleWatched: (lessonId) => {
    set((state) => {
      const isCompleted = state.watchedVideos.includes(lessonId);
      let updated;
      let newXp = state.xp;
      if (isCompleted) {
        updated = state.watchedVideos.filter(id => id !== lessonId);
        newXp = Math.max(0, state.xp - 50);
      } else {
        updated = [...state.watchedVideos, lessonId];
        newXp = state.xp + 50;
      }
      localStorage.setItem('completed_lessons', JSON.stringify(updated));
      localStorage.setItem('user_xp', newXp.toString());
      return { completedLessons: updated, watchedVideos: updated, xp: newXp, totalXp: newXp };
    });
  },

  completeLesson: (lessonId) => {
    set((state) => {
      if (!state.completedLessons.includes(lessonId)) {
        const updated = [...state.completedLessons, lessonId];
        localStorage.setItem('completed_lessons', JSON.stringify(updated));
        const newXP = state.xp + 50;
        localStorage.setItem('user_xp', newXP.toString());
        return { completedLessons: updated, watchedVideos: updated, xp: newXP, totalXp: newXP };
      }
      return state;
    });
  },

  markChallengeComplete: (id, xpReward) => {
    set((state) => {
      if (!state.completedChallenges.includes(id)) {
        const updated = [...state.completedChallenges, id];
        localStorage.setItem('completed_challenges', JSON.stringify(updated));
        const newXp = state.xp + xpReward;
        localStorage.setItem('user_xp', newXp.toString());
        return { completedChallenges: updated, xp: newXp, totalXp: newXp };
      }
      return state;
    });
  },

  addStudentAttachment: (att) => {
    set((state) => {
      const newAtt = { id: Date.now().toString(), ...att };
      const updated = [...state.studentAttachments, newAtt];
      localStorage.setItem('student_attachments', JSON.stringify(updated));
      return { studentAttachments: updated };
    });
  },

  openLessonModal: (id) => set({ activeLessonId: id, isLessonModalOpen: true }),
  closeLessonModal: () => set({ activeLessonId: null, isLessonModalOpen: false }),
  getStudentNote: (id) => localStorage.getItem(`note_${id}`) || '',
  saveStudentNote: (id, note) => localStorage.setItem(`note_${id}`, note),

  isLessonCompleted: (lessonId) => {
    return get().completedLessons.includes(lessonId);
  }
}));

export function useProgress() {
  const state = useProgressStore();
  const totalVideos = 102;
  const watchedCount = state.watchedVideos.length;
  const progressPercent = Math.round((watchedCount / totalVideos) * 100) || 0;
  
  let rankInfo = { rank: 'SQL Beginner', icon: '👶', color: '#0ea5e9' };
  if (state.xp >= 5000) rankInfo = { rank: 'Data Architect', icon: '🏛️', color: '#CC292B' };
  else if (state.xp >= 3000) rankInfo = { rank: 'Senior DBRE', icon: '🛡️', color: '#f59e0b' };
  else if (state.xp >= 1500) rankInfo = { rank: 'Data Engineer', icon: '⚙️', color: '#8b5cf6' };
  else if (state.xp >= 500) rankInfo = { rank: 'SQL Developer', icon: '💻', color: '#10b981' };

  return {
    ...state,
    totalVideos,
    watchedCount,
    progressPercent,
    rankInfo
  };
}
