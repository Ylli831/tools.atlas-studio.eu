export default function ToolIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (icon) {
    case "qr":
      return (<svg {...props}><rect x="2" y="2" width="8" height="8" rx="1" /><rect x="14" y="2" width="8" height="8" rx="1" /><rect x="2" y="14" width="8" height="8" rx="1" /><rect x="14" y="14" width="4" height="4" /><rect x="20" y="14" width="2" height="2" /><rect x="14" y="20" width="2" height="2" /><rect x="20" y="20" width="2" height="2" /></svg>);
    case "image":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>);
    case "compress":
      return (<svg {...props}><path d="M4 14.899A7 7 0 1115.71 8h1.79a4.5 4.5 0 012.5 8.242" /><path d="M12 12v9" /><path d="M8 17l4 4 4-4" /></svg>);
    case "scissors":
      return (<svg {...props}><path d="M5 12h14" /><path d="M12 5v14" /><path d="M5 5l14 14" /><path d="M19 5L5 19" /><circle cx="12" cy="12" r="3" fill="none" /></svg>);
    case "palette":
      return (<svg {...props}><circle cx="13.5" cy="6.5" r="2.5" fill="currentColor" stroke="none" opacity="0.3" /><circle cx="17.5" cy="10.5" r="2.5" fill="currentColor" stroke="none" opacity="0.5" /><circle cx="8.5" cy="7.5" r="2.5" fill="currentColor" stroke="none" opacity="0.2" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>);
    case "code":
      return (<svg {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>);
    case "braces":
      return (<svg {...props}><path d="M8 3H7a2 2 0 00-2 2v5a2 2 0 01-2 2 2 2 0 012 2v5c0 1.1.9 2 2 2h1" /><path d="M16 21h1a2 2 0 002-2v-5c0-1.1.9-2 2-2a2 2 0 01-2-2V5a2 2 0 00-2-2h-1" /></svg>);
    case "text":
      return (<svg {...props}><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>);
    case "lock":
      return (<svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>);
    case "counter":
      return (<svg {...props}><path d="M4 4h16v16H4z" /><path d="M4 9h16" /><path d="M9 4v16" /></svg>);
    case "gradient":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 3l18 18" /><path d="M3 9l12 12" /><path d="M3 15l6 6" /><path d="M9 3l12 12" /><path d="M15 3l6 6" /></svg>);
    case "markdown":
      return (<svg {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 8v8l3-3 3 3V8" /><path d="M18 12l-2.5-3v6" /></svg>);
    case "link":
      return (<svg {...props}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>);
    case "clock":
      return (<svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>);
    case "file-image":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><circle cx="10" cy="13" r="2" /><path d="M20 17l-1.09-1.09a2 2 0 00-2.82 0L10 22" /></svg>);
    case "file-plus":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>);
    case "file-down":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="M9 15l3 3 3-3" /></svg>);
    case "file-crop":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="12" y2="17" /></svg>);
    case "resize":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M3 9h18" /></svg>);
    case "star":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M12 7l1.5 3 3.5.5-2.5 2.5.5 3.5L12 15l-3 1.5.5-3.5L7 10.5l3.5-.5L12 7z" /></svg>);
    case "image-down":
      return (<svg {...props}><path d="M21 12.5V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7.5" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-3.09-3.09a2 2 0 00-2.82 0L6 21" /><path d="M19 16v6" /><path d="M22 19l-3 3-3-3" /></svg>);
    case "fingerprint":
      return (<svg {...props}><path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 018 4" /><path d="M5 19.5C5.5 18 6 15 6 12c0-3.5 2.5-6 6-6 1 0 2 .2 3 .5" /><path d="M12 12c0 4-1 8-3 10" /><path d="M12 12c0 5 1.5 8 3 10" /><path d="M18 12c0 2-.5 5-2 8" /><path d="M22 12a10 10 0 01-2 6" /></svg>);
    case "case":
      return (<svg {...props}><path d="M2 16.1A5 5 0 0113 16.1" /><path d="M7 7v9" /><path d="M2 7h10" /><path d="M15 16V7l4 9 4-9v9" /></svg>);
    case "diff":
      return (<svg {...props}><rect x="2" y="4" width="8" height="16" rx="1" /><rect x="14" y="4" width="8" height="16" rx="1" /><path d="M5 8h2" /><path d="M5 12h2" /><path d="M17 8h2" /><path d="M17 12h2" /></svg>);
    case "scan":
      return (<svg {...props}><path d="M3 7V5a2 2 0 012-2h2" /><path d="M17 3h2a2 2 0 012 2v2" /><path d="M21 17v2a2 2 0 01-2 2h-2" /><path d="M7 21H5a2 2 0 01-2-2v-2" /><path d="M7 8h10" /><path d="M7 12h10" /><path d="M7 16h7" /></svg>);
    case "regex":
      return (<svg {...props}><path d="M17 3v10" /><path d="M12.67 5.5l8.66 5" /><path d="M12.67 10.5l8.66-5" /><path d="M9 17a2 2 0 00-2-2H5a2 2 0 00-2 2v0a2 2 0 002 2h2a2 2 0 002-2z" /></svg>);
    case "hash":
      return (<svg {...props}><line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" /><line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" /></svg>);
    case "receipt":
      return (<svg {...props}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" /><path d="M8 7h8" /><path d="M8 11h8" /><path d="M8 15h4" /></svg>);
    case "share":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 12h10" /><path d="M7 7h10" /><path d="M7 17h6" /></svg>);
    case "key":
      return (<svg {...props}><circle cx="7.5" cy="15.5" r="5.5" /><path d="M21 2l-9.6 9.6" /><path d="M15.5 7.5l3 3L21 8l-3-3" /></svg>);
    case "table":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>);
    case "binary":
      return (<svg {...props}><path d="M6 4v5" /><path d="M10 4v5" /><rect x="5" y="9" width="6" height="5" rx="1" /><path d="M6 14v5" /><path d="M10 14v5" /><rect x="5" y="4" width="6" height="5" rx="1" /><path d="M17 4v16" /><path d="M20 8h-3" /><path d="M20 16h-3" /><path d="M20 20h-3" /></svg>);
    case "contrast":
      return (<svg {...props}><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 010 20V2z" fill="currentColor" stroke="none" /></svg>);
    case "ruler":
      return (<svg {...props}><path d="M21.3 8.7l-8.6 8.6c-.4.4-1 .4-1.4 0l-7.6-7.6c-.4-.4-.4-1 0-1.4l8.6-8.6c.4-.4 1-.4 1.4 0l7.6 7.6c.4.4.4 1 0 1.4z" /><path d="M7.5 7.5l3 3" /><path d="M10.5 4.5l3 3" /><path d="M4.5 10.5l3 3" /><path d="M13.5 13.5l3 3" /></svg>);
    case "calendar":
      return (<svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>);
    case "percent":
      return (<svg {...props}><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>);
    case "bank":
      return (<svg {...props}><path d="M3 22h18" /><path d="M4 11v9" /><path d="M8 11v9" /><path d="M12 11v9" /><path d="M16 11v9" /><path d="M20 11v9" /><path d="M2 11l10-7 10 7" /></svg>);
    case "sort":
      return (<svg {...props}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="9" y2="18" /><polyline points="17 14 21 18 17 22" /></svg>);
    case "slug":
      return (<svg {...props}><path d="M13 17l5-5-5-5" /><path d="M6 17l5-5-5-5" /></svg>);
    case "signal":
      return (<svg {...props}><line x1="2" y1="12" x2="5" y2="12" /><line x1="7" y1="12" x2="8" y2="12" /><line x1="10" y1="12" x2="14" y2="12" /><line x1="16" y1="12" x2="17" y2="12" /><line x1="19" y1="12" x2="22" y2="12" /></svg>);
    case "find":
      return (<svg {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /><line x1="11" y1="8" x2="11" y2="14" /></svg>);
    case "limit":
      return (<svg {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>);
    case "barcode":
      return (<svg {...props}><path d="M3 5v14" /><path d="M6 5v10" /><path d="M9 5v14" /><path d="M12 5v10" /><path d="M15 5v14" /><path d="M18 5v10" /><path d="M21 5v14" /></svg>);
    case "info-circle":
      return (<svg {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>);
    case "coins":
      return (<svg {...props}><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1110.34 18" /><line x1="7" y1="6" x2="7.01" y2="6" /><line x1="16" y1="12" x2="16.01" y2="12" /></svg>);
    case "percent-circle":
      return (<svg {...props}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><circle cx="9.5" cy="9.5" r="1" /><circle cx="14.5" cy="14.5" r="1" /></svg>);
    case "heart-pulse":
      return (<svg {...props}><path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1112 6.006a5 5 0 017.5 6.566z" /><path d="M4 12h3l2-4 3 8 2-4h3" /></svg>);
    case "wallet":
      return (<svg {...props}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20" /><circle cx="17" cy="14" r="1" /></svg>);
    case "layers":
      return (<svg {...props}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>);
    case "shield":
      return (<svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>);
    case "file-rotate":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18a3 3 0 100-6" /><path d="M9 15l3 3-3 3" /></svg>);
    case "file-code":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M10 13l-2 2 2 2" /><path d="M14 13l2 2-2 2" /></svg>);
    case "eye-off":
      return (<svg {...props}><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>);
    case "frame":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>);
    case "smile":
      return (<svg {...props}><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>);
    case "volume":
      return (<svg {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 010 7.07" /><path d="M19.07 4.93a10 10 0 010 14.14" /></svg>);
    case "code-xml":
      return (<svg {...props}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>);
    case "file-xml":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M8 13l2 2-2 2" /><path d="M16 13l-2 2 2 2" /></svg>);
    case "terminal":
      return (<svg {...props}><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>);
    case "calendar-range":
      return (<svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /></svg>);
    case "file-compress":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M10 12h4" /><path d="M10 16h4" /><path d="M12 12v4" /></svg>);
    case "file-lock":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><rect x="8" y="14" width="8" height="6" rx="1" /><path d="M10 14v-2a2 2 0 014 0v2" /></svg>);
    case "crop":
      return (<svg {...props}><path d="M6 2v14a2 2 0 002 2h14" /><path d="M18 22V8a2 2 0 00-2-2H2" /></svg>);
    case "droplet":
      return (<svg {...props}><path d="M12 22a7 7 0 007-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 007 7z" /></svg>);
    case "sliders":
      return (<svg {...props}><line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" /></svg>);
    case "flip-horizontal":
      return (<svg {...props}><path d="M8 3H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h3" /><path d="M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3" /><line x1="12" y1="20" x2="12" y2="4" /><path d="M12 4l-4 4" /><path d="M12 4l4 4" /></svg>);
    case "pipette":
      return (<svg {...props}><path d="M2 22l1-1h3l9-9" /><path d="M3 21v-3l9-9" /><path d="M14.5 5.5l4-4a1.4 1.4 0 012 2l-4 4" /><path d="M12.5 7.5l4 4" /></svg>);
    case "pen-tool":
      return (<svg {...props}><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>);
    case "timer":
      return (<svg {...props}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3L2 6" /><path d="M22 6l-3-3" /><path d="M10 2h4" /><path d="M12 2v2" /></svg>);
    case "user-fake":
      return (<svg {...props}><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" y1="11" x2="22" y2="11" /><line x1="17" y1="8" x2="22" y2="8" /><line x1="17" y1="14" x2="22" y2="14" /></svg>);
    case "pen-line":
      return (<svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>);
    case "lock-keyhole":
      return (<svg {...props}><circle cx="12" cy="16" r="1" /><rect x="3" y="10" width="18" height="12" rx="2" /><path d="M7 10V7a5 5 0 0110 0v3" /></svg>);
    case "arrow-down-to-line":
      return (<svg {...props}><path d="M12 17V3" /><path d="M6 11l6 6 6-6" /><line x1="19" y1="21" x2="5" y2="21" /></svg>);
    case "file-json":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M10 13a1 1 0 00-1-1H8a1 1 0 00-1 1v2a1 1 0 001 1h1a1 1 0 011 1v2a1 1 0 01-1 1H7" /><path d="M17 13a1 1 0 00-1-1h-1a1 1 0 00-1 1v2a1 1 0 001 1h1a1 1 0 011 1v2a1 1 0 01-1 1h-1" /></svg>);
    case "book-open":
      return (<svg {...props}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></svg>);
    case "file-type":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M9 13v-1h6v1" /><path d="M12 12v6" /><path d="M11 18h2" /></svg>);
    case "monitor":
      return (<svg {...props}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>);
    case "database":
      return (<svg {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>);
    case "git-compare":
      return (<svg {...props}><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 012 2v7" /><path d="M11 18H8a2 2 0 01-2-2V9" /></svg>);
    case "layout-grid":
      return (<svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>);
    case "type":
      return (<svg {...props}><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>);
    case "scroll":
      return (<svg {...props}><path d="M8 21h12a2 2 0 002-2v-2H10v2a2 2 0 11-4 0V5a2 2 0 10-4 0v3h4" /><path d="M19 17V5a2 2 0 00-2-2H4" /></svg>);
    // Sprint 3 - Minifiers & Formatters
    case "minimize":
      return (<svg {...props}><path d="M4 12h16" /><path d="M4 6h16" /><path d="M4 18h10" /><path d="M18 14l2 2-2 2" /></svg>);
    case "minimize-js":
      return (<svg {...props}><path d="M4 12h16" /><path d="M4 6h10" /><path d="M18 4l2 2-2 2" /><path d="M4 18h8" /></svg>);
    case "minimize-html":
      return (<svg {...props}><path d="M4 12h16" /><polyline points="8 6 2 12 8 18" /><polyline points="16 6 22 12 16 18" /></svg>);
    case "sparkles":
      return (<svg {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" /></svg>);
    case "wand":
      return (<svg {...props}><path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8L19 13" /><path d="M15 9h.01" /><path d="M17.8 6.2L19 5" /><path d="M11 6.2L9.8 5" /><path d="M2 22l14-14" /></svg>);
    // Sprint 3 - Converters
    case "file-cog":
      return (<svg {...props}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><circle cx="12" cy="15" r="2" /><path d="M12 11v1" /><path d="M12 17v1" /><path d="M8.5 13.5l.7.7" /><path d="M14.8 16.8l.7.7" /></svg>);
    // Sprint 3 - SEO & Web
    case "globe":
      return (<svg {...props}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>);
    case "bot":
      return (<svg {...props}><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" /></svg>);
    case "server":
      return (<svg {...props}><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>);
    case "sitemap":
      return (<svg {...props}><rect x="9" y="2" width="6" height="4" rx="1" /><rect x="2" y="14" width="6" height="4" rx="1" /><rect x="9" y="14" width="6" height="4" rx="1" /><rect x="16" y="14" width="6" height="4" rx="1" /><path d="M12 6v4" /><path d="M5 10h14" /><path d="M5 10v4" /><path d="M12 10v4" /><path d="M19 10v4" /></svg>);
    // Sprint 3 - Design
    case "clip-path":
      return (<svg {...props}><path d="M12 2l8 10H4l8-10z" /><circle cx="12" cy="17" r="4" /></svg>);
    case "animation":
      return (<svg {...props}><path d="M12 3v3" /><path d="M18.5 5.5l-2.1 2.1" /><path d="M21 12h-3" /><path d="M18.5 18.5l-2.1-2.1" /><path d="M12 21v-3" /><path d="M5.5 18.5l2.1-2.1" /><path d="M3 12h3" /><path d="M5.5 5.5l2.1 2.1" /></svg>);
    case "glass":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="3" opacity="0.3" /><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M6 6l12 12" opacity="0.2" /></svg>);
    case "rounded-corner":
      return (<svg {...props}><path d="M12 3h7a2 2 0 012 2v7" /><path d="M3 12v7a2 2 0 002 2h7" /><path d="M3 3h4" /><path d="M3 3v4" /><path d="M21 17v4" /><path d="M17 21h4" /></svg>);
    case "ratio":
      return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M9 12h6" /><path d="M12 9l3 3-3 3" /></svg>);
    // Sprint 3 - Text & Encoding
    case "text-art":
      return (<svg {...props}><path d="M4 6h16" /><path d="M4 10h16" /><path d="M4 14h10" /><path d="M4 18h6" /><rect x="16" y="14" width="5" height="5" rx="1" /></svg>);
    case "strip":
      return (<svg {...props}><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /><line x1="1" y1="1" x2="23" y2="23" /></svg>);
    case "megaphone":
      return (<svg {...props}><path d="M3 11l18-5v12L3 13v-2z" /><path d="M11.6 16.8a3 3 0 11-5.8-1.6" /></svg>);
    // Sprint 3 - Security
    case "shield-lock":
      return (<svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><rect x="9" y="11" width="6" height="5" rx="1" /><path d="M10 11V9a2 2 0 014 0v2" /></svg>);
    case "shield-check":
      return (<svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>);
    case "key-round":
      return (<svg {...props}><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 10-4-4z" /><circle cx="16.5" cy="7.5" r="2.5" /></svg>);
    // Sprint 3 - Utility
    case "tomato":
      return (<svg {...props}><circle cx="12" cy="13" r="8" /><path d="M12 5c-2 0-4 .5-5 1.5" /><path d="M12 5c2 0 4 .5 5 1.5" /><path d="M10 2c0 1.5 1 3 2 3s2-1.5 2-3" /></svg>);
    case "stopwatch":
      return (<svg {...props}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M10 2h4" /><path d="M21 6l-2-2" /></svg>);
    // Sprint 4 - Network
    case "network":
      return (<svg {...props}><rect x="9" y="2" width="6" height="6" rx="1" /><rect x="2" y="16" width="6" height="6" rx="1" /><rect x="16" y="16" width="6" height="6" rx="1" /><path d="M12 8v4" /><path d="M5 16v-4h14v4" /></svg>);
    case "user-search":
      return (<svg {...props}><circle cx="10" cy="7" r="4" /><path d="M10.3 15H7a4 4 0 00-4 4v2" /><circle cx="17" cy="17" r="3" /><path d="M21 21l-1.9-1.9" /></svg>);
    case "status-code":
      return (<svg {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M6 8h.01" /><path d="M10 8h.01" /><path d="M14 8h.01" /><path d="M6 12h12" /><path d="M6 16h8" /></svg>);
    case "smartphone":
      return (<svg {...props}><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>);
    // Sprint 4 - Design
    case "triangle":
      return (<svg {...props}><path d="M12 3l9 18H3L12 3z" /></svg>);
    case "text-shadow":
      return (<svg {...props}><path d="M7 8h10" /><path d="M12 4v16" opacity="0.3" /><path d="M5 12h14" opacity="0.3" /><path d="M17 6.1H3" /><path d="M10 20h4" /></svg>);
    case "gradient-text":
      return (<svg {...props}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h10" /><path d="M3 6l18 12" opacity="0.2" /></svg>);
    case "grid":
      return (<svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /><path d="M9 3v18" /><path d="M15 3v18" /></svg>);
    // Sprint 4 - Converters & Generators
    case "phone":
      return (<svg {...props}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>);
    case "wifi":
      return (<svg {...props}><path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>);
    case "hourglass":
      return (<svg {...props}><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 00-.586-1.414L12 12l-4.414 4.414A2 2 0 007 17.828V22" /><path d="M7 2v4.172a2 2 0 00.586 1.414L12 12l4.414-4.414A2 2 0 0017 6.172V2" /></svg>);
    // Sprint 4 - Utility
    case "globe-clock":
      return (<svg {...props}><circle cx="12" cy="12" r="10" /><path d="M2 12h4" /><path d="M18 12h4" /><polyline points="12 6 12 12 15 15" /></svg>);
    case "dice":
      return (<svg {...props}><rect x="2" y="2" width="20" height="20" rx="3" /><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="16.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="7.5" cy="16.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="16.5" cy="16.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></svg>);
    case "eye-dropper":
      return (<svg {...props}><path d="M2 22l1-1h3l9-9" /><path d="M3 21v-3l9-9" /><circle cx="17" cy="7" r="4" /><path d="M14.5 9.5l-3 3" /></svg>);
    default:
      return (<svg {...props}><circle cx="12" cy="12" r="10" /></svg>);
  }
}
