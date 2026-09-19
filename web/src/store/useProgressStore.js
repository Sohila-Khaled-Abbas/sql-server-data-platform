import { create } from 'zustand';

export const useProgressStore = create((set, get) => ({
  xp: parseInt(localStorage.getItem('user_xp') || '0', 10),
  completedLessons: JSON.parse(localStorage.getItem('completed_lessons') || '[]'),
  
  addXP: (amount) => {
    set((state) => {
      const newXP = state.xp + amount;
      localStorage.setItem('user_xp', newXP.toString());
      return { xp: newXP };
    });
  },
  
  completeLesson: (lessonId) => {
    set((state) => {
      if (!state.completedLessons.includes(lessonId)) {
        const updated = [...state.completedLessons, lessonId];
        localStorage.setItem('completed_lessons', JSON.stringify(updated));
        // Also add XP
        const newXP = state.xp + 50;
        localStorage.setItem('user_xp', newXP.toString());
        return { completedLessons: updated, xp: newXP };
      }
      return state;
    });
  },

  isLessonCompleted: (lessonId) => {
    return get().completedLessons.includes(lessonId);
  }
}));
