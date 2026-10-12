import React, { useState } from 'react';
import { ShoppingBag, Shield, Menu, X, Lock } from 'lucide-react';
import { SocioUser, LogoConfig, DesignerConfig } from '../types';
import { ClubLogo } from './ClubLogo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenLoginModal?: () => void;
  onOpenInfoModal: (type: 'planos' | 'parceiros' | 'sua-area' | 'historia' | 'duvidas' | 'fale-conosco') => void;
  onOpenDirectionPanel: () => void;
  socioUser: SocioUser;
  onLogoutSocio: () => void;
  logoConfig: LogoConfig;
  designerConfig?: DesignerConfig;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenLoginModal,
  onOpenInfoModal,
  onOpenDirectionPanel,
  socioUser,
  onLogoutSocio,
  logoConfig,
  designerConfig,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg bg-[#b91c1c] text-white">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Crest & Club Name (Dynamically loaded from LogoConfig) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className="cursor-pointer scale-90 sm:scale-100 origin-left"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ClubLogo config={logoConfig} size="md" />
            </div>

            {/* Wordmark Lockup */}
            <div
              className="flex flex-col cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-xl tracking-wider leading-none font-display uppercase">
                  LOJA OFICIAL DO POEIRÃO
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Center/Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* BOTAO SEJA SOCIO (direciona para https://sitepoeirao.com.br) */}
            <a
              href="https://sitepoeirao.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-[#0080ff] hover:bg-[#006ce0] text-white text-xs font-bold rounded-full shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap uppercase tracking-wide ring-2 ring-blue-400/30 flex items-center gap-1.5"
            >
              <span>SEJA SÓCIO</span>
              <span className="bg-yellow-400 text-neutral-900 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                10% A 30% OFF
              </span>
            </a>

            {/* Sacola de Compras + Cadeado da Direção & Logo do Designer */}
            <div className="flex items-center gap-2 pl-2 border-l border-red-500/40">
              {/* Botão Carrinho / Sacola */}
              <button
                onClick={onOpenCart}
                title="Sacola de Compras"
                className="relative flex items-center gap-2 px-3.5 py-2 bg-black/40 hover:bg-black/60 border border-white/30 rounded-full text-white text-xs font-semibold transition-all hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Sacola</span>
                <span className="bg-white text-red-700 font-extrabold text-[11px] px-2 py-0.5 rounded-full min-w-5 text-center shadow-xs">
                  {cartCount}
                </span>
              </button>

              {/* Botão Cadeado (Logo do Design + Área de Edição/Direção) */}
              <button
                onClick={onOpenDirectionPanel}
                title="Editar Logo do Design & Área da Direção"
                className="relative flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/60 rounded-full text-yellow-300 text-xs font-bold transition-all hover:scale-105 shadow-sm group"
              >
                {/* Logo do Design no Cadeado */}
                {designerConfig?.logoUrl ? (
                  <img
                    src={designerConfig.logoUrl}
                    alt={designerConfig.designerName || 'Logo do Design'}
                    className="w-5 h-5 object-contain rounded-full bg-white/20 p-0.5 border border-yellow-400 shrink-0"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-yellow-400 text-neutral-950 font-black text-[9px] flex items-center justify-center shrink-0 shadow-xs">
                    JP
                  </span>
                )}
                <Lock className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                <span className="hidden xl:inline text-[11px] font-bold">
                  {designerConfig?.designerName ? designerConfig.designerName : 'Design'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-white hover:bg-red-800/60 rounded-full"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-red-700 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Botão Cadeado Mobile com Logo do Design */}
            <button
              onClick={onOpenDirectionPanel}
              title="Logo do Design & Área da Direção"
              className="p-1.5 text-yellow-300 hover:bg-red-800/60 rounded-full flex items-center gap-1 border border-yellow-400/40 bg-black/20"
            >
              {designerConfig?.logoUrl ? (
                <img
                  src={designerConfig.logoUrl}
                  alt={designerConfig.designerName || 'Design'}
                  className="w-5 h-5 object-contain rounded-full bg-white/20 p-0.5 border border-yellow-300 shrink-0"
                />
              ) : (
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-neutral-950 font-black text-[9px] flex items-center justify-center shrink-0">
                  JP
                </span>
              )}
              <Lock className="w-4 h-4 text-yellow-300" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-red-800/60 rounded-full"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Links */}
      <div className="border-t border-red-700/60 bg-[#a61717] py-1.5 sm:py-2 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-3.5 sm:gap-6 text-[11px] sm:text-sm font-semibold tracking-wide overflow-x-auto whitespace-nowrap no-scrollbar">
          <button
            onClick={() => onOpenInfoModal('sua-area')}
            className="text-white/95 hover:text-white hover:underline transition-all underline-offset-4"
          >
            Sua Área
          </button>
          <button
            onClick={() => onOpenInfoModal('duvidas')}
            className="text-white/95 hover:text-white hover:underline transition-all underline-offset-4"
          >
            Dúvidas
          </button>
          <button
            onClick={() => onOpenInfoModal('fale-conosco')}
            className="text-white font-bold hover:text-yellow-300 transition-colors uppercase tracking-wider"
          >
            FALE CONOSCO
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-red-950/95 border-t border-red-800 p-4 space-y-3">
          <div className="space-y-2 pb-3 border-b border-red-800/80">
            <a
              href="https://sitepoeirao.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#0080ff] text-white text-xs font-bold rounded-lg text-center shadow-md uppercase"
            >
              <span>SEJA SÓCIO (10% A 30% OFF)</span>
            </a>



            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDirectionPanel();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-yellow-500/20 border border-yellow-400 text-yellow-300 text-xs font-bold rounded-lg shadow-xs"
            >
              {designerConfig?.logoUrl ? (
                <img
                  src={designerConfig.logoUrl}
                  alt="Design"
                  className="w-4 h-4 object-contain rounded-full bg-white/20 p-0.5 border border-yellow-300"
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-yellow-400 text-neutral-950 font-black text-[8px] flex items-center justify-center">
                  JP
                </span>
              )}
              <Lock className="w-3.5 h-3.5" />
              <span>ÁREA DO DESIGNER & DIREÇÃO</span>
            </button>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-medium pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInfoModal('sua-area');
              }}
              className="text-left py-1 text-red-100 hover:text-white"
            >
              Sua Área do Sócio
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInfoModal('duvidas');
              }}
              className="text-left py-1 text-red-100 hover:text-white"
            >
              Dúvidas
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInfoModal('fale-conosco');
              }}
              className="text-left py-1 text-yellow-300 font-bold"
            >
              FALE CONOSCO
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
