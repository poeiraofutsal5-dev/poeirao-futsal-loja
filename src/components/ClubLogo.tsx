import React from 'react';
import { LogoConfig, LogoId } from '../types';

interface ClubLogoProps {
  config: LogoConfig;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ClubLogo: React.FC<ClubLogoProps> = ({ config, className = '', size = 'md' }) => {
  const { activeLogoId, customLogoUrl } = config;

  if (activeLogoId === 'logo_custom' && customLogoUrl) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <img
          src={customLogoUrl}
          alt="Escudo Oficial do Time"
          className={`object-contain drop-shadow-md rounded ${
            size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-10 h-10'
          }`}
        />
      </div>
    );
  }

  // Dimension scaling
  const scaleClass = size === 'sm' ? 'scale-75' : size === 'lg' ? 'scale-125' : 'scale-100';

  return (
    <div className={`flex flex-col items-center select-none ${scaleClass} ${className}`}>
      {/* 1. Classic Shield Logo (Original) */}
      {activeLogoId === 'logo_1' && (
        <div className="flex flex-col items-center">
          {/* 4 Gold Stars */}
          <div className="flex items-center gap-0.5 mb-0.5">
            <span className="text-[#facc15] text-[11px] leading-none">★</span>
            <span className="text-[#facc15] text-[13px] leading-none -mt-0.5">★</span>
            <span className="text-[#facc15] text-[13px] leading-none -mt-0.5">★</span>
            <span className="text-[#facc15] text-[11px] leading-none">★</span>
          </div>
          {/* Crest Shield */}
          <div className="relative w-8 h-10 bg-white rounded-b-xl border-2 border-black flex flex-col overflow-hidden shadow-md">
            <div className="h-1/2 w-full bg-[#dc2626] flex items-center justify-center">
              <span className="text-[9px] font-black text-white tracking-tighter">PFC</span>
            </div>
            <div className="h-1/2 w-full bg-black flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Circular Retro Crest */}
      {activeLogoId === 'logo_2' && (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5 mb-0.5 text-[#facc15] text-[11px] font-bold">
            ★★★
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#facc15] bg-[#111827] flex items-center justify-center shadow-md relative overflow-hidden">
            <div className="absolute inset-0 border-2 border-[#dc2626] rounded-full"></div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-black via-[#dc2626] to-[#111827] flex items-center justify-center">
              <span className="text-[10px] font-black text-white tracking-wider font-display">PFC</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Golden Champion Crest */}
      {activeLogoId === 'logo_3' && (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5 mb-0.5 text-[#facc15] text-[12px] font-extrabold">
            ★★★★
          </div>
          <svg viewBox="0 0 40 46" className="w-9 h-10 drop-shadow-md">
            <defs>
              <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
            </defs>
            <path d="M 4 2 L 36 2 C 36 28 20 44 20 44 C 20 44 4 28 4 2 Z" fill="#18181b" stroke="url(#goldEdge)" strokeWidth="2.5" />
            <path d="M 7 5 L 20 5 L 20 38 C 12 30 7 20 7 5 Z" fill="#dc2626" />
            <path d="M 20 5 L 33 5 C 33 20 28 30 20 38 Z" fill="#09090b" />
            <text x="20" y="24" fill="#ffffff" fontSize="11" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
              P
            </text>
          </svg>
        </div>
      )}

      {/* 4. Modern Minimalist Diamond / Shield */}
      {activeLogoId === 'logo_4' && (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 mb-0.5 text-[#facc15] text-[10px]">
            ★ ★
          </div>
          <div className="w-9 h-10 bg-neutral-950 border border-white/80 rounded-b-lg flex flex-col items-center justify-center shadow-md relative overflow-hidden">
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rotate-45 transform"></div>
            <span className="text-[12px] font-black text-white tracking-widest relative z-10 font-display">
              POE
            </span>
          </div>
        </div>
      )}

      {/* 5. Escudo Tradicional Rubro-Negro Listrado (Logo 5 solicitado) */}
      {activeLogoId === 'logo_5' && (
        <div className="flex flex-col items-center">
          {/* 4 Estrelas Douradas de Campeão */}
          <div className="flex items-center gap-0.5 mb-0.5 text-[#facc15] drop-shadow-xs font-black text-[11px] leading-none">
            <span>★</span>
            <span className="text-[13px] -mt-0.5">★</span>
            <span className="text-[13px] -mt-0.5">★</span>
            <span>★</span>
          </div>
          {/* Escudo Tradicional com Listras Rubro-Negras e Faixa Central */}
          <svg viewBox="0 0 44 50" className="w-10 h-11 drop-shadow-md">
            <defs>
              <linearGradient id="goldBorderL5" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
              <clipPath id="shieldClipL5">
                <path d="M 4 4 Q 22 8 40 4 C 40 28 22 46 22 46 C 22 46 4 28 4 4 Z" />
              </clipPath>
            </defs>
            {/* Fundo do Escudo com Borda Dourada */}
            <path
              d="M 4 4 Q 22 8 40 4 C 40 28 22 46 22 46 C 22 46 4 28 4 4 Z"
              fill="#111111"
              stroke="url(#goldBorderL5)"
              strokeWidth="2.5"
            />
            {/* Listras Rubro-Negras verticais com ClipPath */}
            <g clipPath="url(#shieldClipL5)">
              {/* Listra 1 (Preta já no fundo) */}
              {/* Listra 2 (Vermelha) */}
              <rect x="10" y="0" width="7" height="50" fill="#dc2626" />
              {/* Listra 3 (Preta no meio) */}
              <rect x="17" y="0" width="10" height="50" fill="#111111" />
              {/* Listra 4 (Vermelha) */}
              <rect x="27" y="0" width="7" height="50" fill="#dc2626" />

              {/* Faixa Central Branca com contorno dourado */}
              <rect x="2" y="16" width="40" height="13" fill="#ffffff" stroke="#eab308" strokeWidth="1" />
              {/* Monograma / Sigla do Clube */}
              <text
                x="22"
                y="26"
                fill="#000000"
                fontSize="8.5"
                fontWeight="900"
                letterSpacing="0.8"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                POEIRÃO
              </text>

              {/* Detalhe inferior: bola clássica ou monograma PFC */}
              <circle cx="22" cy="37" r="4.5" fill="#facc15" stroke="#000000" strokeWidth="0.8" />
              <text
                x="22"
                y="39.5"
                fill="#000000"
                fontSize="5"
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                PFC
              </text>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};
