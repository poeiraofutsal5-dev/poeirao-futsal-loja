import React, { useState } from 'react';
import { X, CheckCircle2, QrCode, Copy, Check, CreditCard, ShieldCheck, ArrowLeft, Truck } from 'lucide-react';
import { CartItem, SocioUser } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  socioUser: SocioUser;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  socioUser,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit'>('pix');

  // Form fields
  const [formData, setFormData] = useState({
    name: socioUser.name || 'Torcedor Poeirão',
    cpf: socioUser.cpf || '123.456.789-00',
    email: 'torcedor@poeirao.com.br',
    phone: '(11) 98765-4321',
    cep: '01310-100',
    address: 'Av. Paulista',
    number: '1000',
    complement: 'Apto 42',
    city: 'São Paulo',
    state: 'SP',
    cardNumber: '•••• •••• •••• 4242',
    cardName: 'TORCEDOR POEIRAO',
    cardExpiry: '12/28',
    cardCvv: '888',
  });

  const [copiedPix, setCopiedPix] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Calculations
  const subtotal = items.reduce((acc, item) => {
    const custFee = item.customization ? 29.90 : 0;
    return acc + (item.product.pricePix + custFee) * item.quantity;
  }, 0);

  const discountRate = socioUser.isLoggedIn ? socioUser.discountRate : 0.30;
  const discountAmount = subtotal * discountRate;
  const total = subtotal - discountAmount;

  const formatPrice = (val: number) => {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const dummyPixKey = `00020126580014br.gov.bcb.pix0136poeirao-loja-oficial-${Math.floor(Math.random() * 900000 + 100000)}520400005303986540${total.toFixed(2)}5802BR5920LOJA OFICIAL POEIRAO6009SAO PAULO62070503***6304E8A2`;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(dummyPixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleFinishPayment = () => {
    const code = `POE-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(code);
    setStep('success');
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#b91c1c] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-yellow-300" />
            <h3 className="font-bold text-base font-display">
              {step === 'success' ? 'Pedido Confirmado' : 'Checkout Oficial Sócio Poeirão'}
            </h3>
          </div>
          {step !== 'success' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-red-800 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Step 1: Customer Details & Shipping Address */}
          {step === 'info' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Passo 1 de 2: Dados de Entrega
                </span>
                <span className="text-xs font-bold text-red-700">
                  Total: R$ {formatPrice(total)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">CPF (Validação Sócio)</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                  />
                </div>
                <div className="sm:col-span-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">CEP</label>
                      <input
                        type="text"
                        value={formData.cep}
                        onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-neutral-700 mb-1">Endereço / Rua</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900"
                >
                  Voltar à Sacola
                </button>
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="px-6 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Avançar para Pagamento →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment (Pix or Credit Card) */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <button
                  onClick={() => setStep('info')}
                  className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                </button>
                <span className="text-xs font-bold text-red-700">
                  Total a Pagar: R$ {formatPrice(total)}
                </span>
              </div>

              {/* Payment Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">Pix Instantâneo</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">Aprovação Imediata</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit')}
                  className={`p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'credit'
                      ? 'border-red-600 bg-red-50/50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">Cartão de Crédito</div>
                    <div className="text-[11px] text-neutral-500">Até 10x sem juros</div>
                  </div>
                </button>
              </div>

              {/* Pix View */}
              {paymentMethod === 'pix' && (
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-center space-y-3">
                  <p className="text-xs font-medium text-neutral-700">
                    Escaneie o QR Code abaixo pelo aplicativo do seu banco ou use a chave Copia e Cola:
                  </p>

                  {/* QR Code Graphic */}
                  <div className="w-44 h-44 mx-auto bg-white p-3 border-2 border-dashed border-neutral-300 rounded-lg flex flex-col items-center justify-center shadow-inner">
                    <div className="w-36 h-36 bg-neutral-900 p-2 rounded grid grid-cols-6 grid-rows-6 gap-0.5">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            (i % 2 === 0 && i % 3 === 0) || i < 8 || i > 28
                              ? 'bg-white'
                              : 'bg-neutral-900'
                          } rounded-[1px]`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-xs font-bold text-emerald-800">
                    Valor no Pix: R$ {formatPrice(total)}
                  </div>

                  {/* Copy Pix */}
                  <div className="flex gap-2 max-w-sm mx-auto">
                    <input
                      type="text"
                      readOnly
                      value={dummyPixKey}
                      className="w-full text-[10px] p-2 bg-white border border-neutral-300 rounded font-mono truncate"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded flex items-center gap-1 shrink-0"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleFinishPayment}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-md transition-all mt-2"
                  >
                    Confirmar Pagamento Pix Realizado
                  </button>
                </div>
              )}

              {/* Credit Card View */}
              {paymentMethod === 'credit' && (
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded font-mono font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Validade</label>
                      <input
                        type="text"
                        value={formData.cardExpiry}
                        onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                        className="w-full p-2 border border-neutral-300 rounded font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">CVV</label>
                      <input
                        type="text"
                        value={formData.cardCvv}
                        onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                        className="w-full p-2 border border-neutral-300 rounded font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Nome Impresso no Cartão</label>
                    <input
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      className="w-full p-2 border border-neutral-300 rounded font-medium uppercase"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleFinishPayment}
                    className="w-full py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-bold rounded-lg shadow-md transition-all mt-2"
                  >
                    Pagar R$ {formatPrice(total)} no Cartão
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Success Receipt */}
          {step === 'success' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-neutral-900">
                  Parabéns, seu pedido foi aprovado!
                </h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Código do pedido: <strong className="text-neutral-900 font-mono">{orderId}</strong>
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Enviamos o comprovante oficial e código de rastreamento para {formData.email}.
                </p>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-left text-xs max-w-md mx-auto space-y-1.5">
                <div className="flex justify-between text-neutral-700">
                  <span>Destinatário:</span>
                  <span className="font-semibold">{formData.name}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Endereço de Entrega:</span>
                  <span className="font-semibold">{formData.address}, {formData.number} - {formData.city}/{formData.state}</span>
                </div>
                <div className="flex justify-between text-neutral-700">
                  <span>Previsão de Entrega:</span>
                  <span className="font-semibold text-emerald-700">3 a 5 dias úteis (Sedex Expresso)</span>
                </div>
                <div className="flex justify-between text-neutral-700 pt-2 border-t border-neutral-200">
                  <span>Valor Total Pago:</span>
                  <span className="font-bold text-sm text-neutral-900">R$ {formatPrice(total)}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep('info');
                    onClose();
                  }}
                  className="px-8 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Voltar à Loja do Poeirão
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
