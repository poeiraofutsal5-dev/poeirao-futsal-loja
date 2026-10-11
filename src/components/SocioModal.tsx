import React, { useState } from 'react';
import { X, Shield, KeyRound, Check, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { SocioUser } from '../types';

interface SocioModalProps {
  mode: 'recovery' | 'plans' | 'login' | null;
  isOpen: boolean;
  onClose: () => void;
  onLoginSocio: (user: SocioUser) => void;
}

export const SocioModal: React.FC<SocioModalProps> = ({
  mode,
  isOpen,
  onClose,
  onLoginSocio,
}) => {
  if (!isOpen || !mode) return null;

  // Recovery state
  const [recoveryIdentifier, setRecoveryIdentifier] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  // Login state
  const [cpfOrEmail, setCpfOrEmail] = useState('');
  const [password, setPassword] = useState('');

  // Plans selection
  const [selectedPlan, setSelectedPlan] = useState<'Plano Raiz' | 'Plano Ouro' | 'Plano Diamante'>('Plano Ouro');
  const [planSubscribed, setPlanSubscribed] = useState(false);

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryIdentifier) return;
    setRecoverySuccess(true);
    setTimeout(() => {
      setRecoverySuccess(false);
      onClose();
    }, 2500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login as member
    onLoginSocio({
      isLoggedIn: true,
      name: 'Carlos Roberto da Silva',
      cpf: '456.789.012-34',
      planName: 'Plano Ouro (Sócio Gold)',
      discountRate: 0.30,
      cardNumber: 'SOCIO-88941',
    });
    onClose();
  };

  const handleDemoLogin = (type: 'ouro' | 'diamante') => {
    if (type === 'diamante') {
      onLoginSocio({
        isLoggedIn: true,
        name: 'Mariana Souza (VIP)',
        cpf: '888.111.222-33',
        planName: 'Plano Diamante',
        discountRate: 0.35,
        cardNumber: 'SOCIO-00105',
      });
    } else {
      onLoginSocio({
        isLoggedIn: true,
        name: 'Carlos Roberto (Sócio Gold)',
        cpf: '456.789.012-34',
        planName: 'Plano Ouro (Sócio Gold)',
        discountRate: 0.30,
        cardNumber: 'SOCIO-88941',
      });
    }
    onClose();
  };

  const handleSubscribePlan = (plan: 'Plano Raiz' | 'Plano Ouro' | 'Plano Diamante') => {
    const rate = plan === 'Plano Diamante' ? 0.35 : plan === 'Plano Ouro' ? 0.30 : 0.15;
    onLoginSocio({
      isLoggedIn: true,
      name: 'Novo Sócio Associado',
      cpf: '123.456.789-00',
      planName: plan === 'Plano Ouro' ? 'Plano Ouro (Sócio Gold)' : plan,
      discountRate: rate,
      cardNumber: `SOCIO-${Math.floor(10000 + Math.random() * 90000)}`,
    });
    setPlanSubscribed(true);
    setTimeout(() => {
      setPlanSubscribed(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#b91c1c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-7 bg-white rounded-b-md border border-black flex flex-col overflow-hidden">
              <div className="h-1/2 bg-[#dc2626] flex items-center justify-center">
                <span className="text-[7px] font-black text-white">PFC</span>
              </div>
              <div className="h-1/2 bg-black"></div>
            </div>
            <h3 className="font-bold text-base font-display">
              {mode === 'recovery' && 'Recuperar Senha · Sócio Poeirão'}
              {mode === 'plans' && 'Quero Me Associar ao Poeirão'}
              {mode === 'login' && 'Entrar na Área do Sócio'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-red-800 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. RECUPERAR SENHA MODAL */}
        {mode === 'recovery' && (
          <div className="p-6">
            {recoverySuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-neutral-900">Link de Recuperação Enviado!</h4>
                <p className="text-xs text-neutral-600">
                  Verifique sua caixa de entrada e spam. Enviamos as instruções para redefinição segura de sua senha.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRecovery} className="space-y-4">
                <div className="text-xs text-neutral-600 leading-relaxed">
                  Digite seu <strong>CPF</strong> ou <strong>E-mail</strong> cadastrado como sócio torcedor para receber o link de redefinição de senha via WhatsApp e E-mail.
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    CPF ou E-mail Cadastrado
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00 ou seu@email.com"
                    value={recoveryIdentifier}
                    onChange={(e) => setRecoveryIdentifier(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:ring-2 focus:ring-[#0070f3] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0070f3] hover:bg-[#0060df] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  Enviar Link de Recuperação
                </button>
              </form>
            )}
          </div>
        )}

        {/* 2. QUERO ME ASSOCIAR MODAL (PLANS & BENEFITS) */}
        {mode === 'plans' && (
          <div className="p-6 space-y-4">
            {planSubscribed ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-neutral-900">Associação Confirmada com Sucesso!</h4>
                <p className="text-xs text-neutral-600">
                  Bem-vindo à família Sócio Poeirão! Seus descontos de sócio já estão desbloqueados na loja.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-xs text-neutral-600">
                    Faça parte do quadro de sócios do Poeirão e garanta descontos automáticos de <strong>10% a 30% OFF</strong> em todos os itens da loja oficial!
                  </p>
                </div>

                {/* Plan Cards */}
                <div className="space-y-2.5">
                  {/* Plano Raiz (10% OFF) */}
                  <div
                    onClick={() => setSelectedPlan('Plano Raiz')}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === 'Plano Raiz'
                        ? 'border-red-600 bg-red-50/40'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-xs text-neutral-900">Plano Raiz Arquibancada</div>
                        <div className="text-[11px] text-neutral-500">10% de desconto em toda a Loja Oficial</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-neutral-900">R$ 29,90</span>
                        <span className="text-[10px] text-neutral-500 block">/mês</span>
                      </div>
                    </div>
                  </div>

                  {/* Plano Ouro / Sócio Gold (30% OFF) */}
                  <div
                    onClick={() => setSelectedPlan('Plano Ouro')}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all relative ${
                      selectedPlan === 'Plano Ouro'
                        ? 'border-red-600 bg-red-50/50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="absolute -top-2 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Mais Escolhido · 30% OFF
                    </span>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-xs text-neutral-900">Plano Ouro (Sócio Gold)</div>
                        <div className="text-[11px] text-neutral-500 font-semibold text-red-700">30% de desconto em toda a Loja Oficial + Desconto em Ingressos</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-neutral-900">R$ 59,90</span>
                        <span className="text-[10px] text-neutral-500 block">/mês</span>
                      </div>
                    </div>
                  </div>

                  {/* Plano Diamante VIP (30% OFF) */}
                  <div
                    onClick={() => setSelectedPlan('Plano Diamante')}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === 'Plano Diamante'
                        ? 'border-yellow-500 bg-yellow-50/40'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-xs text-neutral-900">Plano Diamante Camarotes VIP</div>
                        <div className="text-[11px] text-neutral-500">30% de desconto na Loja Oficial + Camarote VIP</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-neutral-900">R$ 119,90</span>
                        <span className="text-[10px] text-neutral-500 block">/mês</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <a
                    href="https://sitepoeirao.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#0080ff] hover:bg-[#006ce0] text-white text-xs font-bold rounded-lg shadow-md uppercase tracking-wider transition-all block text-center"
                  >
                    Ir para sitepoeirao.com.br e Assinar
                  </a>
                  <button
                    type="button"
                    onClick={() => handleSubscribePlan(selectedPlan)}
                    className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg text-center"
                  >
                    Simular Ativação na Loja Agora
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* 3. ENTRAR MODAL (LOGIN & QUICK SOCIO SIMULATOR) */}
        {mode === 'login' && (
          <div className="p-6 space-y-4">
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  CPF ou E-mail do Sócio
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpfOrEmail}
                  onChange={(e) => setCpfOrEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs p-2.5 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                Entrar e Ativar Desconto Sócio Gold (30%)
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
