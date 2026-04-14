import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const icons: Record<string, React.ReactNode> = {
  add: <path d="M12 5v14M5 12h14" />,
  add_circle_outline: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  auto_awesome: (
    <>
      <path d="M12 4l1.4 3.6L17 9l-3.6 1.4L12 14l-1.4-3.6L7 9l3.6-1.4L12 4Z" />
      <path d="M5 5l.6 1.4L7 7l-1.4.6L5 9l-.6-1.4L3 7l1.4-.6L5 5Z" />
      <path d="M19 14l.6 1.4L21 16l-1.4.6L19 18l-.6-1.4L17 16l1.4-.6L19 14Z" />
    </>
  ),
  badge: (
    <>
      <path d="M7.5 6.5A4.5 4.5 0 0 1 12 2a4.5 4.5 0 0 1 4.5 4.5v3.5H7.5V6.5Z" />
      <path d="M6 10h12v8H6z" />
      <path d="m9.5 18 2.5 4 2.5-4" />
    </>
  ),
  cancel: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </>
  ),
  check: <path d="m5 12 4 4 10-10" />,
  check_circle: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  chevron_left: <path d="m14 6-6 6 6 6" />,
  chevron_right: <path d="m10 6 6 6-6 6" />,
  cloud_upload: (
    <>
      <path d="M8 17H6.5a4.5 4.5 0 1 1 .9-8.9A5.5 5.5 0 0 1 18 10.5 3.5 3.5 0 0 1 17.5 17H16" />
      <path d="m12 16V8m0 0-3 3m3-3 3 3" />
    </>
  ),
  content_copy: (
    <>
      <rect x="9" y="9" width="9" height="9" rx="1.5" />
      <path d="M6 15H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1" />
    </>
  ),
  dashboard: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="5" rx="1" />
      <rect x="13" y="11" width="7" height="9" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
    </>
  ),
  dark_mode: <path d="M18 14.5A7.5 7.5 0 0 1 9.5 6 7.5 7.5 0 1 0 18 14.5Z" />,
  data_usage: (
    <>
      <path d="M12 4a8 8 0 1 0 8 8" />
      <path d="M12 4a8 8 0 0 1 8 8" opacity="0.35" />
      <path d="M12 12 16 8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  delete: (
    <>
      <path d="M5 7h14" />
      <path d="M9 7V5h6v2" />
      <path d="M8 7v11h8V7" />
      <path d="M10 10v5M14 10v5" />
    </>
  ),
  description: (
    <>
      <path d="M8 3h6l4 4v14H6V3h2Z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  email: (
    <>
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="m5 8 7 5 7-5" />
    </>
  ),
  error: (
    <>
      <path d="M12 4 20 19H4L12 4Z" />
      <path d="M12 9v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  fingerprint: (
    <>
      <path d="M12 4a5 5 0 0 1 5 5v3" />
      <path d="M9 20a9 9 0 0 0 3-7V9" />
      <path d="M6 17a6 6 0 0 0 2-4V9a4 4 0 0 1 8 0v5" />
      <path d="M15 20a10 10 0 0 0 3-7v-1" />
    </>
  ),
  folder_open: (
    <>
      <path d="M3 19h14a2 2 0 0 0 1.9-1.4L21 10H9L7 7H3v12Z" />
      <path d="M3 7V5h4l2 2h8a2 2 0 0 1 2 2v1" />
    </>
  ),
  group: (
    <>
      <circle cx="9" cy="9" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M13.5 19a4.5 4.5 0 0 1 7 0" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 5h16v11H16l-2 3h-4l-2-3H4V5Z" />
      <path d="M4 13h4l2 2h4l2-2h4" />
    </>
  ),
  light_mode: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </>
  ),
  logout: (
    <>
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M13 8l4 4-4 4" />
      <path d="M8 12h9" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9" r="3" />
      <circle cx="16.5" cy="10" r="2.5" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M13.5 18.5a4.5 4.5 0 0 1 6 0" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </>
  ),
  schedule: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4.2-4.2" />
    </>
  ),
  send: <path d="M3 20 21 12 3 4l2.5 6L14 12l-8.5 2L3 20Z" />,
  smart_toy: (
    <>
      <rect x="6" y="7" width="12" height="10" rx="3" />
      <path d="M12 4v3M9 17v2M15 17v2M6 11H4M20 11h-2" />
      <circle cx="10" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="11" r="1" fill="currentColor" stroke="none" />
      <path d="M9.5 14h5" />
    </>
  ),
  title: (
    <>
      <path d="M6 6h12" />
      <path d="M12 6v12" />
    </>
  ),
  work: (
    <>
      <rect x="4" y="7" width="16" height="11" rx="2" />
      <path d="M9 7V5h6v2" />
      <path d="M4 12h16" />
    </>
  ),
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {icons[name] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
};

export default Icon;
