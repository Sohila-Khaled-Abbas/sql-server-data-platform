import React, { useState, useMemo } from 'react';
import { COURSE_VIDEOS, COURSE_METADATA } from '../data/videoCatalog.js';
import { useProgress } from '../store/useProgressStore.js';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Flame,
  Check
} from 'lucide-react';

export default function ChapterSyllabus({ 
  isOpen, 
  onClose, 
  activeLessonId, 
  onSelectLesson 
}) {
  const { watchedVideos, toggleWatched, watchedCount, totalVideos, progressPercent } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState('all'); // 'all' | 'uncompleted' | 'completed'

  // Group videos by chapter
  const chapters = useMemo(() => {
    const map = new Map();
    COURSE_VIDEOS.forEach(v => {
      const ch = v.chapter;
      if (!map.has(ch)) {
        map.set(ch, {
          chapterNum: ch,
          chapterTitle: v.chapterTitle || `Chapter ${ch}`,
          lessons: []
        });
      }
      map.get(ch).lessons.push(v);
    });
    return Array.from(map.values());
  }, []);

  // Set which chapters are expanded by default (current lesson chapter expanded)
  const currentChapter = useMemo(() => {
    const l = COURSE_VIDEOS.find(v => v.id === activeLessonId);
    return l ? l.chapter : 1;
  }, [activeLessonId]);

  const [expandedChapters, setExpandedChapters] = useState(() => ({ [currentChapter]: true }));

  const toggleChapter = (chNum) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chNum]: !prev[chNum]
    }));
  };

  // Filter lessons based on search & completion state
  const matchesLesson = (lesson) => {
    const isDone = watchedVideos.includes(lesson.id);
    if (filterState === 'completed' && !isDone) return false;
    if (filterState === 'uncompleted' && isDone) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      lesson.title.toLowerCase().includes(q) ||
      lesson.videoCode.toLowerCase().includes(q) ||
      lesson.description.toLowerCase().includes(q) ||
      lesson.skillsConnected.some(s => s.toLowerCase().includes(q))
    );
  };

  const handleSelect = (lessonId) => {
    onSelectLesson(lessonId);
    onClose();
  };

  // Find first uncompleted lesson for "Continue Learning"
  const handleContinueLearning = () => {
    const nextUnwatched = COURSE_VIDEOS.find(v => !watchedVideos.includes(v.id));
    if (nextUnwatched) {
      handleSelect(nextUnwatched.id);
    } else {
      handleSelect(COURSE_VIDEOS[0].id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="syllabus-overlay" onClick={onClose}>
      <div 
        className="syllabus-drawer" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Course Curriculum Syllabus"
      >
        {/* Drawer Header */}
        <div className="syllabus-header">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-cyan-400" />
              <h2 className="syllabus-title">Curriculum Syllabus</h2>
            </div>
            <p className="syllabus-subtitle">
              MaharaTech Course 2305 • 102 Engineering Modules
            </p>
          </div>

          <button onClick={onClose} className="drawer-close-icon-btn" title="Close Syllabus (Esc)">
            <X size={18} />
          </button>
        </div>

        {/* Global Progress Bar in Syllabus */}
        <div className="syllabus-progress-strip">
          <div className="flex justify-between items-center text-xs text-gray-300 mb-1.5">
            <span>Course Mastery Progress</span>
            <span className="font-bold text-cyan-400">{watchedCount} / {totalVideos} ({progressPercent}%)</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <button 
            onClick={handleContinueLearning}
            className="continue-btn mt-2.5 w-full flex items-center justify-center gap-2"
          >
            <Play size={14} className="fill-current" />
            <span>Continue Next Lesson</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="syllabus-search-bar">
          <div className="search-input-wrap">
            <Search size={14} className="text-gray-400" />
            <input 
              type="text"
              placeholder="Filter syllabus by title, code (e.g. CH01_VID03), topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>

          <div className="syllabus-filter-chips">
            <button 
              className={`filter-chip ${filterState === 'all' ? 'active' : ''}`}
              onClick={() => setFilterState('all')}
            >
              All ({COURSE_VIDEOS.length})
            </button>
            <button 
              className={`filter-chip ${filterState === 'uncompleted' ? 'active' : ''}`}
              onClick={() => setFilterState('uncompleted')}
            >
              Remaining ({totalVideos - watchedCount})
            </button>
            <button 
              className={`filter-chip ${filterState === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterState('completed')}
            >
              Completed ({watchedCount})
            </button>
          </div>
        </div>

        {/* Chapters Accordion List */}
        <div className="syllabus-scroll-list">
          {chapters.map((ch) => {
            const filteredLessons = ch.lessons.filter(matchesLesson);
            const chWatchedCount = ch.lessons.filter(v => watchedVideos.includes(v.id)).length;
            const isExpanded = Boolean(expandedChapters[ch.chapterNum]) || Boolean(searchQuery.trim());

            if (filteredLessons.length === 0 && searchQuery.trim()) {
              return null;
            }

            return (
              <div key={ch.chapterNum} className="chapter-accordion-item">
                {/* Chapter Header Toggle */}
                <button 
                  className="chapter-header-btn"
                  onClick={() => toggleChapter(ch.chapterNum)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                    <span className="chapter-title-text">{ch.chapterTitle}</span>
                  </div>

                  <div className="chapter-completion-badge">
                    <span>{chWatchedCount}/{ch.lessons.length}</span>
                    {chWatchedCount === ch.lessons.length && (
                      <CheckCircle2 size={13} className="text-emerald-400" />
                    )}
                  </div>
                </button>

                {/* Lesson List */}
                {isExpanded && (
                  <div className="chapter-lessons-container">
                    {filteredLessons.map((lesson) => {
                      const isWatched = watchedVideos.includes(lesson.id);
                      const isActive = lesson.id === activeLessonId;

                      return (
                        <div 
                          key={lesson.id}
                          className={`syllabus-lesson-row ${isActive ? 'active' : ''} ${isWatched ? 'watched' : ''}`}
                          onClick={() => handleSelect(lesson.id)}
                        >
                          <button
                            type="button"
                            className="status-toggle-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatched(lesson.id);
                            }}
                            title={isWatched ? "Mark incomplete" : "Mark completed"}
                          >
                            {isWatched ? (
                              <CheckCircle2 size={16} className="text-emerald-400" />
                            ) : (
                              <Circle size={16} className="text-gray-500 hover:text-cyan-400" />
                            )}
                          </button>

                          <div className="lesson-info-col">
                            <div className="flex items-center gap-2">
                              <span className="lesson-code-pill">{lesson.videoCode}</span>
                              <span className="lesson-row-title">{lesson.title}</span>
                            </div>
                            <div className="lesson-row-sub">
                              <span className="duration-meta">
                                <Clock size={11} />
                                {lesson.duration}
                              </span>
                              <span className="meta-bullet">•</span>
                              <span>{lesson.level}</span>
                            </div>
                          </div>

                          {isActive && (
                            <span className="active-lesson-indicator">Current</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
