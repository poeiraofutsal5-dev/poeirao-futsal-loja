import React, { useState } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';
import { Product, SocioUser } from '../types';
import { ProductRender } from './ProductRender';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  socioUser: SocioUser;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  socioUser,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Sócio Poeirão: Desconto Sócio Gold (30%)
  const memberDiscountRate = socioUser.isLoggedIn ? socioUser.discountRate : 0.30;
  const priceSocio = product.pricePix * (1 - memberDiscountRate);

  const formatPrice = (val: number) => {
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div
      className="group flex flex-col bg-transparent cursor-pointer select-none transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectProduct(product)}
    >
      {/* 1. Image Container (Exact clean background style of Image 2) */}
      <div className="relative w-full aspect-square bg-[#f5f5f5] rounded-xs overflow-hidden flex items-center justify-center p-6 border border-neutral-100/60">
        
        {/* Floating Heart Button (Top Right as in Image 2) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          aria-label="Adicionar aos favoritos"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-xs border border-neutral-200/80 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-600 text-red-600' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Product SVG/Graphic Render or Custom Image */}
        <div className="w-full h-full flex items-center justify-center">
          <ProductRender
            type={product.visualType}
            customImageUrl={product.customImageUrl}
            isHovered={isHovered}
          />
        </div>
      </div>

      {/* 2. Product Details (Faithful to Image 2 typography and spacing) */}
      <div className="pt-3 pb-1 flex flex-col">
        {/* Product Title (Bold clean sans-serif) */}
        <h3 className="font-bold text-neutral-900 text-sm sm:text-[15px] leading-snug line-clamp-1 group-hover:text-red-700 transition-colors">
          {product.name}
        </h3>


        {/* Price Row: "R$ 229,99 no Pix   R$ 449,99   49% off" (as in Image 2) */}
        <div className="flex items-baseline flex-wrap gap-x-2 mt-2">
          <span className="font-bold text-neutral-900 text-sm sm:text-[15px] tabular-nums">
            R$ {formatPrice(product.pricePix)} no Pix
          </span>

          {product.priceOriginal > product.pricePix && (
            <>
              <span className="text-xs text-neutral-400 line-through tabular-nums">
                R$ {formatPrice(product.priceOriginal)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 tabular-nums">
                {product.discountPercent}% off
              </span>
            </>
          )}
        </div>

        {/* Star Rating & Numerical Box (as in Image 2: 5 stars + [4.3]) */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center text-neutral-900">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900"
              />
            ))}
          </div>
          {/* Rating number in neat bordered rectangle (identical to image 2) */}
          <span className="border border-neutral-300 text-neutral-700 text-[10px] font-semibold px-1 py-0.2 rounded-xs tabular-nums">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Desconto Sócio Gold (30%) */}
        <p className="text-[11px] font-semibold text-red-700 mt-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-red-600 shrink-0" />
          <span>
            {socioUser.isLoggedIn && socioUser.planName && !socioUser.planName.includes('Gold')
              ? `Desconto Sócio (${Math.round(socioUser.discountRate * 100)}%): R$ ${formatPrice(priceSocio)}`
              : `Desconto Sócio Gold (30%): R$ ${formatPrice(priceSocio)}`}
          </span>
        </p>
      </div>
    </div>
  );
};
