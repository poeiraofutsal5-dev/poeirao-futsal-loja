/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SocioModal } from './components/SocioModal';
import { InfoModal } from './components/InfoModals';
import { DirectionPanelModal } from './components/DirectionPanelModal';
import { PRODUCTS, CATEGORIES_DATA } from './data/products';
import { Product, ProductCategory, CartItem, SocioUser, LogoConfig, HeroSlide, DesignerConfig } from './types';
import { db, auth, CONTENT_COLLECTION, CONTENT_DOC_ID, CONTENT_FIELD } from './lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  ChevronRight, 
  SlidersHorizontal,
  Heart,
  Search,
  Camera
} from 'lucide-react';

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide_1',
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
    title: 'Estádio Iluminado · Noite de Decisão',
    subtitle: 'Caldeirão Rubro-Negro do Poeirão',
  },
  {
    id: 'slide_2',
    url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1600&q=80',
    title: 'A Maior Torcida do Poeirão em Festa',
    subtitle: 'Paixão Rubro-Negra nas Arquibancadas',
  },
  {
    id: 'slide_3',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
    title: 'Manto Sagrado Rubro-Negro em Campo',
    subtitle: 'Tradição e Glória em Cada Partida',
  },
  {
    id: 'slide_4',
    url: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1600&q=80',
    title: 'Garra, Raça e Tradição Poeirão 2026/27',
    subtitle: 'Rumo ao Pentacampeonato',
  },
];

