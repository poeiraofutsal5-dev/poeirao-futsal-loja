export type ProductCategory = 
  | 'todos'
  | 'camisas-oficiais'
  | 'uniforme-viagem'
  | 'regatas'
  | 'calcados'
  | 'acessorios';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  department: 'Futebol' | 'Skateboarding' | 'Corrida' | 'Casual' | 'Treino' | 'Acessórios' | 'Viagem';
  pricePix: number;
  priceOriginal: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  couponCode?: string;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity?: number;
  customImageUrl?: string;
  isJersey?: boolean;
  visualType: 'jersey_home' | 'jersey_away' | 'jersey_black' | 'jacket_travel' | 'hoodie_travel' | 'tank_heritage' | 'tank_dryfit' | 'shoe_sb' | 'shoe_runner' | 'slide_victori' | 'cap_trucker' | 'backpack';
  features: string[];
}

export type LogoId = 'logo_1' | 'logo_2' | 'logo_3' | 'logo_4' | 'logo_5' | 'logo_custom';

export interface LogoConfig {
  activeLogoId: LogoId;
  customLogoUrl?: string;
  clubName: string;
}

export interface HeroSlide {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  customization?: {
    name: string;
    number: string;
  };
}

export interface SocioUser {
  isLoggedIn: boolean;
  name: string;
  cpf: string;
  planName: string | null;
  discountRate: number; // 0.10 to 0.35 (10% a 30%+)
  cardNumber?: string;
}

export interface DesignerConfig {
  designerName: string;
  role: string;
  logoUrl?: string;
  portfolioUrl?: string;
  showInHeader: boolean;
  showInFooter: boolean;
}

