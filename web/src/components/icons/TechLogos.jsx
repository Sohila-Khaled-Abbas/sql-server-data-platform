import React from 'react';

export function SqlServerLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="5" rx="9" ry="3" fill="#e11d48" fillOpacity="0.2" stroke="#e11d48" strokeWidth="1.75" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" stroke="#e11d48" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" stroke="#e11d48" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function PythonLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.88 2c-4.32 0-4.04 1.87-4.04 1.87l.01 1.94h4.12v.58H5.85S2 5.92 2 10.25c0 4.33 3.36 4.18 3.36 4.18h2v-2.83c0-2.38 2.05-2.28 2.05-2.28h3.97v-3.7S13.78 2 11.88 2zm-1.8 1.25a.8.8 0 110 1.6.8.8 0 010-1.6z" fill="#38bdf8" />
      <path d="M12.12 22c4.32 0 4.04-1.87 4.04-1.87l-.01-1.94h-4.12v-.58h6.12s3.85.47 3.85-3.86c0-4.33-3.36-4.18-3.36-4.18h-2v2.83c0 2.38-2.05 2.28-2.05 2.28H10.6v3.7s-.4 3.62 1.52 3.62zm1.8-1.25a.8.8 0 110-1.6.8.8 0 010 1.6z" fill="#f59e0b" />
    </svg>
  );
}

export function CSharpLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#512BD4" fillOpacity="0.15" stroke="#8B5CF6" strokeWidth="1.5" />
      <text x="5" y="16" fill="#a78bfa" fontSize="11" fontFamily="sans-serif" fontWeight="800">C#</text>
    </svg>
  );
}

export function PowerShellLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#012456" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
      <path d="M6 8l5 4-5 4M13 16h5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DockerLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 12.5C3.2 12.1 4.5 12 5.5 12.5c1 .5 2 .5 3 0s2-.5 3 0c1 .5 2 .5 3 0s2-.5 3 0c1.5.7 3.5.2 4.5-.5.2 1-.1 2.2-.8 3-1.2 1.4-3.5 2.5-6.2 2.5-4.5 0-8.5-2.2-9.5-5z" fill="#2496ED" />
      <rect x="5" y="8.5" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="8" y="8.5" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="11" y="8.5" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="8" y="5.5" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="11" y="5.5" width="2" height="2" rx="0.3" fill="#2496ED" />
      <rect x="14" y="8.5" width="2" height="2" rx="0.3" fill="#2496ED" />
    </svg>
  );
}

export function GitHubActionsLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#2088FF" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="#3b82f6" strokeWidth="1.75" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="#3b82f6" strokeWidth="1.75" />
    </svg>
  );
}

export function PytestLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#0A9EDC" fillOpacity="0.15" stroke="#0ea5e9" strokeWidth="1.5" />
      <path d="M9 3v4L5 17a2 2 0 002 2h10a2 2 0 002-2L15 7V3" stroke="#0ea5e9" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12h8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TsqltLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#10B981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1.5" />
      <path d="M12 4L5 7v5c0 5 7 8 7 8s7-3 7-8V7l-7-3z" stroke="#10b981" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KimballLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#F59E0B" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
      <path d="M12 4l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L12 4z" fill="#f59e0b" fillOpacity="0.5" stroke="#f59e0b" strokeWidth="1.25" />
    </svg>
  );
}

export function SsrsLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#E11D48" fillOpacity="0.15" stroke="#e11d48" strokeWidth="1.5" />
      <path d="M6 17v-4M10 17v-7M14 17v-10M18 17v-2" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SmoLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#8B5CF6" fillOpacity="0.15" stroke="#8b5cf6" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="#a78bfa" strokeWidth="1.5" />
      <path d="M12 4v2M12 18v2M4 12h2M18 12h2" stroke="#a78bfa" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function TsqlLogo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="6" fill="#38BDF8" fillOpacity="0.15" stroke="#38bdf8" strokeWidth="1.5" />
      <path d="M7 9l3 3-3 3M13 15h4" stroke="#38bdf8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
