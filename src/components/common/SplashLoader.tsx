import React from 'react';

const SplashLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center splash-container">
      <style>{`
        :root {
          /* Light Mode Defaults */
          --sl-bg: #f8fafc;         /* slate-50 */
          --sl-trace-bg: #cbd5e1;   /* slate-300 */
          --sl-trace-flow: #3b82f6; /* blue-500 */
          --sl-trace-flow-2: #60a5fa; /* blue-400 */
          
          --sl-chip-1: #f1f5f9;     /* slate-100 */
          --sl-chip-2: #cbd5e1;     /* slate-300 */
          --sl-chip-stroke: #94a3b8; /* slate-400 */
          
          --sl-text-1: #1e293b;     /* slate-800 */
          --sl-text-2: #64748b;     /* slate-500 */
          
          --sl-pin-1: #cbd5e1;      /* slate-300 */
          --sl-pin-2: #94a3b8;      /* slate-400 */
          --sl-pin-3: #64748b;      /* slate-500 */
          
          --sl-dot: #cbd5e1;        /* slate-300 */
        }

        .dark {
          /* Dark Mode Overrides */
          --sl-bg: #1a1a1a;         /* dark gray */
          --sl-trace-bg: #252525;
          --sl-trace-flow: #399fff;
          --sl-trace-flow-2: #399fff;
          
          --sl-chip-1: #2d2d2d;
          --sl-chip-2: #0f0f0f;
          --sl-chip-stroke: #222;
          
          --sl-text-1: #eeeeee;
          --sl-text-2: #888888;
          
          --sl-pin-1: #bbbbbb;
          --sl-pin-2: #888888;
          --sl-pin-3: #555555;
          
          --sl-dot: #000000;
        }

        .splash-container {
          background-color: var(--sl-bg);
          transition: background-color 0.5s ease;
          width: 100%;
          height: 100%;
        }

        .splash-loader-wrapper {
          width: 100%;
          max-width: 600px;
          padding: 20px;
        }
        
        .trace-bg {
          stroke: var(--sl-trace-bg);
          stroke-width: 1.8;
          fill: none;
          transition: stroke 0.5s ease;
        }

        .trace-flow {
          stroke-width: 1.8;
          fill: none;
          stroke-dasharray: 40 400;
          stroke-dashoffset: 438;
          animation: flow 3s cubic-bezier(0.5, 0, 0.9, 1) infinite;
        }
        
        .flow-primary {
           stroke: var(--sl-trace-flow);
           color: var(--sl-trace-flow);
           filter: drop-shadow(0 0 6px var(--sl-trace-flow));
        }
        
        .flow-secondary {
           stroke: var(--sl-trace-flow-2);
           color: var(--sl-trace-flow-2);
           filter: drop-shadow(0 0 6px var(--sl-trace-flow-2));
        }

        @keyframes flow {
          to {
            stroke-dashoffset: 0;
          }
        }
        
        /* Gradients Transitions - Using CSS classes on stops */
        .stop-chip-1 { stop-color: var(--sl-chip-1); transition: stop-color 0.5s; }
        .stop-chip-2 { stop-color: var(--sl-chip-2); transition: stop-color 0.5s; }
        
        .stop-text-1 { stop-color: var(--sl-text-1); transition: stop-color 0.5s; }
        .stop-text-2 { stop-color: var(--sl-text-2); transition: stop-color 0.5s; }
        
        .stop-pin-1 { stop-color: var(--sl-pin-1); transition: stop-color 0.5s; }
        .stop-pin-2 { stop-color: var(--sl-pin-2); transition: stop-color 0.5s; }
        .stop-pin-3 { stop-color: var(--sl-pin-3); transition: stop-color 0.5s; }

        .chip-rect {
           stroke: var(--sl-chip-stroke);
           transition: stroke 0.5s;
        }
        
        .dot {
           fill: var(--sl-dot);
           transition: fill 0.5s;
        }
      `}</style>
      
      <div className="splash-loader-wrapper">
        <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <defs>
            <linearGradient id="chipGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className="stop-chip-1"></stop>
              <stop offset="100%" className="stop-chip-2"></stop>
            </linearGradient>

            <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className="stop-text-1"></stop>
              <stop offset="100%" className="stop-text-2"></stop>
            </linearGradient>

            <linearGradient id="pinGradient" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" className="stop-pin-1"></stop>
              <stop offset="50%" className="stop-pin-2"></stop>
              <stop offset="100%" className="stop-pin-3"></stop>
            </linearGradient>
          </defs>

          <g id="traces">
            <path d="M100 100 H200 V210 H326" className="trace-bg"></path>
            <path d="M100 100 H200 V210 H326" className="trace-flow flow-secondary"></path>

            <path d="M80 180 H180 V230 H326" className="trace-bg"></path>
            <path d="M80 180 H180 V230 H326" className="trace-flow flow-primary"></path>

            <path d="M60 260 H150 V250 H326" className="trace-bg"></path>
            <path d="M60 260 H150 V250 H326" className="trace-flow flow-secondary"></path>

            <path d="M100 350 H200 V270 H326" className="trace-bg"></path>
            <path d="M100 350 H200 V270 H326" className="trace-flow flow-primary"></path>

            <path d="M700 90 H560 V210 H474" className="trace-bg"></path>
            <path d="M700 90 H560 V210 H474" className="trace-flow flow-primary"></path>

            <path d="M740 160 H580 V230 H474" className="trace-bg"></path>
            <path d="M740 160 H580 V230 H474" className="trace-flow flow-secondary"></path>

            <path d="M720 250 H590 V250 H474" className="trace-bg"></path>
            <path d="M720 250 H590 V250 H474" className="trace-flow flow-primary"></path>

            <path d="M680 340 H570 V270 H474" className="trace-bg"></path>
            <path d="M680 340 H570 V270 H474" className="trace-flow flow-secondary"></path>
          </g>

          <rect
            x="330"
            y="190"
            width="140"
            height="100"
            rx="20"
            ry="20"
            fill="url(#chipGradient)"
            className="chip-rect"
            strokeWidth="3"
            filter="drop-shadow(0 0 6px rgba(0,0,0,0.1))"
          ></rect>

          <g>
            <rect
              x="322"
              y="205"
              width="8"
              height="10"
              fill="url(#pinGradient)"
              rx="2"
            ></rect>
            <rect
              x="322"
              y="225"
              width="8"
              height="10"
              fill="url(#pinGradient)"
              rx="2"
            ></rect>
            <rect
              x="322"
              y="245"
              width="8"
              height="10"
              fill="url(#pinGradient)"
              rx="2"
            ></rect>
            <rect
              x="322"
              y="265"
              width="8"
              height="10"
              fill="url(#pinGradient)"
              rx="2"
            ></rect>
          </g>

          <g>
            <rect
              x="470"
              y="205"
              width="8"
              height="10"
              fill="url(#pinGradient)"
              rx="2"
            ></rect>
            <rect
              x="470"
              y="225"
              width="8"
              height="10"
              fill="url(#pinGradient)"
              rx="2"
            ></rect>
            <rect
              x="470"
              y="245"
              width="8"
              height="10"
              fill="url(#pinGradient)"
              rx="2"
            ></rect>
            <rect
              x="470"
              y="265"
              width="8"
              height="10"
              fill="url(#pinGradient)"
              rx="2"
            ></rect>
          </g>

          <text
            x="400"
            y="240"
            fontFamily="Arial, sans-serif"
            fontSize="22"
            fill="url(#textGradient)"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight="bold"
            letterSpacing="1px"
          >
            Loading
          </text>

          <circle cx="100" cy="100" r="5" className="dot"></circle>
          <circle cx="80" cy="180" r="5" className="dot"></circle>
          <circle cx="60" cy="260" r="5" className="dot"></circle>
          <circle cx="100" cy="350" r="5" className="dot"></circle>

          <circle cx="700" cy="90" r="5" className="dot"></circle>
          <circle cx="740" cy="160" r="5" className="dot"></circle>
          <circle cx="720" cy="250" r="5" className="dot"></circle>
          <circle cx="680" cy="340" r="5" className="dot"></circle>
        </svg>
      </div>
    </div>
  );
};

export default SplashLoader;