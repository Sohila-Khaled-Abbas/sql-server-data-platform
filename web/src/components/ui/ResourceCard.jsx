/**
 * ResourceCard — Reusable card for displaying learning resources.
 * 
 * Used by: DocsView (Learning Hub), LearningRoadmap
 * 
 * @param {string}  title       - Resource title
 * @param {string}  description - Brief description of the resource
 * @param {string}  url         - Link URL
 * @param {string}  type        - Resource type badge (e.g. 'MS Docs', 'Book', 'Video', 'Tool')
 * @param {string}  [category]  - Category label
 * @param {boolean} [isExternal] - Whether the link opens in a new tab
 * @param {React.ReactNode} [icon] - Lucide icon element
 * @param {string}  [className] - Additional CSS class
 */
import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';

/** Maps resource type to a badge color class */
const TYPE_BADGE_MAP = {
  'MS Docs':  'badge-blue',
  'Article':  'badge-cyan',
  'Book':     'badge-purple',
  'Video':    'badge-mssql-red',
  'Course':   'badge-green',
  'Tool':     'badge-amber',
  'Platform': 'badge-cyan',
  'Cert':     'badge-green',
  'Guide':    'badge-purple',
  'PDF':      'badge-amber',
  'Community':'badge-dark',
};

export default function ResourceCard({
  title,
  description,
  url,
  type = 'Article',
  category,
  isExternal = true,
  icon,
  className = '',
}) {
  const badgeClass = TYPE_BADGE_MAP[type] || 'badge-dark';
  const isDeadLink = !url || url === '#';

  return (
    <div className={`resource-card ${className}`}>
      <div className="resource-card-icon">
        {icon || <FileText size={18} />}
      </div>
      <div className="resource-card-body">
        {category && (
          <span className="resource-card-category">{category}</span>
        )}
        {isDeadLink ? (
          <span className="resource-card-title disabled">{title}</span>
        ) : (
          <a
            href={url}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="resource-card-title"
          >
            {title}
            {isExternal && <ExternalLink size={12} className="resource-card-ext-icon" />}
          </a>
        )}
        <p className="resource-card-desc">{description}</p>
      </div>
      <span className={`resource-card-badge badge ${badgeClass}`}>{type}</span>
    </div>
  );
}
