import React from 'react';
import { Product } from '../types';

interface ProductRenderProps {
  type: Product['visualType'];
  customImageUrl?: string;
  className?: string;
  isHovered?: boolean;
}

export const ProductRender: React.FC<ProductRenderProps> = ({ type, customImageUrl, className = '', isHovered = false }) => {
  const hasCustomImage = Boolean(customImageUrl && customImageUrl.trim().length > 0);

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out select-none ${
        isHovered ? 'scale-105' : 'scale-100'
      } ${className}`}
    >
      {/* Custom image uploaded by board - renders EXCLUSIVELY, never overlapping with default graphics */}
      {hasCustomImage ? (
        <img
          src={customImageUrl}
          alt="Produto"
          className="max-h-56 max-w-full object-contain drop-shadow-md rounded"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : type === 'none' || !type ? (
        /* Clean placeholder when no default graphic is selected */
        <div className="flex flex-col items-center justify-center text-neutral-300 p-4 text-center">
          <svg className="w-14 h-14 mb-1 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-medium text-neutral-400">Sem foto adicionada</span>
        </div>
      ) : (
        <>
          {/* 1. SB Chron Skateboarding Shoe (Direct match for Image 2, Item 1) */}
          {type === 'shoe_sb' && (
        <svg viewBox="0 0 500 280" className="w-full h-auto drop-shadow-md max-h-56">
          <defs>
            <linearGradient id="sbCanvasGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#252528" />
              <stop offset="60%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <linearGradient id="sbSoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e4e4e7" />
            </linearGradient>
            <filter id="shadowSb" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="12" stdDeviation="10" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Floor Shadow */}
          <ellipse cx="250" cy="246" rx="200" ry="12" fill="#000000" fillOpacity="0.12" filter="blur(4px)" />

          {/* Shoe Upper Silhouette */}
          <path
            d="M 60 210 C 65 185 95 168 140 162 C 180 156 220 120 250 102 C 265 92 285 100 295 118 C 305 132 340 142 385 146 C 415 150 435 170 440 210 Z"
            fill="url(#sbCanvasGrad)"
            filter="url(#shadowSb)"
          />

          {/* Suede Toe Cap Overlay */}
          <path
            d="M 60 210 C 65 190 90 176 130 172 C 135 195 130 205 125 210 Z"
            fill="#121214"
            opacity="0.9"
          />
          <path
            d="M 65 208 C 72 192 92 178 128 174"
            stroke="#3f3f46"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            fill="none"
          />

          {/* Collar / Heel Padding */}
          <path
            d="M 285 100 C 295 98 310 110 320 125 C 310 128 292 118 285 100 Z"
            fill="#09090b"
          />
          <path
            d="M 320 125 C 340 135 365 142 390 144 C 415 148 435 168 440 210 L 400 210 C 395 178 375 160 340 152 Z"
            fill="#141416"
          />

          {/* Laces & Eyelets */}
          <g stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.95">
            <line x1="200" y1="145" x2="225" y2="135" />
            <line x1="215" y1="135" x2="242" y2="122" />
            <line x1="235" y1="122" x2="260" y2="112" />
            <line x1="250" y1="112" x2="276" y2="104" />
          </g>

          {/* Big White Classic Swoosh Check */}
          <path
            d="M 185 175 C 220 175 290 140 345 130 C 330 148 290 190 220 188 C 190 187 175 180 185 175 Z"
            fill="#ffffff"
          />

          {/* Vulcanized White Midsole */}
          <rect x="52" y="210" width="395" height="26" rx="6" fill="url(#sbSoleGrad)" stroke="#d4d4d8" strokeWidth="1" />
          {/* Black Foxing Pinstripe along Sole */}
          <line x1="52" y1="218" x2="447" y2="218" stroke="#18181b" strokeWidth="2.5" />
          {/* Textured Toe Bumper */}
          <path d="M 52 214 Q 75 212 90 222 L 85 236 L 52 236 Z" fill="#e4e4e7" opacity="0.6" />
        </svg>
      )}

      {/* 2. Revolution 8 Running Sneaker (Direct match for Image 2, Item 2) */}
      {type === 'shoe_runner' && (
        <svg viewBox="0 0 500 280" className="w-full h-auto drop-shadow-md max-h-56">
          <defs>
            <linearGradient id="runnerKnitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#27272a" />
              <stop offset="50%" stopColor="#18181b" />
              <stop offset="100%" stopColor="#0f0f11" />
            </linearGradient>
            <linearGradient id="foamSoleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#f4f4f5" />
              <stop offset="100%" stopColor="#e4e4e7" />
            </linearGradient>
            <pattern id="meshPattern" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1" fill="#3f3f46" opacity="0.7" />
            </pattern>
          </defs>

          {/* Shadow */}
          <ellipse cx="255" cy="250" rx="205" ry="12" fill="#000000" fillOpacity="0.14" filter="blur(5px)" />

          {/* Breathable Knit Upper */}
          <path
            d="M 75 198 C 85 165 125 142 170 138 C 215 134 250 102 280 84 C 298 74 316 80 326 98 C 336 114 365 128 405 132 C 430 135 448 155 450 198 Z"
            fill="url(#runnerKnitGrad)"
          />
          {/* Mesh Texture Overlay */}
          <path
            d="M 80 196 C 90 168 128 145 170 140 C 212 136 248 106 278 88 C 295 78 310 84 320 100 C 330 116 360 130 400 134 C 425 138 440 158 445 196 Z"
            fill="url(#meshPattern)"
            opacity="0.8"
          />

          {/* Sleek Nike White Swoosh Curve */}
          <path
            d="M 230 152 C 265 152 320 120 370 106 C 360 124 325 162 265 165 C 235 166 222 158 230 152 Z"
            fill="#ffffff"
            filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))"
          />

          {/* Mini Accent Swoosh near toe */}
          <path d="M 125 168 C 135 168 148 160 158 156 C 154 162 144 170 132 171 Z" fill="#ffffff" />

          {/* Modern Thick Sculpted Runner Foam Midsole with Curve */}
          <path
            d="M 70 196 C 100 196 160 200 210 204 C 270 208 340 206 400 194 C 440 186 462 195 455 218 C 448 238 410 244 350 244 C 250 244 140 242 74 228 C 65 226 62 210 70 196 Z"
            fill="url(#foamSoleGrad)"
            stroke="#d4d4d8"
            strokeWidth="1.2"
          />
          {/* Aerodynamic Midsole Groove */}
          <path
            d="M 220 218 C 280 222 350 218 435 208"
            stroke="#e4e4e7"
            strokeWidth="3"
            fill="none"
          />
          {/* Black Rubber Outsole Treads */}
          <path
            d="M 76 228 C 140 242 250 244 350 244 C 390 244 425 240 440 232 L 442 238 C 420 247 380 250 340 250 C 240 250 135 247 72 234 Z"
            fill="#18181b"
          />
        </svg>
      )}

      {/* 3. Victori One Slide Sandal (Direct match for Image 2, Item 3) */}
      {type === 'slide_victori' && (
        <svg viewBox="0 0 500 280" className="w-full h-auto drop-shadow-md max-h-56">
          <defs>
            <linearGradient id="slideMatteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c2c30" />
              <stop offset="50%" stopColor="#1e1e22" />
              <stop offset="100%" stopColor="#121214" />
            </linearGradient>
            <linearGradient id="strapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#252528" />
              <stop offset="100%" stopColor="#0c0c0e" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="250" cy="246" rx="200" ry="14" fill="#000000" fillOpacity="0.16" filter="blur(5px)" />

          {/* Background Slide (Angled/Tilted pair as in image 2) */}
          <g transform="rotate(-18 360 140) translate(60, -40)">
            <ellipse cx="280" cy="190" rx="140" ry="46" fill="#18181b" stroke="#27272a" strokeWidth="2" />
            <path
              d="M 210 160 C 230 120 310 120 330 160 C 310 190 230 190 210 160 Z"
              fill="url(#strapGrad)"
            />
            {/* White Brand Text on Background Strap */}
            <text
              x="270"
              y="160"
              fontFamily="Impact, sans-serif"
              fontSize="28"
              fontWeight="bold"
              letterSpacing="2"
              fill="#ffffff"
              textAnchor="middle"
              transform="rotate(6 270 160)"
            >
              POEIRÃO
            </text>
          </g>

          {/* Foreground Slide (Anatomical contoured footbed) */}
          <g>
            {/* Outsole Base */}
            <path
              d="M 90 216 C 90 195 140 186 210 186 C 290 186 380 192 410 212 C 418 226 405 240 370 244 C 290 252 180 248 110 242 C 92 238 90 226 90 216 Z"
              fill="url(#slideMatteGrad)"
              stroke="#2e2e33"
              strokeWidth="2"
            />

            {/* Contoured Footbed Insole Rim with Ridges */}
            <path
              d="M 105 214 C 115 200 160 192 220 192 C 290 192 370 198 395 212 C 375 234 290 242 210 240 C 140 238 110 228 105 214 Z"
              fill="#18181b"
            />
            {/* Footbed Traction Ridges */}
            <path d="M 150 208 Q 170 212 190 208" stroke="#27272a" strokeWidth="2" fill="none" />
            <path d="M 170 218 Q 190 222 210 218" stroke="#27272a" strokeWidth="2" fill="none" />
            <path d="M 190 226 Q 210 230 230 226" stroke="#27272a" strokeWidth="2" fill="none" />

            {/* Wide Padded Upper Strap */}
            <path
              d="M 175 198 C 190 148 290 148 315 198 C 295 234 195 234 175 198 Z"
              fill="url(#strapGrad)"
              stroke="#38383e"
              strokeWidth="1.5"
              filter="drop-shadow(0 6px 6px rgba(0,0,0,0.4))"
            />

            {/* Bold Brand Wordmark in White with Swoosh underline */}
            <text
              x="245"
              y="185"
              fontFamily="Impact, Arial Black, sans-serif"
              fontSize="30"
              fontWeight="bold"
              letterSpacing="2"
              fill="#ffffff"
              textAnchor="middle"
            >
              POEIRÃO
            </text>
            <path
              d="M 205 194 C 230 202 260 202 285 192 C 275 197 250 200 220 196 Z"
              fill="#ffffff"
            />
          </g>
        </svg>
      )}

      {/* 4. Official Jersey 1 (Tricolor / Rubro-Negro Striped with Shield & Stars) */}
      {type === 'jersey_home' && (
        <svg viewBox="0 0 400 380" className="w-full h-auto drop-shadow-md max-h-60">
          <defs>
            <linearGradient id="fabricShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
            </linearGradient>
            <clipPath id="jerseyClip">
              <path d="M 130 50 Q 200 85 270 50 L 370 120 L 320 170 L 290 150 L 290 350 Q 200 365 110 350 L 110 150 L 80 170 L 30 120 Z" />
            </clipPath>
          </defs>

          {/* Jersey Body Contour */}
          <g clipPath="url(#jerseyClip)">
            {/* Vertical Stripes: Black & Red with White thin separators */}
            <rect x="0" y="0" width="400" height="400" fill="#dc2626" />
            <rect x="70" y="0" width="40" height="400" fill="#111827" />
            <rect x="150" y="0" width="40" height="400" fill="#111827" />
            <rect x="230" y="0" width="40" height="400" fill="#111827" />
            <rect x="310" y="0" width="40" height="400" fill="#111827" />
            {/* White pinstripes */}
            <line x1="68" y1="0" x2="68" y2="400" stroke="#ffffff" strokeWidth="4" />
            <line x1="112" y1="0" x2="112" y2="400" stroke="#ffffff" strokeWidth="4" />
            <line x1="148" y1="0" x2="148" y2="400" stroke="#ffffff" strokeWidth="4" />
            <line x1="192" y1="0" x2="192" y2="400" stroke="#ffffff" strokeWidth="4" />
            <line x1="228" y1="0" x2="228" y2="400" stroke="#ffffff" strokeWidth="4" />
            <line x1="272" y1="0" x2="272" y2="400" stroke="#ffffff" strokeWidth="4" />
            <line x1="308" y1="0" x2="308" y2="400" stroke="#ffffff" strokeWidth="4" />

            {/* Fabric Crease Shading */}
            <rect x="0" y="0" width="400" height="400" fill="url(#fabricShade)" />

            {/* Chest Sponsor Box */}
            <rect x="135" y="215" width="130" height="34" rx="4" fill="#111827" opacity="0.95" />
            <text x="200" y="238" fill="#ffffff" fontSize="13" fontWeight="bold" letterSpacing="2" textAnchor="middle" fontFamily="sans-serif">
              SÓCIO POEIRÃO
            </text>
          </g>

          {/* V-Collar */}
          <path d="M 130 50 Q 200 85 270 50 L 260 62 Q 200 95 140 62 Z" fill="#ffffff" stroke="#111827" strokeWidth="1" />
          <path d="M 195 90 L 200 102 L 205 90 Z" fill="#dc2626" />

          {/* Sleeve Cuffs */}
          <path d="M 30 120 L 80 170 L 72 176 L 22 126 Z" fill="#111827" />
          <path d="M 370 120 L 320 170 L 328 176 L 378 126 Z" fill="#111827" />

          {/* Shield Crest on Chest (Left side) */}
          <g transform="translate(142, 132) scale(0.65)">
            {/* 4 Gold Stars */}
            <path d="M -18 -8 L -16 -2 L -10 -2 L -15 2 L -13 8 L -18 4 L -23 8 L -21 2 L -26 -2 L -20 -2 Z" fill="#eab308" />
            <path d="M -6 -11 L -4 -5 L 2 -5 L -3 -1 L -1 5 L -6 1 L -11 5 L -9 -1 L -14 -5 L -8 -5 Z" fill="#facc15" />
            <path d="M 6 -11 L 8 -5 L 14 -5 L 9 -1 L 11 5 L 6 1 L 1 5 L 3 -1 L -2 -5 L 4 -5 Z" fill="#facc15" />
            <path d="M 18 -8 L 20 -2 L 26 -2 L 21 2 L 23 8 L 18 4 L 13 8 L 15 2 L 10 -2 L 16 -2 Z" fill="#eab308" />
            {/* White Shield */}
            <path d="M -22 0 L 22 0 C 22 22 0 36 0 36 C 0 36 -22 22 -22 0 Z" fill="#ffffff" stroke="#111827" strokeWidth="2" />
            {/* Red & Black Inserts */}
            <path d="M -17 3 L -2 3 L -2 24 C -9 20 -15 14 -17 3 Z" fill="#dc2626" />
            <path d="M 2 3 L 17 3 C 15 14 9 20 2 24 Z" fill="#111827" />
            {/* Shield Monogram */}
            <text x="0" y="17" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              PFC
            </text>
          </g>

          {/* Supplier Brand Mark (Right chest) */}
          <path d="M 240 148 C 248 148 260 140 270 135 C 267 142 258 150 244 151 Z" fill="#ffffff" />
        </svg>
      )}

      {/* 5. Official Jersey 2 (White Away with Red/Black Chest Band) */}
      {type === 'jersey_away' && (
        <svg viewBox="0 0 400 380" className="w-full h-auto drop-shadow-md max-h-60">
          <defs>
            <linearGradient id="whiteFabricShade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.08" />
            </linearGradient>
            <clipPath id="awayClip">
              <path d="M 130 50 Q 200 85 270 50 L 370 120 L 320 170 L 290 150 L 290 350 Q 200 365 110 350 L 110 150 L 80 170 L 30 120 Z" />
            </clipPath>
          </defs>

          <g clipPath="url(#awayClip)">
            {/* White Body */}
            <rect x="0" y="0" width="400" height="400" fill="#f8fafc" />

            {/* Horizontal Chest Stripes: Red & Black */}
            <rect x="0" y="160" width="400" height="24" fill="#dc2626" />
            <rect x="0" y="184" width="400" height="24" fill="#111827" />
            <line x1="0" y1="160" x2="400" y2="160" stroke="#facc15" strokeWidth="2" />
            <line x1="0" y1="208" x2="400" y2="208" stroke="#facc15" strokeWidth="2" />

            {/* Fabric Shading */}
            <rect x="0" y="0" width="400" height="400" fill="url(#whiteFabricShade)" />

            <text x="200" y="240" fill="#1e293b" fontSize="12" fontWeight="bold" letterSpacing="3" textAnchor="middle" fontFamily="sans-serif">
              SÓCIO POEIRÃO
            </text>
          </g>

          {/* Red/Black Ribbed Collar */}
          <path d="M 130 50 Q 200 85 270 50 L 260 62 Q 200 95 140 62 Z" fill="#dc2626" stroke="#111827" strokeWidth="2" />

          {/* Sleeve Cuffs */}
          <path d="M 30 120 L 80 170 L 72 176 L 22 126 Z" fill="#dc2626" />
          <path d="M 370 120 L 320 170 L 328 176 L 378 126 Z" fill="#dc2626" />

          {/* Crest centered on chest stripe */}
          <g transform="translate(200, 150) scale(0.68)">
            {/* 4 Gold Stars */}
            <path d="M -18 -8 L -16 -2 L -10 -2 L -15 2 L -13 8 L -18 4 L -23 8 L -21 2 L -26 -2 L -20 -2 Z" fill="#eab308" />
            <path d="M -6 -11 L -4 -5 L 2 -5 L -3 -1 L -1 5 L -6 1 L -11 5 L -9 -1 L -14 -5 L -8 -5 Z" fill="#facc15" />
            <path d="M 6 -11 L 8 -5 L 14 -5 L 9 -1 L 11 5 L 6 1 L 1 5 L 3 -1 L -2 -5 L 4 -5 Z" fill="#facc15" />
            <path d="M 18 -8 L 20 -2 L 26 -2 L 21 2 L 23 8 L 18 4 L 13 8 L 15 2 L 10 -2 L 16 -2 Z" fill="#eab308" />
            <path d="M -22 0 L 22 0 C 22 22 0 36 0 36 C 0 36 -22 22 -22 0 Z" fill="#ffffff" stroke="#111827" strokeWidth="2" />
            <path d="M -17 3 L -2 3 L -2 24 C -9 20 -15 14 -17 3 Z" fill="#dc2626" />
            <path d="M 2 3 L 17 3 C 15 14 9 20 2 24 Z" fill="#111827" />
            <text x="0" y="17" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              PFC
            </text>
          </g>
        </svg>
      )}

      {/* 6. All Black Jersey */}
      {type === 'jersey_black' && (
        <svg viewBox="0 0 400 380" className="w-full h-auto drop-shadow-md max-h-60">
          <defs>
            <linearGradient id="blackStealthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1f1f23" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <clipPath id="blackClip">
              <path d="M 130 50 Q 200 85 270 50 L 370 120 L 320 170 L 290 150 L 290 350 Q 200 365 110 350 L 110 150 L 80 170 L 30 120 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#blackClip)">
            <rect x="0" y="0" width="400" height="400" fill="url(#blackStealthGrad)" />
            {/* Tone-on-tone camouflage geometric lines */}
            <line x1="80" y1="0" x2="220" y2="400" stroke="#27272a" strokeWidth="24" opacity="0.3" />
            <line x1="200" y1="0" x2="340" y2="400" stroke="#27272a" strokeWidth="24" opacity="0.3" />
            {/* Stealth Sponsor */}
            <text x="200" y="235" fill="#3f3f46" fontSize="13" fontWeight="bold" letterSpacing="3" textAnchor="middle" fontFamily="sans-serif">
              POEIRÃO STEALTH
            </text>
          </g>
          {/* Subtle Red Cuffs */}
          <path d="M 30 120 L 80 170 L 72 176 L 22 126 Z" fill="#991b1b" />
          <path d="M 370 120 L 320 170 L 328 176 L 378 126 Z" fill="#991b1b" />
          <path d="M 130 50 Q 200 85 270 50 L 260 62 Q 200 95 140 62 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          {/* Matte Black/Gold Crest */}
          <g transform="translate(142, 134) scale(0.65)">
            <path d="M -6 -11 L -4 -5 L 2 -5 L -3 -1 L -1 5 L -6 1 L -11 5 L -9 -1 L -14 -5 L -8 -5 Z" fill="#ca8a04" />
            <path d="M 6 -11 L 8 -5 L 14 -5 L 9 -1 L 11 5 L 6 1 L 1 5 L 3 -1 L -2 -5 L 4 -5 Z" fill="#ca8a04" />
            <path d="M -22 0 L 22 0 C 22 22 0 36 0 36 C 0 36 -22 22 -22 0 Z" fill="#18181b" stroke="#52525b" strokeWidth="2" />
            <text x="0" y="20" fill="#a1a1aa" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
              PFC
            </text>
          </g>
        </svg>
      )}

      {/* 7. Travel Windbreaker Jacket */}
      {type === 'jacket_travel' && (
        <svg viewBox="0 0 400 380" className="w-full h-auto drop-shadow-md max-h-60">
          <defs>
            <linearGradient id="jacketRed" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <clipPath id="jacketClip">
              <path d="M 140 60 L 260 60 L 380 130 L 330 180 L 290 160 L 290 350 Q 200 360 110 350 L 110 160 L 70 180 L 20 130 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#jacketClip)">
            {/* Upper Chest: Deep Red */}
            <rect x="0" y="0" width="400" height="190" fill="url(#jacketRed)" />
            {/* Lower Body: Charcoal Black */}
            <rect x="0" y="190" width="400" height="210" fill="#18181b" />
            {/* Diagonal Chevron Cut Line */}
            <polygon points="0,180 200,210 400,180 400,195 200,225 0,195" fill="#f8fafc" />
            {/* Center Zipper Line */}
            <line x1="200" y1="60" x2="200" y2="355" stroke="#09090b" strokeWidth="4" />
            <rect x="196" y="110" width="8" height="16" rx="2" fill="#d4d4d8" />
            {/* Zipper Pockets */}
            <line x1="140" y1="270" x2="160" y2="310" stroke="#27272a" strokeWidth="3" />
            <line x1="260" y1="270" x2="240" y2="310" stroke="#27272a" strokeWidth="3" />
          </g>
          {/* Hood Collar */}
          <path d="M 140 60 C 140 30 260 30 260 60 Z" fill="#18181b" stroke="#71717a" strokeWidth="1" />
          {/* Crest */}
          <circle cx="150" cy="140" r="14" fill="#ffffff" />
          <text x="150" y="144" fill="#991b1b" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
            PFC
          </text>
        </svg>
      )}

      {/* 8. Travel Hoodie */}
      {type === 'hoodie_travel' && (
        <svg viewBox="0 0 400 380" className="w-full h-auto drop-shadow-md max-h-60">
          <defs>
            <clipPath id="hoodieClip">
              <path d="M 140 65 L 260 65 L 380 135 L 330 185 L 290 165 L 290 350 Q 200 360 110 350 L 110 165 L 70 185 L 20 135 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#hoodieClip)">
            <rect x="0" y="0" width="400" height="400" fill="#27272a" />
            {/* Kangaroo Pocket */}
            <path d="M 140 270 L 260 270 L 275 330 L 125 330 Z" fill="#1f1f23" stroke="#3f3f46" strokeWidth="2" />
            {/* Club Wordmark across chest */}
            <text x="200" y="170" fill="#ffffff" fontSize="22" fontWeight="bold" letterSpacing="4" textAnchor="middle" fontFamily="sans-serif">
              POEIRÃO
            </text>
            <text x="200" y="190" fill="#ef4444" fontSize="10" fontWeight="bold" letterSpacing="3" textAnchor="middle" fontFamily="sans-serif">
              TRAVEL & TRAINING
            </text>
          </g>
          {/* Drawstrings */}
          <path d="M 185 75 L 185 130" stroke="#f4f4f5" strokeWidth="3" strokeLinecap="round" />
          <path d="M 215 75 L 215 125" stroke="#f4f4f5" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}

      {/* 9. Heritage Basketball Tank Top */}
      {type === 'tank_heritage' && (
        <svg viewBox="0 0 400 380" className="w-full h-auto drop-shadow-md max-h-60">
          <defs>
            <clipPath id="tankClip">
              <path d="M 140 50 Q 200 95 260 50 L 285 110 L 270 160 L 270 350 Q 200 360 130 350 L 130 160 L 115 110 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#tankClip)">
            <rect x="0" y="0" width="400" height="400" fill="#18181b" />
            {/* Side stripes */}
            <rect x="125" y="0" width="10" height="400" fill="#dc2626" />
            <rect x="265" y="0" width="10" height="400" fill="#dc2626" />
            {/* Arched Wordmark "POEIRAO" */}
            <text x="200" y="175" fill="#ffffff" fontSize="26" fontWeight="900" letterSpacing="3" textAnchor="middle" fontFamily="Impact, sans-serif">
              POEIRÃO
            </text>
            <text x="200" y="240" fill="#dc2626" fontSize="56" fontWeight="900" textAnchor="middle" fontFamily="Impact, sans-serif">
              26
            </text>
          </g>
          {/* Ribbed Striped Neck & Armholes */}
          <path d="M 140 50 Q 200 95 260 50" stroke="#dc2626" strokeWidth="6" fill="none" />
        </svg>
      )}

      {/* 10. Dry-fit Tank */}
      {type === 'tank_dryfit' && (
        <svg viewBox="0 0 400 380" className="w-full h-auto drop-shadow-md max-h-60">
          <defs>
            <clipPath id="dryTankClip">
              <path d="M 140 50 Q 200 85 260 50 L 285 105 L 270 155 L 270 350 Q 200 360 130 350 L 130 155 L 115 105 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#dryTankClip)">
            <rect x="0" y="0" width="400" height="400" fill="#b91c1c" />
            <polygon points="130,220 270,160 270,350 130,350" fill="#991b1b" />
            <path d="M 190 160 C 205 160 220 150 230 145 C 225 152 215 158 200 159 Z" fill="#ffffff" />
            <text x="200" y="200" fill="#ffffff" fontSize="11" fontWeight="bold" letterSpacing="2" textAnchor="middle">
              MATCHDAY DRY
            </text>
          </g>
        </svg>
      )}

      {/* 11. Trucker Cap */}
      {type === 'cap_trucker' && (
        <svg viewBox="0 0 400 280" className="w-full h-auto drop-shadow-md max-h-52">
          {/* Curved Visor / Brim */}
          <path d="M 80 200 C 130 225 270 225 320 200 C 350 215 310 235 200 235 C 90 235 50 215 80 200 Z" fill="#18181b" stroke="#27272a" strokeWidth="2" />
          {/* Structured Crown Front Panel */}
          <path d="M 110 200 C 105 120 160 85 200 85 C 240 85 295 120 290 200 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
          {/* Mesh Back */}
          <path d="M 240 88 C 290 100 325 140 315 198" stroke="#3f3f46" strokeWidth="3" strokeDasharray="4 3" fill="none" />
          {/* Front Patch */}
          <rect x="165" y="125" width="70" height="45" rx="6" fill="#18181b" stroke="#ffffff" strokeWidth="1.5" />
          <text x="200" y="146" fill="#ffffff" fontSize="10" fontWeight="bold" letterSpacing="1" textAnchor="middle">
            POEIRÃO
          </text>
          <text x="200" y="160" fill="#facc15" fontSize="12" letterSpacing="2" textAnchor="middle">
            ★★★★
          </text>
        </svg>
      )}

      {/* 12. Utility Backpack */}
      {type === 'backpack' && (
        <svg viewBox="0 0 340 380" className="w-full h-auto drop-shadow-md max-h-60">
          {/* Main Body */}
          <rect x="80" y="70" width="180" height="260" rx="35" fill="#18181b" stroke="#27272a" strokeWidth="2" />
          {/* Top Carry Handle */}
          <path d="M 140 70 C 140 45 200 45 200 70" stroke="#3f3f46" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Front Utility Pocket */}
          <rect x="95" y="170" width="150" height="130" rx="16" fill="#27272a" />
          {/* Bottom Shoe Compartment */}
          <rect x="95" y="270" width="150" height="45" rx="10" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
          <line x1="95" y1="270" x2="245" y2="270" stroke="#ef4444" strokeWidth="2" />
          {/* Shield Badge */}
          <circle cx="170" cy="125" r="20" fill="#ffffff" />
          <text x="170" y="130" fill="#991b1b" fontSize="10" fontWeight="bold" textAnchor="middle">
            PFC
          </text>
        </svg>
      )}
        </>
      )}
    </div>
  );
};
