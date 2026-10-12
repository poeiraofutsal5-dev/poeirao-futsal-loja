import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, Sparkles, MessageCircle, Edit3, Check } from 'lucide-react';
import { CartItem, SocioUser } from '../types';
import { ProductRender } from './ProductRender';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onUpdateCustomization: (cartItemId: string, name: string, number: string) => void;
  socioUser: SocioUser;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateCustomization,
  socioUser,
}) => {
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [customNameInput, setCustomNameInput] = useState('');
  const [customNumberInput, setCustomNumberInput] = useState('10');
  const [customerName, setCustomerName] = useState(socioUser.isLoggedIn ? socioUser.name : '');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!isOpen) return null;

  // Calculate pricing
  const subtotal = items.reduce((acc, item) => {
    const custFee = item.customization ? 29.90 : 0;
    return acc + (item.product.pricePix + custFee) * item.quantity;
  }, 0);

  // Sócio discount (Sócio Gold 30%)
  const socioDiscountRate = socioUser.isLoggedIn ? socioUser.discountRate : 0.30;
  const socioDiscountAmount = subtotal * socioDiscountRate;
  const finalTotal = Math.max(0, subtotal - socioDiscountAmount);

  const formatPrice = (val: number) => {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleStartEditingCustom = (item: CartItem) => {
    setEditingCustomId(item.id);
    setCustomNameInput(item.customization?.name || '');
    setCustomNumberInput(item.customization?.number || '10');
  };

  const handleSaveCustom = (itemId: string) => {
    onUpdateCustomization(itemId, customNameInput.trim().toUpperCase(), customNumberInput.trim());
    setEditingCustomId(null);
  };

  // Build WhatsApp Message with Number, Name and Size for each item as requested
  const handleCheckoutWhatsApp = () => {
    const phoneTeam = '5577981677054'; // WhatsApp oficial do time Poeirão: (77) 98167-7054
    
    let message = `🔴⚫ *NOVO PEDIDO - LOJA OFICIAL SÓCIO POEIRÃO*\n\n`;
    
    if (customerName.trim()) {
      message += `👤 *Torcedor:* ${customerName.trim()}\n`;
    }
    if (socioUser.isLoggedIn) {
      message += `⭐ *Sócio Poeirão Ativo:* Sim (${socioUser.planName || 'Sócio Gold'} - ${Math.round(socioUser.discountRate * 100)}% de desconto)\n`;
    } else {
      message += `⭐ *Desconto Sócio Gold (30%):* Aplicado\n`;
    }
    message += `💳 *Pagamento:* A combinar (Pix ou Cartão)\n\n`;
    
    message += `📋 *ITENS DO PEDIDO:*\n`;
    items.forEach((item, index) => {
      message += `\n*${index + 1}. ${item.product.name}*\n`;
      message += `• *Tamanho:* ${item.selectedSize}\n`;
      message += `• *Quantidade:* ${item.quantity}\n`;
      
      if (item.customization && item.customization.name) {
        message += `• *Personalização da Camisa:*\n`;
        message += `  - *Nome:* ${item.customization.name}\n`;
        message += `  - *Número:* ${item.customization.number || '10'}\n`;
      } else {
        message += `• *Personalização:* Sem personalização\n`;
      }
      
      const itemPrice = (item.product.pricePix + (item.customization ? 29.90 : 0)) * item.quantity;
      message += `• *Subtotal:* R$ ${formatPrice(itemPrice)}\n`;
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *VALOR TOTAL COM DESCONTO:* R$ ${formatPrice(finalTotal)}\n`;
    message += `Gostaria de confirmar meu pedido e combinar o pagamento (Pix ou Cartão)! Aguardo retorno.`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneTeam}?text=${encoded}`;

    // Reliable link trigger across mobile & desktop browsers
    try {
      const link = document.createElement('a');
      link.href = whatsappUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 300);
    } catch {
      window.location.href = whatsappUrl;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#b91c1c] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="font-bold text-base tracking-wide font-display">
              Sacola de Compras ({items.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-red-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center text-neutral-500">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mb-3" />
              <p className="font-bold text-neutral-800 text-base">Sua sacola está vazia</p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Explore as camisas oficiais, calçados e novidades da coleção Poeirão.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-5 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 transition-all"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-3 flex flex-col space-y-2">
                <div className="flex gap-3">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-[#f5f5f5] rounded-md shrink-0 flex items-center justify-center p-2 border border-neutral-200 overflow-hidden">
                    <ProductRender
                      type={item.product.visualType}
                      customImageUrl={item.product.customImageUrl}
                      className="max-h-16"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-red-600 p-0.5 ml-1"
                        title="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Tamanho: <strong className="text-neutral-900">{item.selectedSize}</strong>
                    </p>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-neutral-300 rounded text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-neutral-900 tabular-nums">
                          R$ {formatPrice((item.product.pricePix + (item.customization ? 29.90 : 0)) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personalização de Nome e Número (Requested by user) */}
                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 text-xs">
                  {editingCustomId === item.id ? (
                    <div className="space-y-2">
                      <span className="font-bold text-neutral-800 text-[11px] block">
                        Personalizar com Nome e Número:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">Nome:</label>
                          <input
                            type="text"
                            maxLength={14}
                            placeholder="Ex: ROGÉRIO"
                            value={customNameInput}
                            onChange={(e) => setCustomNameInput(e.target.value.toUpperCase())}
                            className="w-full text-xs p-1.5 border border-neutral-300 rounded uppercase font-bold focus:ring-1 focus:ring-red-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-neutral-600 block mb-0.5">Número:</label>
                          <input
                            type="text"
                            maxLength={2}
                            placeholder="Ex: 10"
                            value={customNumberInput}
                            onChange={(e) => setCustomNumberInput(e.target.value)}
                            className="w-full text-xs p-1.5 border border-neutral-300 rounded font-bold focus:ring-1 focus:ring-red-600 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCustomId(null)}
                          className="px-2 py-1 text-[11px] text-neutral-600 hover:text-neutral-900"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveCustom(item.id)}
                          className="px-3 py-1 bg-red-700 text-white text-[11px] font-bold rounded flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Salvar
                        </button>
                      </div>
                    </div>
                  ) : item.customization && item.customization.name ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-neutral-700">Personalizado: </span>
                        <strong className="text-red-800">
                          #{item.customization.number} {item.customization.name}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartEditingCustom(item)}
                        className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1 text-[11px] underline"
                      >
                        <Edit3 className="w-3 h-3" /> Editar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 text-[11px]">
                        Sem nome ou número nas costas
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStartEditingCustom(item)}
                        className="text-red-700 hover:text-red-900 font-bold text-[11px] flex items-center gap-1"
                      >
                        + Adicionar Nome e Número
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 space-y-3">
            {/* Optional Customer Name */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 mb-0.5">
                Seu Nome (para identificação no WhatsApp):
              </label>
              <input
                type="text"
                placeholder="Ex: Carlos Roberto"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs p-2 border border-neutral-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1 text-xs pt-2 border-t border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal dos Itens:</span>
                <span className="tabular-nums font-medium">R$ {formatPrice(subtotal)}</span>
              </div>

              {/* Desconto Sócio Gold (30%) */}
              <div className="flex justify-between text-red-700 font-semibold">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  {socioUser.isLoggedIn && socioUser.planName && !socioUser.planName.includes('Gold')
                    ? `Desconto Sócio (${Math.round(socioDiscountRate * 100)}%):`
                    : `Desconto Sócio Gold (30%):`}
                </span>
                <span className="tabular-nums">- R$ {formatPrice(socioDiscountAmount)}</span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Total a Pagar:</span>
                <span className="text-base text-red-700 tabular-nums">
                  R$ {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Botão Finalizar Compra via WhatsApp com Nome, Número e Tamanho (Requested by user) */}
            <button
              type="button"
              onClick={handleCheckoutWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white text-white" />
              <span>Finalizar Pedido no WhatsApp</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pedido enviado diretamente ao atendimento oficial do Poeirão</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
