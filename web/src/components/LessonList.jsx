import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext.jsx';
import { COURSE_VIDEOS } from '../data/videoCatalog.js';
import { CheckCircle2, Circle, Search } from 'lucide-react';

export default function LessonList({ activeLessonId, onSelectLesson }) {
  const { watchedVideos } = useProgress();
  const [searchQuery, setSearchQuery] = useState('');

  // Group by chapter
  const chapters = {};
  COURSE_VIDEOS.forEach(v => {
    const key = v.chapter;
    if (!chapters[key]) {
      chapters[key] = {
        title: v.chapterTitle,
        lessons: []
      };
    }
    chapters[key].lessons.push(v);
  });

  // Filter
  const q = searchQuery.toLowerCase().trim();
  const filteredChapters = Object.entries(chapters).map(([chNum, ch]) => ({
    chNum,
    title: ch.title,
    lessons: ch.lessons.filter(l =>
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.videoCode.toLowerCase().includes(q) ||
      l.skillsConnected?.some(s => s.toLowerCase().includes(q))
    )
  })).filter(ch => ch.lessons.length > 0);

  return (
    <div className="main-content">
      {/* Search */}
      <div style={{
        position: 'relative',
        marginBottom: 32
      }}>
        <Search
          size={15}
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-dim)'
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lessons..."
          style={{
            width: '100%',
            padding: '10px 12px 10px 36px',
            fontSize: 14,
            fontFamily: 'var(--font-sans)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
          }}
        />
      </div>

      {/* Chapter Groups */}
      <div className="chapter-list">
        {filteredChapters.map(ch => (
          <div key={ch.chNum} className="chapter-group">
            <div className="chapter-group-title">{ch.title}</div>
            <ul className="chapter-lesson-list">
              {ch.lessons.map(lesson => {
                const done = watchedVideos.includes(lesson.id);
                const isActive = lesson.id === activeLessonId;
                return (
                  <li
                    key={lesson.id}
                    className={`chapter-lesson-item ${isActive ? 'active' : ''} ${done ? 'completed' : ''}`}
                    onClick={() => onSelectLesson(lesson.id)}
                  >
                    <span className={`chapter-lesson-icon ${done ? 'done' : ''}`}>
                      {done ? <CheckCircle2 size={11} /> : null}
                    </span>
                    <span className="chapter-lesson-title">{lesson.title}</span>
                    <span className="chapter-lesson-code">{lesson.videoCode}</span>
                    <span className="chapter-lesson-duration">{lesson.duration}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
