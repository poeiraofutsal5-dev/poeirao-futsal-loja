import React, { useState } from 'react';
import { X, Shield, Phone, Mail, MapPin, MessageSquare, CheckCircle, HelpCircle, Trophy, Users, Award } from 'lucide-react';

interface InfoModalProps {
  type: 'planos' | 'parceiros' | 'sua-area' | 'historia' | 'duvidas' | 'fale-conosco' | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, isOpen, onClose }) => {
  if (!isOpen || !type) return null;

  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#b91c1c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-base font-display">
              {type === 'planos' && 'Planos Oficiais Sócio Poeirão'}
              {type === 'parceiros' && 'Rede de Parceiros Poeirão'}
              {type === 'sua-area' && 'Sua Área do Sócio'}
              {type === 'historia' && 'A História Gloriosa do Poeirão'}
              {type === 'duvidas' && 'Perguntas Frequentes & Dúvidas'}
              {type === 'fale-conosco' && 'Fale Conosco · Atendimento Oficial'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-red-800 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-neutral-800 space-y-4 max-h-[80vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* 1. HISTÓRIA DO POEIRÃO */}
          {type === 'historia' && (
            <div className="space-y-3 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-base text-red-800">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span>Tradição, Raça e Paixão Rubro-Negra</span>
              </div>
              <p>
                O <strong>Poeirão Futebol Clube</strong> nasceu nos campos de terra batida da várzea apaixonada, onde a poeira levantada a cada desarme e gol representava a alma do torcedor trabalhador. Ao longo das décadas, o manto tricolor tornou-se símbolo de superação e conquistas lendárias.
              </p>
              <p>
                Hoje, com o programa <strong>Sócio Poeirão</strong> e a Loja Oficial, cada compra fortalece as categorias de base, as reformas do estádio e a montagem de um elenco campeão para a temporada 2026/2027.
              </p>
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="font-bold text-red-900 block mb-1">As 4 Estrelas Douradas:</span>
                <span className="text-neutral-700">Representam os quatro títulos históricos mais emblemáticos da trajetória do clube.</span>
              </div>
            </div>
          )}

          {/* 2. PARCEIROS POEIRÃO */}
          {type === 'parceiros' && (
            <div className="space-y-3">
              <p className="text-neutral-600">
                Além dos descontos nesta loja virtual, sua carteirinha do Sócio Poeirão garante benefícios exclusivos na rede de parceiros credenciados:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">Postos & Combustível</div>
                  <div className="text-emerald-700 font-semibold text-xs mt-0.5">R$ 0,15 de desconto por litro</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">Farmácias Conveniadas</div>
                  <div className="text-emerald-700 font-semibold text-xs mt-0.5">Até 40% OFF em genéricos</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">Academias Parceiras</div>
                  <div className="text-emerald-700 font-semibold text-xs mt-0.5">Mensalidade com 25% OFF</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="font-bold text-neutral-900">Supermercados Locais</div>
                  <div className="text-emerald-700 font-semibold text-xs mt-0.5">Cashback exclusivo nos finais de semana</div>
                </div>
              </div>
            </div>
          )}

          {/* 3. SUA ÁREA */}
          {type === 'sua-area' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
                <Users className="w-5 h-5 text-red-700" />
                <span>Central de Gerenciamento do Torcedor</span>
              </div>
              <p className="text-neutral-600">
                Na Sua Área você pode emitir a 2ª via da carteirinha virtual, atualizar formas de pagamento das mensalidades, conferir histórico de compras da loja e resgatar ingressos prioritários para jogos no Caldeirão do Poeirão.
              </p>
              <div className="p-3 bg-neutral-100 rounded-lg text-center">
                <span className="font-semibold block text-neutral-800">Já é associado?</span>
                <span className="text-xs text-neutral-500">Utilize o botão ENTRAR no canto superior do site para acessar o portal integrado.</span>
              </div>
            </div>
          )}

          {/* 4. DÚVIDAS */}
          {type === 'duvidas' && (
            <div className="space-y-3">
              <div className="border-b border-neutral-200 pb-2">
                <div className="font-bold text-neutral-900">Como funciona o Desconto Sócio Gold (30%) na Loja?</div>
                <div className="text-neutral-600 text-xs mt-1">Ao fazer login na sua conta de sócio, todos os valores do catálogo recebem 30% de desconto automático do Sócio Gold.</div>
              </div>
              <div className="border-b border-neutral-200 pb-2">
                <div className="font-bold text-neutral-900">Quanto tempo demora a entrega dos produtos?</div>
                <div className="text-neutral-600 text-xs mt-1">Enviamos em até 24h úteis após confirmação do Pix ou cartão. O prazo de entrega varia de 2 a 7 dias úteis via Sedex/Correios.</div>
              </div>
              <div className="border-b border-neutral-200 pb-2">
                <div className="font-bold text-neutral-900">Posso trocar camisas personalizadas com nome e número?</div>
                <div className="text-neutral-600 text-xs mt-1">Peças personalizadas só podem ser trocadas em caso de defeito de fabricação. Camisas sem personalização possuem 30 dias para troca grátis.</div>
              </div>
            </div>
          )}

          {/* 5. FALE CONOSCO */}
          {type === 'fale-conosco' && (
            <div>
              {contactSent ? (
                <div className="py-6 text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <div className="font-bold text-base text-neutral-900">Mensagem Enviada!</div>
                  <div className="text-xs text-neutral-600">Nossa central de atendimento entrará em contato em menos de 2 horas.</div>
                </div>
              ) : (
                <form onSubmit={handleSendContact} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="font-bold text-neutral-700 block mb-1">Seu Nome</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full p-2 border border-neutral-300 rounded"
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-neutral-700 block mb-1">E-mail</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full p-2 border border-neutral-300 rounded"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-bold text-neutral-700 block mb-1">Mensagem ou Dúvida sobre Pedido</label>
                    <textarea
                      required
                      rows={3}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full p-2 border border-neutral-300 rounded text-xs"
                      placeholder="Como podemos te ajudar hoje?"
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-neutral-700" /> (11) 4004-7632
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-neutral-700" /> loja@sociopoeirao.com.br
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-bold rounded-lg transition-all"
                  >
                    Enviar Mensagem à Diretoria da Loja
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 6. PLANOS */}
          {type === 'planos' && (
            <div className="space-y-3">
              <p className="text-neutral-600">
                Confira os planos oficiais do Sócio Poeirão e escolha o que melhor se adapta a você:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>Plano Raiz</span>
                    <span className="text-red-700">R$ 29,90/mês</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">15% OFF na Loja + Acesso antecipado ao lote de ingressos</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>Plano Ouro (Sócio Gold)</span>
                    <span className="text-red-700">R$ 59,90/mês</span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">30% OFF na Loja + Desconto de 50% em todos os jogos em casa + 1 Manto Oficial anual</div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>Plano Diamante VIP</span>
                    <span className="text-red-700">R$ 119,90/mês</span>
                  </div>
                  <div className="text-xs text-neutral-700 mt-1">25% OFF na Loja + Acesso livre ao Camarote VIP + Kit exclusivo de pré-temporada</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