export default function App() {
  // Dynamic Logo Configuration (Saved in localStorage)
  const [logoConfig, setLogoConfig] = useState<LogoConfig>(() => {
    try {
      const saved = localStorage.getItem('poeirao_logo_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      activeLogoId: 'logo_1',
      clubName: 'POEIRÃO',
    };
  });

  const handleUpdateLogoConfig = async (newConfig: LogoConfig) => {
    setLogoConfig(newConfig);
    try {
      localStorage.setItem('poeirao_logo_config', JSON.stringify(newConfig));
    } catch (e) {}

    try {
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      await setDoc(docRef, { logoConfig: newConfig, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Erro ao salvar logoConfig no Firestore:', e);
    }
  };

  // Designer Credits & Logo State (Configurable in Cadeado, saved in localStorage & Firestore)
  const [designerConfig, setDesignerConfig] = useState<DesignerConfig>(() => {
    try {
      const saved = localStorage.getItem('poeirao_designer_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      designerName: 'João Paulo',
      role: 'Design & Identidade Visual',
      logoUrl: undefined,
      portfolioUrl: '',
      showInHeader: true,
      showInFooter: true,
    };
  });

  const handleUpdateDesignerConfig = async (newConfig: DesignerConfig) => {
    setDesignerConfig(newConfig);
    try {
      localStorage.setItem('poeirao_designer_config', JSON.stringify(newConfig));
    } catch (e) {}

    // Persist to Firestore as well so it syncs across devices
    try {
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      await setDoc(docRef, { designerConfig: newConfig, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Persistência local do designer:', e);
    }
  };


  // Dynamic Products List (Editable by direction, synchronized to Firestore)
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('poeirao_custom_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return PRODUCTS;
  });

  const handleUpdateProducts = async (newProducts: Product[]) => {
    setProductsList(newProducts);
    try {
      localStorage.setItem('poeirao_custom_products', JSON.stringify(newProducts));
    } catch (e) {}

    try {
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      await setDoc(docRef, { products: newProducts, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Erro ao salvar produtos no Firestore:', e);
    }
  };

  const handleResetProducts = async () => {
    setProductsList(PRODUCTS);
    try {
      localStorage.removeItem('poeirao_custom_products');
    } catch (e) {}

    try {
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      await setDoc(docRef, { products: PRODUCTS, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Erro ao resetar produtos no Firestore:', e);
    }
  };

  // Dynamic Hero Slides (Editable by direction in Cadeado, synchronized to Firestore)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem('poeirao_hero_slides');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_HERO_SLIDES;
  });

  const handleUpdateHeroSlides = async (newSlides: HeroSlide[]) => {
    setHeroSlides(newSlides);
    try {
      localStorage.setItem('poeirao_hero_slides', JSON.stringify(newSlides));
    } catch (e) {}

    try {
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      await setDoc(docRef, { heroSlides: newSlides, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Erro ao salvar heroSlides no Firestore:', e);
    }
  };

  const handleResetHeroSlides = async () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    try {
      localStorage.removeItem('poeirao_hero_slides');
    } catch (e) {}

    try {
      const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
      await setDoc(docRef, { heroSlides: DEFAULT_HERO_SLIDES, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Erro ao resetar heroSlides no Firestore:', e);
    }
  };

  // Handler to sync everything in one call to Firestore
  const handleSyncAllToFirestore = async () => {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
    await setDoc(
      docRef,
      {
        [CONTENT_FIELD]: heroHighlightedText,
        logoConfig,
        designerConfig,
        products: productsList,
        heroSlides,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  };

  // Direction Panel State (Password 22232425)
  const [isDirectionModalOpen, setIsDirectionModalOpen] = useState(false);
  const [isDirectionUnlocked, setIsDirectionUnlocked] = useState(false);
  const [directionPanelTab, setDirectionPanelTab] = useState<'texto' | 'logos' | 'produtos' | 'banner' | 'designer'>('banner');

  // Category & Filter state
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating'>('featured');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');

  // Hero Team Background Slide Carousel (Imagens do time passando)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['tenis-sb-chron-2', 'camisa-oficial-1-2026']);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [socioModalMode, setSocioModalMode] = useState<'recovery' | 'plans' | 'login' | null>(null);
  const [infoModalType, setInfoModalType] = useState<'planos' | 'parceiros' | 'sua-area' | 'historia' | 'duvidas' | 'fale-conosco' | null>(null);

  // Dynamic Hero Highlighted Text from Firestore (Coleção: conteudo, Doc: 9FiYJYD9FENDXNNfQ7Z0, Campo: texto)
  const [heroHighlightedText, setHeroHighlightedText] = useState<string>(() => {
    return localStorage.getItem('poeirao_firestore_texto') || 'VISTA A TRADIÇÃO DO POEIRÃO COM ORGULHO';
  });

  // Real-time listener for Firestore document: syncs the ENTIRE site across all devices
  useEffect(() => {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data) {
            // 1. Text in Highlight (Coleção: conteudo, Doc: 9FiYJYD9FENDXNNfQ7Z0, Campo: texto)
            if (typeof data[CONTENT_FIELD] === 'string' && data[CONTENT_FIELD].trim()) {
              const remoteText = data[CONTENT_FIELD].trim();
              setHeroHighlightedText(remoteText);
              localStorage.setItem('poeirao_firestore_texto', remoteText);
            }

            // 2. Products List (Syncs entire catalog across all devices)
            if (Array.isArray(data.products) && data.products.length > 0) {
              setProductsList(data.products);
              try {
                localStorage.setItem('poeirao_custom_products', JSON.stringify(data.products));
              } catch (e) {}
            } else {
              // If Firestore doesn't have products yet, check if this device has custom edits to publish
              const localProducts = localStorage.getItem('poeirao_custom_products');
              if (localProducts) {
                try {
                  const parsed = JSON.parse(localProducts);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    setDoc(docRef, { products: parsed, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.warn);
                  }
                } catch (e) {}
              }
            }

            // 3. Hero Banner Slides (Syncs banner slides across all devices)
            if (Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
              setHeroSlides(data.heroSlides);
              try {
                localStorage.setItem('poeirao_hero_slides', JSON.stringify(data.heroSlides));
              } catch (e) {}
            } else {
              const localSlides = localStorage.getItem('poeirao_hero_slides');
              if (localSlides) {
                try {
                  const parsed = JSON.parse(localSlides);
                  if (Array.isArray(parsed) && parsed.length > 0) {
                    setDoc(docRef, { heroSlides: parsed, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.warn);
                  }
                } catch (e) {}
              }
            }

            // 4. Logo Configuration (Syncs preset/custom logo across all devices)
            if (data.logoConfig && typeof data.logoConfig === 'object') {
              setLogoConfig(data.logoConfig);
              try {
                localStorage.setItem('poeirao_logo_config', JSON.stringify(data.logoConfig));
              } catch (e) {}
            } else {
              const localLogo = localStorage.getItem('poeirao_logo_config');
              if (localLogo) {
                try {
                  const parsed = JSON.parse(localLogo);
                  if (parsed && parsed.activeLogoId) {
                    setDoc(docRef, { logoConfig: parsed, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.warn);
                  }
                } catch (e) {}
              }
            }

            // 5. Designer Configuration (Syncs credits, name & designer logo across all devices)
            if (data.designerConfig && typeof data.designerConfig === 'object') {
              setDesignerConfig(data.designerConfig);
              try {
                localStorage.setItem('poeirao_designer_config', JSON.stringify(data.designerConfig));
              } catch (e) {}
            } else {
              const localDesigner = localStorage.getItem('poeirao_designer_config');
              if (localDesigner) {
                try {
                  const parsed = JSON.parse(localDesigner);
                  if (parsed && parsed.designerName) {
                    setDoc(docRef, { designerConfig: parsed, updatedAt: new Date().toISOString() }, { merge: true }).catch(console.warn);
                  }
                } catch (e) {}
              }
            }
          }
        } else {
          // Document does not exist yet: publish complete state to Firestore
          const initialPayload: Record<string, any> = {
            [CONTENT_FIELD]: heroHighlightedText,
            logoConfig,
            designerConfig,
            products: productsList,
            heroSlides,
            updatedAt: new Date().toISOString(),
          };
          setDoc(docRef, initialPayload, { merge: true }).catch(console.warn);
        }
      },
      (error) => {
        console.warn('Aviso: escutando Firestore em tempo real:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Handler to save text to Firestore
  const handleSaveFirestoreText = async (newText: string) => {
    const docRef = doc(db, CONTENT_COLLECTION, CONTENT_DOC_ID);
    await setDoc(
      docRef,
      {
        [CONTENT_FIELD]: newText.trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser?.email || 'admin@poeirao.com.br'
      },
      { merge: true }
    );
    setHeroHighlightedText(newText.trim());
    localStorage.setItem('poeirao_firestore_texto', newText.trim());
  };

  // Member user state (Sócio Poeirão)
  const [socioUser, setSocioUser] = useState<SocioUser>({
    isLoggedIn: false,
    name: 'Carlos Roberto',
    cpf: '456.789.012-34',
    planName: 'Plano Ouro (Sócio Gold)',
    discountRate: 0.30,
  });

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity: number,
    customization?: { name: string; number: string }
  ) => {
    const newItemId = `${product.id}-${selectedSize}-${selectedColor}-${customization ? customization.name + customization.number : 'std'}-${Date.now()}`;
    const newItem: CartItem = {
      id: newItemId,
      product,
      selectedSize,
      selectedColor,
      quantity,
      customization,
    };
    setCartItems((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  // Update cart item quantity
  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
      );
    }
  };

  // Remove from cart
  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Update item customization (Name & Number)
  const handleUpdateCartCustomization = (cartItemId: string, name: string, number: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? {
              ...item,
              customization: name ? { name, number: number || '10' } : undefined,
            }
          : item
      )
    );
  };

  // Filtered & sorted products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      // Favorites filter
      if (showOnlyFavorites && !favoriteIds.includes(item.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'todos' && item.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.categoryLabel.toLowerCase().includes(query);
        const matchesDept = item.department.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDept) {
          return false;
        }
      }

      // Size filter
      if (selectedSizeFilter !== 'all') {
        if (!item.sizes.includes(selectedSizeFilter)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePix - b.pricePix;
      if (sortBy === 'price-desc') return b.pricePix - a.pricePix;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured order
    });
  }, [productsList, selectedCategory, searchQuery, sortBy, selectedSizeFilter, showOnlyFavorites, favoriteIds]);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 flex flex-col font-sans">
      {/* 1. Header (Replicating Image 1: red banner, shield logo with 4 stars, action buttons, sub-nav) */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLoginModal={() => setSocioModalMode('login')}
        onOpenInfoModal={(type) => setInfoModalType(type)}
        onOpenDirectionPanel={() => {
          setDirectionPanelTab('texto');
          setIsDirectionModalOpen(true);
        }}
        socioUser={socioUser}
        onLogoutSocio={() => setSocioUser({ isLoggedIn: false, name: '', cpf: '', planName: null, discountRate: 0.30 })}
        logoConfig={logoConfig}
        designerConfig={designerConfig}
      />

      {/* 2. Top Promotional Ticker Strip */}
      <div className="bg-neutral-900 text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap text-center no-scrollbar">
          <div className="flex items-center gap-2 mx-auto">
            <span className="text-[#facc15] font-bold">★ SÓCIO POEIRÃO:</span>
            <span className="text-neutral-300">
              Desconto Sócio Gold (30%) em toda a loja oficial!
            </span>
            <span className="text-emerald-400 font-bold ml-1">· Pagamento via PIX e CARTÃO</span>
            <a
              href="https://sitepoeirao.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline font-bold text-yellow-400 hover:text-white"
            >
              Seja Sócio Aqui →
            </a>
          </div>
          {socioUser.isLoggedIn && (
            <span className="hidden md:inline text-xs text-yellow-400 font-semibold shrink-0">
              ✓ Desconto Sócio Gold (30%) Ativo
            </span>
          )}
        </div>
      </div>

      {/* 3. Hero Campaign Showcase - Altura ampliada e frase destacada conforme solicitado (imagem 1) */}
      <section className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800 text-white min-h-[210px] sm:min-h-[340px] lg:min-h-[400px] flex items-center">
        {/* Botão Direto para Trocar/Editar Fotos de Fundo do Banner */}
        <button
          type="button"
          onClick={() => {
            setDirectionPanelTab('banner');
            setIsDirectionModalOpen(true);
          }}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/70 hover:bg-black text-yellow-300 hover:text-yellow-200 border border-yellow-400/60 hover:border-yellow-400 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          title="Clique para trocar ou editar as fotos de fundo do site"
        >
          <Camera className="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-12 transition-transform" />
          <span>Trocar Fotos de Fundo</span>
        </button>

        {/* Dynamic Background Slides Carousel (Imagens do time passando de fundo) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {heroSlides.map((slide, idx) => {
            const isSlideActive = idx === (heroSlides.length > 0 ? (currentSlideIndex % heroSlides.length) : 0);
            return (
              <div
                key={slide.id || slide.url}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isSlideActive
                    ? 'opacity-100 scale-105 transition-transform duration-[6000ms]'
                    : 'opacity-0 scale-100'
                }`}
              >
                <img
                  src={slide.url}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125"
                />
              </div>
            );
          })}

          {/* Dark Gradients for contrast and crisp readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-16 w-full">
          <div className="max-w-3xl space-y-2 sm:space-y-4">
            {/* Frase em destaque com FONTE AMARELA conectada ao Firestore em tempo real */}
            <h1 className="text-xl sm:text-4xl lg:text-5xl font-black text-yellow-400 tracking-tight leading-snug font-display drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              {heroHighlightedText}
            </h1>

            {/* Subtle Carousel Indicators */}
            {heroSlides.length > 1 && (
              <div className="flex items-center gap-1.5 sm:gap-2 pt-1 sm:pt-2">
                {heroSlides.map((slide, idx) => {
                  const activeIdx = currentSlideIndex % heroSlides.length;
                  return (
                    <button
                      key={slide.id || idx}
                      type="button"
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIdx ? 'w-6 sm:w-10 bg-yellow-400' : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Category Tabs */}
      <nav className="sticky top-[75px] sm:top-[102px] z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2.5 sm:gap-4 py-2 sm:py-2.5 overflow-x-auto no-scrollbar">
            
            {/* Category Segmented Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {CATEGORIES_DATA.map((cat) => {
                const isActive = selectedCategory === cat.id && !showOnlyFavorites;
                const count = productsList.filter((p) => cat.id === 'todos' || p.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setShowOnlyFavorites(false);
                    }}
                    className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 sm:gap-1.5 ${
                      isActive
                        ? 'bg-[#b91c1c] text-white shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-red-900 text-white' : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {/* Wishlist toggle */}
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 sm:gap-1.5 ${
                  showOnlyFavorites
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white' : ''}`} />
                <span>Favoritos ({favoriteIds.length})</span>
              </button>
            </div>

            {/* Sort & Quick Filter Selector */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-xs text-neutral-500 font-medium hidden sm:inline">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-[11px] sm:text-xs font-semibold bg-neutral-100 border border-neutral-300 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-red-600 cursor-pointer"
              >
                <option value="featured">Destaques</option>
                <option value="discount">Maior Desconto %</option>
                <option value="price-asc">Menor Preço no Pix</option>
                <option value="price-desc">Maior Preço no Pix</option>
                <option value="rating">Melhor Avaliação</option>
              </select>
            </div>

          </div>
        </div>
      </nav>

      {/* 5. Main Product Catalog Section (Cards based on Image 2) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
        
        {/* Results Count & Active Category Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 sm:mb-6 pb-2.5 sm:pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-base sm:text-2xl font-bold text-neutral-900 font-display">
              {showOnlyFavorites
                ? 'Meus Produtos Favoritos'
                : selectedCategory === 'todos'
                ? 'Todos os Artigos da Loja Poeirão'
                : CATEGORIES_DATA.find((c) => c.id === selectedCategory)?.label}
            </h2>
          </div>

          {/* Quick Size Filter chips */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap text-xs">
            <span className="text-neutral-500 font-semibold mr-0.5 sm:mr-1 text-[11px] sm:text-xs">Tamanhos:</span>
            {['all', 'P', 'M', 'G', 'GG'].map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSizeFilter(sz)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold transition-all ${
                  selectedSizeFilter === sz
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {sz === 'all' ? 'Todos' : sz}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid: 2 columns mobile (requested by user), 2 columns tablet, 3 columns desktop */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center bg-white rounded-xl border border-neutral-200 p-6 sm:p-8">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-neutral-300 mb-3" />
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">Nenhum produto encontrado</h3>
            <p className="text-xs text-neutral-500 max-w-sm mt-1">
              Tente redefinir a busca por outro termo ou mude os filtros de tamanho e categoria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
                setSelectedSizeFilter('all');
                setShowOnlyFavorites(false);
              }}
              className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
            >
              Limpar Filtros e Ver Tudo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favoriteIds.includes(product.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelectProduct={(p) => setSelectedProduct(p)}
                socioUser={socioUser}
              />
            ))}
          </div>
        )}
      </main>

      {/* 6. Club Benefits & Sócio Advantage Banner */}
      <section className="bg-neutral-100 border-t border-neutral-200 py-5 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white p-4 sm:p-7 rounded-2xl border border-neutral-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-600/20 border border-red-500/30 text-yellow-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-yellow-400 text-neutral-950 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Sócio Gold: 30% OFF
                  </span>
                  <h4 className="text-xs sm:text-base font-bold uppercase tracking-wide font-display text-white">
                    Desconto Sócio Gold (30%)
                  </h4>
                </div>
                <p className="text-[11px] sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                  Desconto Sócio Gold (30%) em toda a Loja Oficial para associados do Poeirão! Vista o manto com vantagens exclusivas.
                </p>
              </div>
            </div>
            <a
              href="https://sitepoeirao.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-5 py-2.5 sm:px-6 sm:py-3 bg-[#0080ff] hover:bg-[#006ce0] text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider transition-all whitespace-nowrap shrink-0 hover:scale-[1.02]"
            >
              Seja sócio e aproveite o desconto →
            </a>
          </div>
        </div>
      </section>

      {/* 7. Institutional Footer - Compacto e reduzido como solicitado (imagem 2) */}
      <footer className="bg-neutral-950 text-white border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            
            {/* Column 1: Brand & Identity */}
            <div className="col-span-2 md:col-span-1 space-y-1 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-4 h-5 sm:w-5 sm:h-6 bg-white rounded-b-md border border-black flex flex-col overflow-hidden shrink-0">
                  <div className="h-1/2 bg-[#dc2626] flex items-center justify-center">
                    <span className="text-[5px] sm:text-[6px] font-black text-white">PFC</span>
                  </div>
                  <div className="h-1/2 bg-black"></div>
                </div>
                <span className="text-sm sm:text-base font-extrabold tracking-wider font-display">
                  SÓCIO POEIRÃO
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 leading-tight">
                Loja Oficial do Sócio Poeirão · Produtos oficiais desenvolvidos para a torcida rubro-negra.
              </p>
              <div className="text-[9px] sm:text-[11px] text-neutral-500">
                Sede Oficial Poeirão · Estádio e Loja
              </div>
            </div>

            {/* Column 2: Categorias da Loja */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider mb-1 sm:mb-2">Departamentos</h4>
              <ul className="space-y-0.5 sm:space-y-1.5 text-[10px] sm:text-xs text-neutral-400">
                <li>
                  <button onClick={() => setSelectedCategory('camisas-oficiais')} className="hover:text-white">
                    Camisas Oficiais
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('uniforme-viagem')} className="hover:text-white">
                    Agasalhos e Viagem
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('regatas')} className="hover:text-white">
                    Regatas de Treino
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('calcados')} className="hover:text-white">
                    Tênis e Calçados
                  </button>
                </li>
                <li>
                  <button onClick={() => setSelectedCategory('acessorios')} className="hover:text-white">
                    Bonés e Mochilas
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Atendimento & Ajuda */}
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider mb-1 sm:mb-2">Ajuda & Suporte</h4>
              <ul className="space-y-0.5 sm:space-y-1.5 text-[10px] sm:text-xs text-neutral-400">
                <li>
                  <button onClick={() => setInfoModalType('fale-conosco')} className="hover:text-white">
                    Central de Atendimento
                  </button>
                </li>
                <li>
                  <button onClick={() => setInfoModalType('duvidas')} className="hover:text-white">
                    Dúvidas Frequentes (FAQ)
                  </button>
                </li>
                <li>
                  <button onClick={() => setSocioModalMode('recovery')} className="hover:text-white">
                    Recuperação de Acesso
                  </button>
                </li>
                <li>
                  <button onClick={() => setInfoModalType('planos')} className="hover:text-white">
                    Planos de Sócio
                  </button>
                </li>
                <li>
                  <button onClick={() => setInfoModalType('historia')} className="hover:text-white">
                    História das 4 Estrelas
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Pagamento & Segurança */}
            <div className="col-span-2 md:col-span-1 space-y-1 sm:space-y-2">
              <h4 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">Formas de Pagamento</h4>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 text-neutral-300 text-[10px] sm:text-xs">
                <span className="bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded font-bold text-emerald-400">
                  PIX Instantâneo
                </span>
                <span className="bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded font-medium">
                  Visa
                </span>
                <span className="bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded font-medium">
                  Mastercard
                </span>
                <span className="bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded font-medium">
                  Elo
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-neutral-500 pt-0.5 leading-tight">
                Ambiente seguro com criptografia de ponta a ponta.
              </p>
            </div>

          </div>

          <div className="mt-3 pt-3 sm:mt-6 sm:pt-6 border-t border-neutral-800/80 text-center text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <span className="text-[10px] sm:text-xs">© 2026 Loja Oficial Sócio Poeirão. Orgulho da Nação.</span>

            {/* Design & Identidade Visual Credits (João Paulo / Logo configurável no Cadeado) */}
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-inner">
              {designerConfig.logoUrl ? (
                <img
                  src={designerConfig.logoUrl}
                  alt={designerConfig.designerName}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain rounded-full bg-white/10 p-0.5 border border-yellow-400/60 shrink-0"
                />
              ) : (
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-yellow-400 text-neutral-950 font-black text-[7px] sm:text-[8px] flex items-center justify-center shrink-0">
                  JP
                </span>
              )}
              <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                <span className="text-neutral-400">Design por</span>
                {designerConfig.portfolioUrl ? (
                  <a
                    href={designerConfig.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-white hover:text-yellow-400 underline decoration-yellow-400/50 underline-offset-2 transition-colors"
                  >
                    {designerConfig.designerName || 'João Paulo'}
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setDirectionPanelTab('designer');
                      setIsDirectionModalOpen(true);
                    }}
                    className="font-bold text-white hover:text-yellow-400 transition-colors cursor-pointer"
                    title="Editar informações e logo do Design no Cadeado"
                  >
                    {designerConfig.designerName || 'João Paulo'}
                  </button>
                )}
                <span className="text-neutral-600">·</span>
                <span className="text-[9px] sm:text-[10px] text-yellow-400/90 font-medium">
                  {designerConfig.role || 'Design & Identidade Visual'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Modals & Drawers --- */}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isFavorite={selectedProduct ? favoriteIds.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        socioUser={socioUser}
      />

      {/* Cart Drawer Slide-over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onUpdateCustomization={handleUpdateCartCustomization}
        socioUser={socioUser}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        socioUser={socioUser}
        onClearCart={() => setCartItems([])}
      />

      {/* Sócio Actions Modal (Recuperar Senha, Quero Me Associar, Entrar) */}
      <SocioModal
        mode={socioModalMode}
        isOpen={Boolean(socioModalMode)}
        onClose={() => setSocioModalMode(null)}
        onLoginSocio={(user) => setSocioUser(user)}
      />

      {/* Header Sub-Navigation Info Modal */}
      <InfoModal
        type={infoModalType}
        isOpen={Boolean(infoModalType)}
        onClose={() => setInfoModalType(null)}
      />

      {/* Direction Panel Modal (Password: 22232425) */}
      <DirectionPanelModal
        isOpen={isDirectionModalOpen}
        onClose={() => setIsDirectionModalOpen(false)}
        isUnlocked={isDirectionUnlocked}
        onUnlock={() => setIsDirectionUnlocked(true)}
        onLock={() => setIsDirectionUnlocked(false)}
        initialTab={directionPanelTab}
        logoConfig={logoConfig}
        onUpdateLogoConfig={handleUpdateLogoConfig}
        designerConfig={designerConfig}
        onUpdateDesignerConfig={handleUpdateDesignerConfig}
        products={productsList}
        onUpdateProducts={handleUpdateProducts}
        onResetProducts={handleResetProducts}
        heroSlides={heroSlides}
        onUpdateHeroSlides={handleUpdateHeroSlides}
        onResetHeroSlides={handleResetHeroSlides}
        firestoreText={heroHighlightedText}
        onSaveFirestoreText={handleSaveFirestoreText}
        onSyncAllToFirestore={handleSyncAllToFirestore}
      />
    </div>
  );
}
