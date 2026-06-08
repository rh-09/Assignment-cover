import React from 'react';

interface KuetLogoProps {
  className?: string;
  size?: number | string;
}

export const KuetLogo: React.FC<KuetLogoProps> = ({ className = '', size = "120px" }) => {
  return (
    <div style={{ width: size, height: 'auto', aspectRatio: '500/550' }} className={`relative mx-auto ${className}`}>
      <svg
        viewBox="0 0 500 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Definition of curved paths for text-on-path wrapping */}
        <defs>
          {/* Path for the curved university name text wrapping along the bottom shield boundary */}
          <path
            id="curvedNamePath"
            d="M 50,195 C 40,360 120,470 250,512 C 380,470 460,360 450,195"
            fill="none"
          />
        </defs>

        {/* 1. Main Green Shield Shield Base */}
        <path
          d="M 50,75 C 150,45 350,45 450,75 C 475,200 440,440 250,518 C 60,440 25,200 50,75 Z"
          fill="#00a651"
          stroke="#111111"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* 2. Sun Aura at the top (Yellow rays) */}
        <g stroke="#fff000" strokeWidth="4" strokeLinecap="round">
          {/* Circular outward rays */}
          <line x1="250" y1="110" x2="250" y2="70" />
          
          <line x1="210" y1="115" x2="195" y2="80" />
          <line x1="175" y1="125" x2="150" y2="95" />
          <line x1="145" y1="145" x2="115" y2="120" />
          
          <line x1="290" y1="115" x2="305" y2="80" />
          <line x1="325" y1="125" x2="350" y2="95" />
          <line x1="355" y1="145" x2="385" y2="120" />
        </g>

        {/* Sun Disk Core */}
        <circle cx="250" cy="125" r="45" fill="#ffffff" />

        {/* 3. Red Sacred Flame of Knowledge in Sun Core */}
        <path
          d="M 250,90 C 235,115 240,135 250,150 C 260,135 265,115 250,90 Z"
          fill="#ed1c24"
        />
        <path
          d="M 250,105 C 242,120 245,132 250,143 C 255,132 258,120 250,105 Z"
          fill="#ffdf00"
        />

        {/* 4. Elegant Open Book of Wisdom */}
        {/* Book Outer Contour Blocks */}
        <path
          d="M 250,290 C 190,260 145,260 115,285 L 115,185 C 145,160 190,165 250,195 C 310,165 355,160 385,185 L 385,285 C 355,260 310,260 250,290 Z"
          fill="#ffffff"
          stroke="#111111"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Left Book Page Stack Shadow Lines */}
        <path d="M 120,188 C 148,165 190,170 246,198 C 246,298 246,298 246,298 C 190,268 148,268 120,193 C 120,193 120,188 120,188 Z" stroke="#111111" strokeWidth="1" />
        <path d="M 125,191 C 151,170 190,175 242,201 C 242,301 242,301 242,301 C 190,271 151,271 125,196 C 125,191 125,191 125,191 Z" stroke="#111111" strokeWidth="1" />
        <path d="M 130,194 C 154,175 190,180 238,204 C 238,304 238,304 238,304 C 190,274 154,274 130,199 C 130,199 130,194 130,194 Z" stroke="#111111" strokeWidth="1" />
        
        {/* Right Book Page Stack Shadow Lines */}
        <path d="M 380,188 C 352,165 310,170 254,198 C 254,298 254,298 254,298 C 310,268 352,268 380,193" stroke="#111111" strokeWidth="1" />
        <path d="M 375,191 C 349,170 310,175 258,201 C 258,301 258,301 258,301 C 310,271 349,271 375,196" stroke="#111111" strokeWidth="1" />
        <path d="M 370,194 C 346,175 310,180 262,204 C 262,304 262,304 262,304 C 310,274 346,274 370,199" stroke="#111111" strokeWidth="1" />

        {/* Book Center Binding shadow split around text */}
        <line x1="250" y1="195" x2="250" y2="201" stroke="#111111" strokeWidth="2.5" />
        <line x1="250" y1="279" x2="250" y2="291" stroke="#111111" strokeWidth="2.5" />

        {/* 5. Bengali Motto Texts Inside Book (Centered horizontally across pages just like the official uploaded logo) */}
        <text
          x="250"
          y="218"
          fill="#111111"
          fontSize="18"
          fontWeight="bold"
          fontFamily="SolaimanLipi, Vrinda, system-ui, -apple-system, sans-serif"
          textAnchor="middle"
        >
          প্রভু!
        </text>
        <text
          x="250"
          y="243"
          fill="#111111"
          fontSize="18"
          fontWeight="bold"
          fontFamily="SolaimanLipi, Vrinda, system-ui, -apple-system, sans-serif"
          textAnchor="middle"
        >
          আমায়
        </text>
        <text
          x="250"
          y="268"
          fill="#111111"
          fontSize="18"
          fontWeight="bold"
          fontFamily="SolaimanLipi, Vrinda, system-ui, -apple-system, sans-serif"
          textAnchor="middle"
        >
          জ্ঞান দাও
        </text>

        {/* 6. Bangladesh Text curved around outer border */}
        {/* Bengali font has good support on modern systems */}
        <text fill="#ffffff" fontSize="22" fontWeight="bold" fontFamily="SolaimanLipi, Vrinda, system-ui, -apple-system, sans-serif" letterSpacing="0.25rem">
          <textPath
            href="#curvedNamePath"
            startOffset="50%"
            textAnchor="middle"
            method="align"
            spacing="auto"
          >
            খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়
          </textPath>
        </text>
      </svg>
    </div>
  );
};
