import React, { useState } from 'react';
import { X, Heart, Star, ShieldCheck, Truck, RefreshCw, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { Product, SocioUser } from '../types';
import { ProductRender } from './ProductRender';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity: number,
    customization?: { name: string; number: string }
  ) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  socioUser: SocioUser;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  socioUser,
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Padrão');
  const [quantity, setQuantity] = useState<number>(1);
  const [cep, setCep] = useState<string>('');
  const [shippingCalculated, setShippingCalculated] = useState<boolean>(false);
  
  // Customization for jerseys
  const [enableCustomization, setEnableCustomization] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customNumber, setCustomNumber] = useState<string>('10');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const memberDiscountRate = socioUser.isLoggedIn ? socioUser.discountRate : 0.30;
  const priceSocio = product.pricePix * (1 - memberDiscountRate);
  const customizationFee = enableCustomization ? 29.90 : 0;
  const currentTotal = (product.pricePix + customizationFee) * quantity;

  const formatPrice = (val: number) => {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleAdd = () => {
    const cust = enableCustomization && customName.trim()
      ? { name: customName.toUpperCase().trim(), number: customNumber || '10' }
      : undefined;

    onAddToCart(product, selectedSize, selectedColor, quantity, cust);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 700);
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.length >= 8) {
      setShippingCalculated(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Showcase Gallery (Nike clean background style) */}
        <div className="md:w-1/2 bg-[#f5f5f5] p-6 sm:p-10 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-neutral-200">
            <ProductRender
              type={product.visualType}
              customImageUrl={product.customImageUrl}
              className="max-h-72"
            />

          {/* Sócio Poeirão Seal */}
          <div className="mt-4 flex items-center gap-2 bg-white/90 border border-neutral-200 rounded-full px-3 py-1 shadow-xs">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider">
              Produto Oficial Licenciado Poeirão
            </span>
          </div>
        </div>

        {/* Right Side: Product Buy Module */}
        <div className="md:w-1/2 p-6 overflow-y-auto max-h-[85vh] flex flex-col space-y-4">
          
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-500">
                {product.department} · {product.categoryLabel}
              </span>
              <button
                onClick={() => onToggleFavorite(product.id)}
                className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-red-600 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600 text-red-600' : ''}`} />
                <span>{isFavorite ? 'Favoritado' : 'Salvar'}</span>
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-1 leading-tight">
              {product.name}
            </h2>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-neutral-900">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-neutral-900 text-neutral-900" />
                ))}
              </div>
              <span className="border border-neutral-300 text-neutral-700 text-xs font-bold px-1.5 py-0.5 rounded-xs">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-500">
                ({product.reviewsCount} avaliações de torcedores)
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-2xl font-extrabold text-neutral-900 tabular-nums">
                R$ {formatPrice(product.pricePix)}
              </span>
              <span className="text-xs font-bold text-neutral-700">no Pix</span>

              {product.priceOriginal > product.pricePix && (
                <>
                  <span className="text-sm text-neutral-400 line-through tabular-nums">
                    R$ {formatPrice(product.priceOriginal)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {product.discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              ou em até 10x de R$ {formatPrice((product.pricePix * 1.05) / 10)} sem juros no cartão
            </p>

            {/* Sócio Torcedor Price Highlight */}
            <div className="mt-2.5 pt-2.5 border-t border-neutral-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-red-700 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                <span>
                  {socioUser.isLoggedIn && socioUser.planName && !socioUser.planName.includes('Gold')
                    ? `Preço Sócio (${Math.round(socioUser.discountRate * 100)}%):`
                    : `Desconto Sócio Gold (30%):`}
                </span>
              </div>
              <span className="font-extrabold text-sm text-red-700 tabular-nums">
                R$ {formatPrice(priceSocio)} no Pix
              </span>
            </div>
            {!socioUser.isLoggedIn && (
              <p className="text-[11px] text-neutral-500 mt-1 italic">
                *Desconto Sócio Gold (30%) aplicado automaticamente após login na sua área.
              </p>
            )}
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Selecione o Tamanho:
              </label>
              <span className="text-xs text-neutral-500 underline cursor-pointer hover:text-neutral-900">
                Guia de Medidas
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-center text-xs font-bold rounded border transition-all ${
                    selectedSize === size
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          {product.colors.length > 1 && (
            <div>
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide block mb-1.5">
                Variação / Cor:
              </label>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                      selectedColor === color
                        ? 'border-neutral-900 bg-neutral-100 text-neutral-900 font-bold'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Jersey Customization (Name & Number) */}
          {product.isJersey && (
            <div className="p-3 bg-red-50/60 border border-red-200 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableCustomization}
                  onChange={(e) => setEnableCustomization(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-neutral-900">
                  Personalizar com Nome e Número (+ R$ 29,90)
                </span>
              </label>

              {enableCustomization && (
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-red-200/80">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-600 block mb-0.5">
                      Nome na Camisa:
                    </span>
                    <input
                      type="text"
                      maxLength={14}
                      placeholder="Ex: ROGÉRIO"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                      className="w-full text-xs p-1.5 border border-neutral-300 rounded uppercase font-bold focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-600 block mb-0.5">
                      Número:
                    </span>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="Ex: 10"
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value)}
                      className="w-full text-xs p-1.5 border border-neutral-300 rounded font-bold focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity & Add to Bag CTA */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex items-center border border-neutral-300 rounded">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
              >
                -
              </button>
              <span className="px-3 py-2.5 text-sm font-bold text-neutral-900 tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-bold text-white transition-all shadow-md active:scale-98 ${
                addedSuccess
                  ? 'bg-emerald-600'
                  : 'bg-[#b91c1c] hover:bg-[#991b1b]'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Adicionado à Sacola!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Adicionar à Sacola · R$ {formatPrice(currentTotal)}</span>
                </>
              )}
            </button>
          </div>

          {/* Payment & Order Info */}
          <div className="pt-3 border-t border-neutral-200">
            <div className="p-3 bg-neutral-100 rounded-lg flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800">Formas de Pagamento:</span>
              <div className="flex gap-1.5 font-bold text-neutral-900">
                <span className="bg-white px-2 py-0.5 rounded border border-neutral-300">PIX</span>
                <span className="bg-white px-2 py-0.5 rounded border border-neutral-300">CARTÃO</span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-neutral-600 text-center">
            <div className="flex flex-col items-center gap-1 bg-neutral-50 p-2 rounded">
              <ShieldCheck className="w-4 h-4 text-neutral-800" />
              <span>Garantia Oficial do Clube</span>
            </div>
            <div className="flex flex-col items-center gap-1 bg-neutral-50 p-2 rounded">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>Desconto Sócio Gold (30%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
