import React from 'react';

interface CompanyLogoProps {
  variant?: 'icon' | 'full' | 'text-only' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  lightTheme?: boolean;
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  variant = 'full',
  size = 'md',
  lightTheme = false,
  className = '',
}) => {
  // SVG size mapping for different situations
  const sizeMap = {
    sm: { width: 'w-10 h-10', textClass: 'text-lg', subtextClass: 'text-[8px]' },
    md: { width: 'w-14 h-14', textClass: 'text-xl', subtextClass: 'text-[9px]' },
    lg: { width: 'w-24 h-24', textClass: 'text-3xl', subtextClass: 'text-xs' },
    xl: { width: 'w-36 h-36', textClass: 'text-4xl', subtextClass: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  // Geometrical calculations for the 7-sided star network (heptagon)
  // Fixed coordinates center at (100, 100) for viewBox (0 0 200 200)
  const cx = 100;
  const cy = 100;
  const r = 62; // Slightly adjusted radius to leave room for radar outer rings and tick marks
  const numNodes = 7;
  
  // Compute positions of the 7 vertices starting from the top center
  const nodes = Array.from({ length: numNodes }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / numNodes - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      id: i,
    };
  });

  // 12 subtle tick marks radiating at the top of the outer ring (spanning -145 to -35 degrees)
  const ticks = Array.from({ length: 12 }).map((_, k) => {
    const angleDeg = -145 + k * (110 / 11);
    const angleRad = (angleDeg * Math.PI) / 180;
    const innerR = r + 8; // start right outside constellation
    const outerR = r + 18; // extend outwards
    return {
      x1: cx + innerR * Math.cos(angleRad),
      y1: cy + innerR * Math.sin(angleRad),
      x2: cx + outerR * Math.cos(angleRad),
      y2: cy + outerR * Math.sin(angleRad),
    };
  });

  // Render the interconnected constellation network
  const renderConstellationSVG = (darkBg: boolean) => {
    const lines: React.ReactNode[] = [];
    
    // Draw lines between every pair of nodes
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        // Sequentially connected outer boundary edges vs interior cross links
        const isMainEdge = (j - i === 1) || (i === 0 && j === numNodes - 1);
        
        // Use high fidelity glowing cyan and sky blue colors matching the image exactly
        const strokeColor = isMainEdge ? '#38bdf8' : '#0284c7';
        const opacity = isMainEdge ? 0.95 : 0.45;
        const strokeWidth = isMainEdge ? 1.75 : 0.75;
        
        lines.push(
          <line
            key={`line-${i}-${j}`}
            x1={nodes[i].x}
            y1={nodes[i].y}
            x2={nodes[j].x}
            y2={nodes[j].y}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeOpacity={opacity}
          />
        );
      }
    }

    return (
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle background radial blue glow inside constellation */}
        <defs>
          <radialGradient id="constellation-glow" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r + 15} fill="url(#constellation-glow)" />

        {/* Outer technical dash/dot ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r + 10}
          stroke="#1e293b"
          strokeWidth="0.75"
          strokeDasharray="2 6"
          strokeOpacity="0.5"
        />

        {/* 12 subtle radial tick marks at the top header area of the gauge */}
        {ticks.map((tick, idx) => (
          <line
            key={`tick-${idx}`}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="#1e293b"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
        ))}

        {/* Sharp technical L-shaped corner brackets in the 4 corners */}
        <path d="M 12 28 L 12 12 L 28 12" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.8" />
        <path d="M 188 28 L 188 12 L 172 12" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.8" />
        <path d="M 12 172 L 12 188 L 28 188" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.8" />
        <path d="M 188 172 L 188 188 L 172 188" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.8" />

        {/* Radar/coordinate indicator dots in open regions of the heptagon */}
        <circle cx="100" cy="100" r="1.5" fill="#38bdf8" fillOpacity="0.8" />
        <circle cx="82" cy="85" r="1.2" fill="#0ea5e9" fillOpacity="0.6" />
        <circle cx="118" cy="85" r="1.2" fill="#0ea5e9" fillOpacity="0.6" />
        <circle cx="88" cy="120" r="1.2" fill="#0ea5e9" fillOpacity="0.6" />
        <circle cx="112" cy="120" r="1.2" fill="#0ea5e9" fillOpacity="0.6" />

        {/* Interconnected star lines */}
        {lines}

        {/* Node vertices with high fidelity cyan outer glow rings and bright blue cores */}
        {nodes.map((node) => (
          <g key={`node-group-${node.id}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="4"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="0.75"
              strokeOpacity="0.9"
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="2.2"
              fill="#22d3ee"
            />
          </g>
        ))}

        {/* Tiny subtle technical version tag in the bottom right corner exactly like the image */}
        <text
          x="188"
          y="192"
          fill="#334155"
          fontSize="5"
          fontFamily="monospace"
          textAnchor="end"
          opacity="0.6"
        >
          v1
        </text>
      </svg>
    );
  };

  if (variant === 'icon') {
    return (
      <div className={`shrink-0 bg-[#020813] border border-slate-900 rounded-xl p-1.5 flex items-center justify-center ${currentSize.width} ${className}`}>
        {renderConstellationSVG(true)}
      </div>
    );
  }

  if (variant === 'text-only') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <div className="font-display font-bold tracking-wider uppercase flex items-center text-2xl">
          <span className={lightTheme ? 'text-slate-900' : 'text-white'}>12</span>
          <span className="text-sky-500 ml-1.5 font-extrabold">Links</span>
        </div>
        <div className={`w-36 h-[1px] ${lightTheme ? 'bg-slate-200' : 'bg-slate-800'} my-2`} />
        <span className="uppercase font-mono tracking-[0.25em] text-[8px] text-slate-500 font-semibold">
          Future Technologies
        </span>
      </div>
    );
  }

  if (variant === 'horizontal') {
    // Elegant horizontal layout for headers, matching light backgrounds perfectly
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* Constellation inside its small high-fidelity dark-tech container */}
        <div className="w-11 h-11 shrink-0 bg-[#020813] border border-slate-950 rounded-xl p-1 shadow-md flex items-center justify-center">
          {renderConstellationSVG(true)}
        </div>
        {/* Crisp, high-contrast readable brand text */}
        <div className="flex flex-col text-left justify-center">
          <div className="font-display font-bold tracking-wider uppercase flex items-center text-[15px] leading-none">
            <span className={lightTheme ? 'text-slate-900' : 'text-white'}>12</span>
            <span className="text-sky-500 ml-1 font-extrabold">Links</span>
          </div>
          <span className={`uppercase font-mono tracking-[0.18em] text-[8px] font-bold ${lightTheme ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
            Future Technologies
          </span>
        </div>
      </div>
    );
  }

  // 'full' variant matches the exact square brand card uploaded by the user
  return (
    <div className={`bg-[#020813] border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden w-full max-w-[290px] aspect-square mx-auto ${className}`}>
      {/* Constellation is placed in the top-center */}
      <div className="w-40 h-40 flex items-center justify-center">
        {renderConstellationSVG(true)}
      </div>

      {/* Brand Text Block centered below with exact typography pairing */}
      <div className="flex flex-col items-center mt-3 text-center">
        <div className="font-display font-black tracking-wider uppercase flex items-center text-2xl sm:text-3xl leading-none">
          <span className="text-white">12</span>
          <span className="text-sky-500 ml-1.5 font-extrabold">LINKS</span>
        </div>
        
        {/* Fine horizontal line divider */}
        <div className="w-36 h-[1px] bg-slate-800/80 my-2.5" />
        
        {/* Subtitle in spaced monospace */}
        <span className="uppercase font-mono tracking-[0.25em] text-[8px] text-slate-500 font-bold whitespace-nowrap">
          Future Technologies
        </span>
      </div>
    </div>
  );
};
