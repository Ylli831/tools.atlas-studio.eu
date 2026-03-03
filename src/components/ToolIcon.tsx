export default function ToolIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (icon) {
    case "qr":
      return (
        <svg {...props}>
          <rect x="2" y="2" width="8" height="8" rx="1" />
          <rect x="14" y="2" width="8" height="8" rx="1" />
          <rect x="2" y="14" width="8" height="8" rx="1" />
          <rect x="14" y="14" width="4" height="4" />
          <rect x="20" y="14" width="2" height="2" />
          <rect x="14" y="20" width="2" height="2" />
          <rect x="20" y="20" width="2" height="2" />
        </svg>
      );
    case "image":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      );
    case "compress":
      return (
        <svg {...props}>
          <path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242" />
          <path d="M12 12v9" />
          <path d="M8 17l4 4 4-4" />
        </svg>
      );
    case "scissors":
      return (
        <svg {...props}>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
          <path d="M5 5l14 14" />
          <path d="M19 5L5 19" />
          <circle cx="12" cy="12" r="3" fill="none" />
        </svg>
      );
    case "palette":
      return (
        <svg {...props}>
          <circle cx="13.5" cy="6.5" r="2.5" fill="currentColor" stroke="none" opacity="0.3" />
          <circle cx="17.5" cy="10.5" r="2.5" fill="currentColor" stroke="none" opacity="0.5" />
          <circle cx="8.5" cy="7.5" r="2.5" fill="currentColor" stroke="none" opacity="0.2" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
        </svg>
      );
    case "code":
      return (
        <svg {...props}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      );
    case "braces":
      return (
        <svg {...props}>
          <path d="M8 3H7a2 2 0 00-2 2v5a2 2 0 01-2 2 2 2 0 012 2v5c0 1.1.9 2 2 2h1" />
          <path d="M16 21h1a2 2 0 002-2v-5c0-1.1.9-2 2-2a2 2 0 01-2-2V5a2 2 0 00-2-2h-1" />
        </svg>
      );
    case "text":
      return (
        <svg {...props}>
          <path d="M17 6.1H3" />
          <path d="M21 12.1H3" />
          <path d="M15.1 18H3" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}
