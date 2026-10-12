import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Unlock, 
  Check, 
  Upload, 
  Image as ImageIcon, 
  Edit3, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Cloud,
  CloudUpload,
  Mail,
  Key,
  Database,
  CheckCircle2,
  RefreshCw,
  Palette,
  ExternalLink,
  Shield
} from 'lucide-react';
import { Product, ProductCategory, LogoConfig, LogoId, HeroSlide, DesignerConfig } from '../types';
import { ClubLogo } from './ClubLogo';
import { ProductRender } from './ProductRender';
import { auth, CONTENT_COLLECTION, CONTENT_DOC_ID, CONTENT_FIELD } from '../lib/firebase';
import { compressImage } from '../lib/imageUtils';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User 
} from 'firebase/auth';

interface DirectionPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  isUnlocked: boolean;
  onUnlock: () => void;
  onLock: () => void;
  logoConfig: LogoConfig;
  onUpdateLogoConfig: (config: LogoConfig) => void;
  designerConfig: DesignerConfig;
  onUpdateDesignerConfig: (config: DesignerConfig) => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onResetProducts: () => void;
  heroSlides: HeroSlide[];
  onUpdateHeroSlides: (slides: HeroSlide[]) => void;
  onResetHeroSlides: () => void;
  firestoreText: string;
  onSaveFirestoreText: (newText: string) => Promise<void>;
  onSyncAllToFirestore?: () => Promise<void>;
}

export const DirectionPanelModal: React.FC<DirectionPanelModalProps> = ({
  isOpen,
  onClose,
  isUnlocked,
  onUnlock,
  onLock,
  logoConfig,
  onUpdateLogoConfig,
  designerConfig,
  onUpdateDesignerConfig,
  products,
  onUpdateProducts,
  onResetProducts,
  heroSlides,
  onUpdateHeroSlides,
  onResetHeroSlides,
  firestoreText,
  onSaveFirestoreText,
  onSyncAllToFirestore,
}) => {
  if (!isOpen) return null;

  // Firebase Auth state
  const [currentAuthUser, setCurrentAuthUser] = useState<User | null>(auth.currentUser);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Firestore Text edit state
  const [firestoreTextInput, setFirestoreTextInput] = useState(firestoreText);
  const [isSavingFirestore, setIsSavingFirestore] = useState(false);
  const [saveSuccessFirestore, setSaveSuccessFirestore] = useState(false);

  // Active Tab: 'texto' (Firestore), 'logos', 'produtos', 'banner', 'designer'
  const [activeTab, setActiveTab] = useState<'texto' | 'logos' | 'produtos' | 'banner' | 'designer'>('texto');

  // Designer logo & credits state
  const [designerNameInput, setDesignerNameInput] = useState(designerConfig?.designerName || 'João Paulo');
  const [designerRoleInput, setDesignerRoleInput] = useState(designerConfig?.role || 'Design & Identidade Visual');
  const [designerLogoUrlInput, setDesignerLogoUrlInput] = useState(designerConfig?.logoUrl || '');
  const [designerPortfolioInput, setDesignerPortfolioInput] = useState(designerConfig?.portfolioUrl || '');

  // Keep state synced when designerConfig prop updates
  useEffect(() => {
    if (designerConfig) {
      setDesignerNameInput(designerConfig.designerName || 'João Paulo');
      setDesignerRoleInput(designerConfig.role || 'Design & Identidade Visual');
      setDesignerLogoUrlInput(designerConfig.logoUrl || '');
      setDesignerPortfolioInput(designerConfig.portfolioUrl || '');
    }
  }, [designerConfig]);


  // Emergency PIN state
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Sync firestore text input when prop changes externally
  useEffect(() => {
    setFirestoreTextInput(firestoreText);
  }, [firestoreText]);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentAuthUser(user);
      if (user) {
        onUnlock();
      }
    });
    return () => unsubscribe();
  }, [onUnlock]);

  // Hero Slide Management State
  const [slideUrlInput, setSlideUrlInput] = useState('');
  const [slideTitleInput, setSlideTitleInput] = useState('');
  const [slideSubtitleInput, setSlideSubtitleInput] = useState('');
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);
  const [showResetSlidesConfirm, setShowResetSlidesConfirm] = useState(false);

  // Custom logo input
  const [customUrlInput, setCustomUrlInput] = useState(logoConfig.customLogoUrl || '');

  // Editing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form fields for product editing
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('camisas-oficiais');
  const [formCategoryLabel, setFormCategoryLabel] = useState('');
  const [formDepartment, setFormDepartment] = useState<Product['department']>('Futebol');
  const [formPricePix, setFormPricePix] = useState<number>(199.90);
  const [formPriceOriginal, setFormPriceOriginal] = useState<number>(299.90);
  const [formStock, setFormStock] = useState<number>(30);
  const [formInStock, setFormInStock] = useState<boolean>(true);
  const [formDescription, setFormDescription] = useState('');
  const [formCustomImage, setFormCustomImage] = useState('');
  const [formVisualType, setFormVisualType] = useState<Product['visualType']>('jersey_home');

  // Check password
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === '22232425') {
      setPasswordError(false);
      setPasswordInput('');
      onUnlock();
    } else {
      setPasswordError(true);
    }
  };

  // Firebase Auth Submit (Login, Register or Forgot)
  const handleFirebaseAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        const cred = await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        setCurrentAuthUser(cred.user);
        onUnlock();
        setToastMessage(`Autenticado no Firebase: ${cred.user.email}`);
        setTimeout(() => setToastMessage(null), 3000);
      } else if (authMode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        setCurrentAuthUser(cred.user);
        onUnlock();
        setToastMessage(`Conta criada com sucesso: ${cred.user.email}`);
        setTimeout(() => setToastMessage(null), 3000);
      } else if (authMode === 'forgot') {
        await sendPasswordResetEmail(auth, authEmail.trim());
        setAuthSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
      }
    } catch (err: any) {
      console.error('Erro no Firebase Auth:', err);
      let msg = 'Erro ao autenticar no Firebase Auth.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'E-mail ou senha inválidos. Caso ainda não tenha uma conta cadastrada no projeto, selecione "Criar Conta".';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já está cadastrado. Por favor, faça login com sua senha.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha precisa ter pelo menos 6 caracteres.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Por favor, informe um e-mail válido.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Muitas tentativas. Aguarde alguns instantes.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out from Firebase Auth
  const handleFirebaseSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentAuthUser(null);
      onLock();
      setToastMessage('Sessão encerrada com sucesso.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err);
    }
  };

  // Save text directly to Firestore
  const handleSaveFirestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestoreTextInput.trim()) {
      setToastMessage('O texto não pode ficar em branco.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSavingFirestore(true);
    setSaveSuccessFirestore(false);
    try {
      await onSaveFirestoreText(firestoreTextInput.trim());
      setSaveSuccessFirestore(true);
      setToastMessage('✓ Texto salvo no Firestore com sucesso! Atualizado em tempo real.');
      setTimeout(() => {
        setSaveSuccessFirestore(false);
        setToastMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error('Erro ao gravar no Firestore:', err);
      setToastMessage('Falha ao salvar no Firestore: ' + (err.message || 'Verifique sua conexão.'));
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSavingFirestore(false);
    }
  };

  // Sync all state
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  const handleSyncAllCloud = async () => {
    if (!onSyncAllToFirestore) return;
    setIsSyncingAll(true);
    try {
      await onSyncAllToFirestore();
      setToastMessage('✓ Todas as alterações foram salvas e sincronizadas no Firebase para todos os dispositivos!');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error('Erro ao sincronizar tudo:', err);
      setToastMessage('Erro ao sincronizar com Firebase: ' + (err.message || 'Tente novamente.'));
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Switch preset logo
  const handleSelectPresetLogo = (logoId: LogoId) => {
    onUpdateLogoConfig({
      ...logoConfig,
      activeLogoId: logoId,
    });
    setToastMessage('✓ Logo atualizada no Firebase para todos os dispositivos!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Upload custom logo from computer/phone (compressed for fast Firestore sync)
  const handleUploadCustomLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 0.8);
        if (compressed) {
          onUpdateLogoConfig({
            ...logoConfig,
            activeLogoId: 'logo_custom',
            customLogoUrl: compressed,
          });
          setCustomUrlInput(compressed);
          setToastMessage('✓ Nova logo salva no Firebase e sincronizada para todos os dispositivos!');
          setTimeout(() => setToastMessage(null), 3500);
        }
      } catch (err) {
        console.error('Erro ao comprimir logo:', err);
      }
    }
  };

  // Apply custom URL logo
  const handleApplyCustomUrlLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrlInput.trim()) {
      onUpdateLogoConfig({
        ...logoConfig,
        activeLogoId: 'logo_custom',
        customLogoUrl: customUrlInput.trim(),
      });
      setToastMessage('✓ Logo salva no Firebase e sincronizada para todos os dispositivos!');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Upload custom designer logo (compressed for fast Firestore sync)
  const handleUploadDesignerLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 500, 0.8);
        if (compressed) {
          const updated: DesignerConfig = {
            ...designerConfig,
            designerName: designerNameInput.trim() || 'João Paulo',
            role: designerRoleInput.trim() || 'Design & Identidade Visual',
            logoUrl: compressed,
            portfolioUrl: designerPortfolioInput.trim() || undefined,
            showInHeader: true,
            showInFooter: true,
          };
          onUpdateDesignerConfig(updated);
          setDesignerLogoUrlInput(compressed);
          setToastMessage('✓ Logo do Design salva no Firebase para todos os dispositivos!');
          setTimeout(() => setToastMessage(null), 3500);
        }
      } catch (err) {
        console.error('Erro ao comprimir logo do designer:', err);
      }
    }
  };

  // Apply designer form info (name, role, logo url, portfolio)
  const handleSaveDesignerConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DesignerConfig = {
      designerName: designerNameInput.trim() || 'João Paulo',
      role: designerRoleInput.trim() || 'Design & Identidade Visual',
      logoUrl: designerLogoUrlInput.trim() || undefined,
      portfolioUrl: designerPortfolioInput.trim() || undefined,
      showInHeader: true,
      showInFooter: true,
    };
    onUpdateDesignerConfig(updated);
    setToastMessage('✓ Informações e créditos do Design salvos no Firebase!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Remove designer logo
  const handleRemoveDesignerLogo = () => {
    const updated: DesignerConfig = {
      ...designerConfig,
      logoUrl: undefined,
    };
    onUpdateDesignerConfig(updated);
    setDesignerLogoUrlInput('');
    setToastMessage('Logo do designer redefinida.');
    setTimeout(() => setToastMessage(null), 3000);
  };


  // Open product for edit
  const handleOpenEditProduct = (prod: Product) => {
    setIsCreatingNew(false);
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormCategoryLabel(prod.categoryLabel);
    setFormDepartment(prod.department);
    setFormPricePix(prod.pricePix);
    setFormPriceOriginal(prod.priceOriginal);
    setFormStock(prod.stockQuantity ?? 25);
    setFormInStock(prod.inStock);
    setFormDescription(prod.description);
    setFormCustomImage(prod.customImageUrl || '');
    setFormVisualType(prod.visualType);
  };

  // Start new product
  const handleStartCreateProduct = () => {
    setIsCreatingNew(true);
    const newId = `produto-${Date.now()}`;
    const newProd: Product = {
      id: newId,
      name: 'Novo Artigo Poeirão',
      category: 'camisas-oficiais',
      categoryLabel: 'Torcedor Oficial',
      department: 'Futebol',
      pricePix: 199.90,
      priceOriginal: 299.90,
      discountPercent: 33,
      rating: 5.0,
      reviewsCount: 1,
      description: 'Descrição do novo produto oficial.',
      sizes: ['P', 'M', 'G', 'GG'],
      colors: ['Padrão'],
      inStock: true,
      stockQuantity: 30,
      visualType: 'none',
      features: ['Tecido Oficial de Alta Performance'],
    };
    setEditingProduct(newProd);
    setFormName(newProd.name);
    setFormCategory(newProd.category);
    setFormCategoryLabel(newProd.categoryLabel);
    setFormDepartment(newProd.department);
    setFormPricePix(newProd.pricePix);
    setFormPriceOriginal(newProd.priceOriginal);
    setFormStock(30);
    setFormInStock(true);
    setFormDescription(newProd.description);
    setFormCustomImage('');
    setFormVisualType('none');
  };

  // Upload product photo (compressed for fast Firestore sync)
  const handleUploadProductImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 800, 0.75);
        if (compressed) {
          setFormCustomImage(compressed);
        }
      } catch (err) {
        console.error('Erro ao comprimir imagem do produto:', err);
      }
    }
  };

  // Save product changes
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const discountCalculated = formPriceOriginal > formPricePix
      ? Math.round(((formPriceOriginal - formPricePix) / formPriceOriginal) * 100)
      : 0;

    const updated: Product = {
      ...editingProduct,
      name: formName.trim() || 'Produto sem nome',
      category: formCategory,
      categoryLabel: formCategoryLabel.trim() || 'Oficial',
      department: formDepartment,
      pricePix: Number(formPricePix) || 99.90,
      priceOriginal: Number(formPriceOriginal) || 149.90,
      discountPercent: discountCalculated,
      stockQuantity: Number(formStock) || 0,
      inStock: Number(formStock) > 0 && formInStock,
      description: formDescription.trim(),
      customImageUrl: formCustomImage.trim() || undefined,
      visualType: formVisualType,
    };

    if (isCreatingNew) {
      onUpdateProducts([updated, ...products]);
    } else {
      onUpdateProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    }

    setEditingProduct(null);
    setIsCreatingNew(false);
    setToastMessage('✓ Produto salvo no Firebase e atualizado em todos os dispositivos!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // In-UI Confirmation states (replaces window.confirm which is blocked in iframes)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete product with in-UI confirmation
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const removedName = productToDelete.name;
    onUpdateProducts(products.filter((p) => p.id !== productToDelete.id));
    if (editingProduct?.id === productToDelete.id) {
      setEditingProduct(null);
    }
    setProductToDelete(null);
    setToastMessage(`✓ "${removedName}" removido no Firebase para todos os dispositivos.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add new slide from URL or file
  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideUrlInput.trim()) return;
    const newSlide: HeroSlide = {
      id: `slide_${Date.now()}`,
      url: slideUrlInput.trim(),
      title: slideTitleInput.trim() || 'Foto do Poeirão',
      subtitle: slideSubtitleInput.trim() || 'Orgulho da Nação Rubro-Negra',
    };
    onUpdateHeroSlides([...heroSlides, newSlide]);
    setSlideUrlInput('');
    setSlideTitleInput('');
    setSlideSubtitleInput('');
    setToastMessage('✓ Nova foto adicionada no Firebase para todos os dispositivos!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUploadSlideFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 1000, 0.75);
        if (compressed) {
          const newSlide: HeroSlide = {
            id: `slide_up_${Date.now()}`,
            url: compressed,
            title: slideTitleInput.trim() || file.name.replace(/\.[^/.]+$/, ''),
            subtitle: slideSubtitleInput.trim() || 'Foto enviada pela Diretoria',
          };
          onUpdateHeroSlides([...heroSlides, newSlide]);
          setSlideTitleInput('');
          setSlideSubtitleInput('');
          setToastMessage('✓ Foto do time salva no Firebase para todos os dispositivos!');
          setTimeout(() => setToastMessage(null), 3500);
        }
      } catch (err) {
        console.error('Erro ao comprimir foto do banner:', err);
      }
    }
  };

  const handleConfirmDeleteSlide = () => {
    if (!slideToDelete) return;
    if (heroSlides.length <= 1) {
      setToastMessage('O banner precisa ter pelo menos 1 foto.');
      setTimeout(() => setToastMessage(null), 3000);
      setSlideToDelete(null);
      return;
    }
    onUpdateHeroSlides(heroSlides.filter((s) => s.id !== slideToDelete.id));
    setSlideToDelete(null);
    setToastMessage('Foto removida do banner.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
              {isUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-yellow-400" />}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-display tracking-wider flex items-center gap-2">
                <span>Área da Direção · Gerenciamento Oficial</span>
                <span className="text-[10px] bg-red-600/80 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  Firebase
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                {isUnlocked ? (
                  <span className="text-emerald-400 font-semibold">
                    ● Área desbloqueada para edição
                  </span>
                ) : (
                  'Acesso restrito · Digite o PIN de segurança'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                type="button"
                onClick={() => {
                  onLock();
                  setPasswordInput('');
                  setToastMessage('Sessão bloqueada.');
                  setTimeout(() => setToastMessage(null), 2000);
                }}
                className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg flex items-center gap-1.5 transition-colors border border-neutral-700 hover:border-red-500/50"
                title="Bloquear Acesso"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bloquear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- PIN AUTHENTICATION SCREEN --- */}
        {!isUnlocked ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-5 w-full my-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-600/20 border border-amber-500/30 text-amber-500 flex items-center justify-center mb-1 shadow-inner">
              <Lock className="w-8 h-8 text-amber-500" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-700 text-[11px] font-bold mb-2">
                <Shield className="w-3 h-3 text-red-600" />
                <span>Área Restrita da Direção</span>
              </div>
              <h4 className="text-xl font-bold text-neutral-900 font-display">
                Digite o PIN de Acesso
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Insira o código de segurança para liberar as configurações da loja e do banco de dados.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="w-full space-y-4 pt-1 text-left">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  PIN de Segurança
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    autoFocus
                    autoComplete="off"
                    placeholder="Digite o PIN..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(false);
                    }}
                    className={`w-full text-sm pl-9 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:outline-none tracking-widest text-center font-mono ${
                      passwordError
                        ? 'border-red-500 focus:border-red-600 focus:ring-red-200 bg-red-50/30'
                        : 'border-neutral-300 focus:border-red-600 focus:ring-red-100'
                    }`}
                  />
                </div>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="leading-snug">PIN incorreto. Tente novamente.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Unlock className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </button>
            </form>

            <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-100 w-full flex items-center justify-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-neutral-400" />
              <span>Conexão ativa com Cloud Firestore</span>
            </div>
          </div>
        ) : (
          /* --- UNLOCKED MANAGEMENT DASHBOARD --- */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab navigation */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-neutral-200 bg-neutral-50 px-4 sm:px-6 pt-3 gap-2">
              <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => {
                    setActiveTab('texto');
                    setEditingProduct(null);
                  }}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'texto'
                      ? 'border-red-600 text-red-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Cloud className="w-4 h-4 text-amber-500" />
                  <span>Texto (Firestore)</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('logos');
                    setEditingProduct(null);
                  }}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'logos'
                      ? 'border-red-600 text-red-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Logos</span>
                </button>

                <button
                  onClick={() => setActiveTab('produtos')}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'produtos'
                      ? 'border-red-600 text-red-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Produtos ({products.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('banner');
                    setEditingProduct(null);
                  }}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'banner'
                      ? 'border-red-600 text-red-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span>Banner ({heroSlides.length})</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('designer');
                    setEditingProduct(null);
                  }}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'designer'
                      ? 'border-red-600 text-red-700'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Palette className="w-4 h-4 text-purple-600" />
                  <span>Design & Créditos</span>
                </button>
              </div>

              {onSyncAllToFirestore && (
                <button
                  type="button"
                  onClick={handleSyncAllCloud}
                  disabled={isSyncingAll}
                  className="mb-2 shrink-0 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105 cursor-pointer"
                  title="Sincroniza todas as alterações no Firebase para todos os celulares e computadores"
                >
                  <CloudUpload className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{isSyncingAll ? 'Sincronizando...' : 'Sincronizar no Firebase'}</span>
                </button>
              )}
            </div>

            {/* TAB 0: TEXTO DO SITE (FIRESTORE) */}
            {activeTab === 'texto' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-amber-500" />
                    <h4 className="text-base font-bold text-neutral-900">
                      Texto em Destaque no Site (Firestore em Tempo Real)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Este texto é salvo na nuvem e exibido com <strong>fonte amarela</strong> no topo da página inicial do Poeirão. Qualquer alteração aqui é atualizada instantaneamente em todos os celulares e computadores.
                  </p>
                </div>

                {/* Firestore Cloud Target Card */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                        <span>Configuração da Nuvem Firestore</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.2 rounded-full">
                          ● Conectado ao Vivo
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-600 font-mono mt-0.5 flex flex-wrap gap-x-3">
                        <span>Coleção: <strong>{CONTENT_COLLECTION}</strong></span>
                        <span>Documento ID: <strong>{CONTENT_DOC_ID}</strong></span>
                        <span>Campo: <strong>{CONTENT_FIELD}</strong></span>
                      </div>
                    </div>
                  </div>

                  {currentAuthUser && (
                    <div className="text-[11px] bg-white/80 border border-neutral-200 px-3 py-1.5 rounded-lg text-neutral-700">
                      Autenticado como: <strong>{currentAuthUser.email}</strong>
                    </div>
                  )}
                </div>

                {/* Real-Time Preview Box */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 block">
                    Prévia na Página Inicial (Fonte Amarela):
                  </label>
                  <div className="p-6 bg-neutral-950 rounded-2xl border border-neutral-800 text-center relative overflow-hidden shadow-inner">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-900/60 text-red-200 text-[10px] font-bold rounded-full border border-red-500/40 mb-3">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      <span>DESTAQUE DA VITRINE OFICIAL</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-yellow-400 tracking-tight leading-tight font-display drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] max-w-2xl mx-auto">
                      {firestoreTextInput || 'VISTA A TRADIÇÃO DO POEIRÃO COM ORGULHO'}
                    </h2>
                    <p className="text-[11px] text-neutral-400 mt-2">
                      Fonte amarela em alta resolução com contraste especial para os mantos
                    </p>
                  </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSaveFirestore} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                        Editar Frase em Destaque:
                      </label>
                      <span className="text-[11px] text-neutral-500">
                        {firestoreTextInput.length} caracteres
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={firestoreTextInput}
                      onChange={(e) => setFirestoreTextInput(e.target.value)}
                      placeholder="Digite o texto que será salvo no Firestore..."
                      className="w-full text-sm font-semibold p-3.5 border-2 border-neutral-300 rounded-xl focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Suggestion Chips */}
                  <div>
                    <span className="text-[11px] font-bold text-neutral-600 block mb-1.5">
                      Sugestões Rápidas (Clique para preencher):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'VISTA A TRADIÇÃO DO POEIRÃO COM ORGULHO',
                        'O MANTO SAGRADO DO POEIRÃO TE ESPERA',
                        'LOJA OFICIAL DO POEIRÃO · COLEÇÃO 2026/27',
                        'ORGULHO RUBRO-NEGRO · MANTO E PAIXÃO'
                      ].map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setFirestoreTextInput(sug)}
                          className="text-xs px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg transition-colors font-medium border border-neutral-200"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSavingFirestore}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      {isSavingFirestore ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Gravando no Firestore...</span>
                        </>
                      ) : (
                        <>
                          <CloudUpload className="w-4 h-4" />
                          <span>Salvar no Firestore (Nuvem)</span>
                        </>
                      )}
                    </button>

                    {saveSuccessFirestore && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4" />
                        Salvo e sincronizado na nuvem com sucesso!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* TAB 1: LOGOS DO CABEÇALHO */}
            {activeTab === 'logos' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h4 className="text-base font-bold text-neutral-900">
                    Alternar Logos do Cabeçalho
                  </h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Selecione entre os 5 escudos oficiais pré-configurados ou envie o escudo exato do seu time para atualizar o cabeçalho imediatamente.
                  </p>
                </div>

                {/* The 5 Preset Logos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { id: 'logo_1' as LogoId, title: 'Logo 1 · Clássico PFC', desc: 'Escudo Vertical com 4 estrelas' },
                    { id: 'logo_5' as LogoId, title: 'Logo 2 · Rubro-Negro', desc: 'Tradicional listrado com faixa PFC' },
                    { id: 'logo_2' as LogoId, title: 'Logo 3 · Circular', desc: 'Brasão redondo com anéis' },
                    { id: 'logo_3' as LogoId, title: 'Logo 4 · Dourado', desc: 'Escudo Campeão com ouro' },
                    { id: 'logo_4' as LogoId, title: 'Logo 5 · Moderno', desc: 'Design geométrico minimalista' },
                  ].map((preset) => {
                    const isCurrent = logoConfig.activeLogoId === preset.id;
                    const previewConfig: LogoConfig = {
                      activeLogoId: preset.id,
                      clubName: logoConfig.clubName,
                    };

                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPresetLogo(preset.id)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-between text-center cursor-pointer transition-all bg-neutral-50 hover:bg-white ${
                          isCurrent
                            ? 'border-red-600 ring-2 ring-red-100 shadow-md bg-white'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <div className="h-20 flex items-center justify-center">
                          <ClubLogo config={previewConfig} size="md" />
                        </div>
                        <div className="mt-2 w-full">
                          <div className="text-xs font-bold text-neutral-900">{preset.title}</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">{preset.desc}</div>
                          <button
                            type="button"
                            className={`mt-3 w-full py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                              isCurrent
                                ? 'bg-red-700 text-white'
                                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
                            }`}
                          >
                            {isCurrent ? '✓ Em Uso no Site' : 'Ativar Este'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Section: Upload Exact Club Logo */}
                <div className="bg-red-50/60 p-5 rounded-2xl border border-red-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-red-600" />
                    <h5 className="font-bold text-sm text-neutral-900">
                      Enviar a Logo Real do Seu Time
                    </h5>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Se você já tem o arquivo da logo do seu clube (PNG, JPG, SVG com fundo transparente), faça o upload abaixo ou cole o link da imagem:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-1">
                    {/* File Upload Button */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-red-300 rounded-xl p-4 bg-white hover:bg-red-50/50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadCustomLogo}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-6 h-6 text-red-600 mb-1" />
                      <span className="text-xs font-bold text-neutral-800">Clique para enviar arquivo da logo</span>
                      <span className="text-[10px] text-neutral-500">Suporta PNG, JPG, WebP ou SVG</span>
                    </div>

                    {/* Image URL Form */}
                    <form onSubmit={handleApplyCustomUrlLogo} className="space-y-2">
                      <label className="text-[11px] font-bold text-neutral-700 block">
                        Ou cole a URL / Link direto da logo:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://exemplo.com/escudo.png"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          className="flex-1 text-xs p-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg shrink-0"
                        >
                          Aplicar URL
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Active Custom Logo preview if any */}
                  {logoConfig.customLogoUrl && (
                    <div className="pt-2 flex items-center justify-between border-t border-red-200 text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={logoConfig.customLogoUrl}
                          alt="Logo Personalizada"
                          className="w-10 h-10 object-contain rounded bg-white p-1 border border-neutral-200"
                        />
                        <div>
                          <strong className="text-neutral-900">Logo do Time Carregada</strong>
                          <span className="block text-[11px] text-neutral-500">
                            {logoConfig.activeLogoId === 'logo_custom' ? 'Atualmente visível no cabeçalho' : 'Disponível para ativar'}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectPresetLogo('logo_custom')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          logoConfig.activeLogoId === 'logo_custom'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-700 text-white hover:bg-red-800'
                        }`}
                      >
                        {logoConfig.activeLogoId === 'logo_custom' ? '✓ Logo Ativa' : 'Usar Esta Logo'}
                      </button>
                    </div>
                  )}
                </div>
                {/* Shortcut to Designer Logo on Cadeado */}
                <div className="bg-purple-50/70 p-4 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-neutral-900">
                        Logo & Créditos do Designer (No Cadeado)
                      </h5>
                      <p className="text-[11px] text-neutral-500">
                        Edite a logo pessoal do seu design exibida no botão do cadeado e no rodapé.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('designer')}
                    className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer"
                  >
                    Editar Logo do Design →
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: GERENCIAR PRODUTOS DA LOJA */}
            {activeTab === 'produtos' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="text-base font-bold text-neutral-900">
                      Produtos da Loja Oficial
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Edite imagens, legendas, títulos e quantidade em estoque de cada produto.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleStartCreateProduct}
                      className="px-3.5 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Cadastrar Novo Produto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg border border-neutral-300"
                      title="Restaurar padrão"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* If editing a specific product, show edit form */}
                {editingProduct ? (
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-300 space-y-4 animate-in fade-in duration-150">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                      <div className="flex items-center gap-2 font-bold text-sm text-neutral-900">
                        <Edit3 className="w-4 h-4 text-red-600" />
                        <span>{isCreatingNew ? 'Cadastrar Novo Produto' : `Editando: ${editingProduct.name}`}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-xs text-neutral-500 hover:text-neutral-900 underline"
                      >
                        Fechar Edição
                      </button>
                    </div>

                    <form onSubmit={handleSaveProduct} className="space-y-4">
                      {/* Name & Subtitle */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-neutral-700 mb-1">Nome do Produto</label>
                          <input
                            type="text"
                            required
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            className="w-full p-2 border border-neutral-300 rounded-lg font-bold"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">Legenda / Subtítulo</label>
                          <input
                            type="text"
                            placeholder="Ex: Torcedor Oficial, Corrida, Casual..."
                            value={formCategoryLabel}
                            onChange={(e) => setFormCategoryLabel(e.target.value)}
                            className="w-full p-2 border border-neutral-300 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">Categoria na Loja</label>
                          <select
                            value={formCategory}
                            onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                            className="w-full p-2 border border-neutral-300 rounded-lg bg-white"
                          >
                            <option value="camisas-oficiais">Camisas Oficiais</option>
                            <option value="uniforme-viagem">Uniforme de Viagem</option>
                            <option value="regatas">Regatas</option>
                            <option value="calcados">Calçados & Chuteiras</option>
                            <option value="acessorios">Acessórios</option>
                          </select>
                        </div>
                      </div>

                      {/* Stock Quantity & Prices */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">
                            Quantidade em Estoque
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={formStock}
                            onChange={(e) => setFormStock(Number(e.target.value))}
                            className="w-full p-2 border border-neutral-300 rounded-lg font-bold tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">
                            Preço no Pix (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={formPricePix}
                            onChange={(e) => setFormPricePix(Number(e.target.value))}
                            className="w-full p-2 border border-neutral-300 rounded-lg font-bold text-red-700 tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">
                            Preço Original (R$)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formPriceOriginal}
                            onChange={(e) => setFormPriceOriginal(Number(e.target.value))}
                            className="w-full p-2 border border-neutral-300 rounded-lg tabular-nums"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-neutral-700 mb-1">Disponibilidade</label>
                          <select
                            value={formInStock ? 'true' : 'false'}
                            onChange={(e) => setFormInStock(e.target.value === 'true')}
                            className="w-full p-2 border border-neutral-300 rounded-lg bg-white font-bold"
                          >
                            <option value="true">Disponível</option>
                            <option value="false">Esgotado</option>
                          </select>
                        </div>
                      </div>

                      {/* Image Management */}
                      <div className="border border-neutral-200 bg-white p-4 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block font-bold text-xs text-neutral-800">
                            Foto & Imagem do Produto:
                          </label>
                          {formCustomImage && (
                            <button
                              type="button"
                              onClick={() => setFormCustomImage('')}
                              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                              title="Remover foto e deixar sem imagem"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remover Foto (Lixeira)</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                          <div className="space-y-3">
                            <div>
                              <span className="text-[11px] font-semibold text-neutral-600 block mb-1">
                                Fazer Upload da Foto do Produto:
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadProductImage}
                                className="text-xs w-full file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer"
                              />
                            </div>

                            <div>
                              <span className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                                Ou Link Direto / URL da Imagem:
                              </span>
                              <div className="flex gap-1.5">
                                <input
                                  type="url"
                                  placeholder="https://..."
                                  value={formCustomImage}
                                  onChange={(e) => setFormCustomImage(e.target.value)}
                                  className="w-full text-xs p-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:outline-none"
                                />
                                {formCustomImage && (
                                  <button
                                    type="button"
                                    onClick={() => setFormCustomImage('')}
                                    className="p-2 text-red-600 hover:bg-red-50 border border-neutral-300 rounded-lg transition-colors"
                                    title="Limpar link da imagem"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Foto / Ilustração Padrão (Sem foto enviada) */}
                            <div className="pt-2 border-t border-neutral-100">
                              <span className="text-[11px] font-semibold text-neutral-600 block mb-1">
                                Modelo / Ilustração Padrão (quando não houver foto):
                              </span>
                              <div className="flex gap-1.5">
                                <select
                                  value={formVisualType}
                                  onChange={(e) => setFormVisualType(e.target.value as Product['visualType'])}
                                  className="w-full text-xs p-2 border border-neutral-300 rounded-lg bg-white"
                                >
                                  <option value="none">❌ Nenhuma (Sem foto padrão / Em branco)</option>
                                  <option value="jersey_home">Camisa Titular Rubro-Negro Listrada</option>
                                  <option value="jersey_away">Camisa Reserva Branca</option>
                                  <option value="jersey_black">Camisa 3 Preta / Treino</option>
                                  <option value="shoe_sb">Tênis Skate SB Chron</option>
                                  <option value="shoe_runner">Tênis Running Revolution</option>
                                  <option value="slide_victori">Chinelo Slide Poeirão</option>
                                  <option value="jacket_travel">Jaqueta Viagem</option>
                                  <option value="hoodie_travel">Moletom com Capuz</option>
                                  <option value="tank_heritage">Regata Tradicional</option>
                                  <option value="tank_dryfit">Regata Dry-Fit</option>
                                  <option value="cap_trucker">Boné Trucker</option>
                                  <option value="backpack">Mochila Oficial</option>
                                </select>
                                {formVisualType !== 'none' && (
                                  <button
                                    type="button"
                                    onClick={() => setFormVisualType('none')}
                                    className="p-2 text-red-600 hover:bg-red-50 border border-neutral-300 rounded-lg transition-colors"
                                    title="Remover ilustração padrão"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              {formVisualType !== 'none' && (
                                <button
                                  type="button"
                                  onClick={() => setFormVisualType('none')}
                                  className="mt-1 text-[11px] text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remover ilustração padrão (deixar limpo)</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Image preview with quick trash button */}
                          <div className="relative flex flex-col items-center justify-center p-3 bg-neutral-50 border border-neutral-200 rounded-xl min-h-[140px]">
                            <span className="text-[10px] text-neutral-400 mb-2 font-medium">Pré-visualização:</span>
                            <div className="max-h-28 max-w-full flex items-center justify-center">
                              <ProductRender
                                type={formVisualType}
                                customImageUrl={formCustomImage || undefined}
                                className="max-h-24"
                              />
                            </div>
                            {formCustomImage && (
                              <button
                                type="button"
                                onClick={() => setFormCustomImage('')}
                                className="absolute top-2 right-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm text-[10px] font-bold flex items-center gap-1 transition-colors"
                                title="Remover foto do produto"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remover Foto</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block font-bold text-xs text-neutral-700 mb-1">Descrição</label>
                        <textarea
                          rows={2}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          className="w-full p-2 border border-neutral-300 rounded-lg text-xs"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-between items-center pt-2">
                        {!isCreatingNew && (
                          <button
                            type="button"
                            onClick={() => setProductToDelete(editingProduct)}
                            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Excluir Produto
                          </button>
                        )}
                        <div className="flex gap-2 ml-auto">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(null)}
                            className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                          >
                            Salvar Alterações
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Products List Table */
                  <div className="border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-200">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-14 bg-[#f5f5f5] rounded-lg shrink-0 flex items-center justify-center p-1 border border-neutral-200">
                            <ProductRender
                              type={prod.visualType}
                              customImageUrl={prod.customImageUrl}
                              className="max-h-12"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-neutral-900 truncate">
                              {prod.name}
                            </h5>
                            <p className="text-[11px] text-neutral-500">
                              {prod.categoryLabel} · {prod.department}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-red-700 tabular-nums">
                                R$ {prod.pricePix.toFixed(2)}
                              </span>
                              <span className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded font-semibold tabular-nums">
                                Estoque: {prod.stockQuantity ?? 25} un.
                              </span>
                              {!prod.inStock && (
                                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">
                                  Esgotado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {prod.customImageUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = { ...prod, customImageUrl: undefined };
                                onUpdateProducts(products.map((p) => (p.id === prod.id ? updated : p)));
                                setToastMessage(`✓ Foto removida de "${prod.name}".`);
                                setTimeout(() => setToastMessage(null), 3000);
                              }}
                              className="px-2 py-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Remover foto do produto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden md:inline text-[11px]">Remover Foto</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(prod)}
                            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors hover:bg-red-50"
                            title="Remover produto da loja"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FOTOS DO BANNER / CARROSSEL DO TIME */}
            {activeTab === 'banner' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="text-base font-bold text-neutral-900">
                      Fotos do Banner (Carrossel de Fundo do Time)
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Personalize as fotos que passam no fundo do destaque principal. Adicione fotos reais do clube ou troque as existentes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetSlidesConfirm(true)}
                    className="text-xs px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Restaurar Fotos Padrão</span>
                  </button>
                </div>

                {/* Upload & Add New Photo Form */}
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4 text-red-600 font-bold" />
                    <h5 className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                      Adicionar Nova Foto ao Banner
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Upload Box */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl p-4 bg-white hover:bg-red-50/40 hover:border-red-400 transition-all cursor-pointer relative text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSlideFile}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-6 h-6 text-red-600 mb-1" />
                      <span className="text-xs font-bold text-neutral-800">Enviar foto do seu celular ou PC</span>
                      <span className="text-[10px] text-neutral-500">JPG, PNG ou WebP</span>
                    </div>

                    {/* URL Input Form */}
                    <form onSubmit={handleAddSlide} className="space-y-2.5">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-0.5">
                          Ou digite o link direto da foto (URL):
                        </label>
                        <input
                          type="url"
                          placeholder="https://exemplo.com/foto-time.jpg"
                          value={slideUrlInput}
                          onChange={(e) => setSlideUrlInput(e.target.value)}
                          className="w-full text-xs p-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-neutral-700 block mb-0.5">
                            Título da Foto
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Torcida no Estádio"
                            value={slideTitleInput}
                            onChange={(e) => setSlideTitleInput(e.target.value)}
                            className="w-full text-xs p-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-neutral-700 block mb-0.5">
                            Legenda / Subtítulo
                          </label>
                          <input
                            type="text"
                            placeholder="Ex: Caldeirão Rubro-Negro"
                            value={slideSubtitleInput}
                            onChange={(e) => setSlideSubtitleInput(e.target.value)}
                            className="w-full text-xs p-2 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!slideUrlInput.trim()}
                        className="w-full py-2 bg-[#b91c1c] hover:bg-[#991b1b] disabled:bg-neutral-300 text-white text-xs font-bold rounded-lg transition-all shadow-sm"
                      >
                        + Adicionar Foto via Link
                      </button>
                    </form>
                  </div>
                </div>

                {/* Slides Currently In Use Grid */}
                <div>
                  <h5 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
                    Fotos Ativas no Banner ({heroSlides.length})
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {heroSlides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div className="relative h-36 bg-neutral-900 overflow-hidden">
                          <img
                            src={slide.url}
                            alt={slide.title}
                            className="w-full h-full object-cover object-center filter brightness-90"
                          />
                          <span className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-yellow-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                            Foto #{idx + 1}
                          </span>
                        </div>

                        <div className="p-3.5 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h6 className="font-bold text-xs text-neutral-900 truncate">
                              {slide.title}
                            </h6>
                            {slide.subtitle && (
                              <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                                {slide.subtitle}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSlideToDelete(slide)}
                            disabled={heroSlides.length <= 1}
                            className="p-1.5 text-neutral-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-neutral-400 rounded-lg transition-colors hover:bg-red-50 shrink-0"
                            title="Remover esta foto do banner"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LOGO & CRÉDITOS DO DESIGNER (CADEADO) */}
            {activeTab === 'designer' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <h4 className="text-base font-bold text-neutral-900">
                      Logo & Créditos do Design (Área do Cadeado)
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Aqui você edita a logo do seu design (exibida diretamente no botão do cadeado no cabeçalho) e os créditos de autoria do design no rodapé do site.
                  </p>
                </div>

                {/* Live Preview Card */}
                <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white p-5 rounded-2xl border border-neutral-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      Pré-visualização em Tempo Real
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Vinculado ao Botão do Cadeado e Rodapé
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* Header Cadeado Button Preview */}
                    <div className="bg-black/50 p-4 rounded-xl border border-neutral-800 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Como aparece no Cadeado (Cabeçalho):
                      </span>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 border border-yellow-400/80 rounded-full text-yellow-300 text-xs font-bold shadow-sm">
                        {designerLogoUrlInput ? (
                          <img
                            src={designerLogoUrlInput}
                            alt="Logo Design"
                            className="w-5 h-5 object-contain rounded-full bg-white/20 p-0.5 border border-yellow-300 shrink-0"
                          />
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-yellow-400 text-neutral-950 font-black text-[9px] flex items-center justify-center shrink-0">
                            JP
                          </span>
                        )}
                        <Lock className="w-3.5 h-3.5 text-yellow-300" />
                        <span>{designerNameInput || 'Design'}</span>
                      </div>
                    </div>

                    {/* Footer Credits Preview */}
                    <div className="bg-black/50 p-4 rounded-xl border border-neutral-800 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                        Como aparece no Rodapé:
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        {designerLogoUrlInput ? (
                          <img
                            src={designerLogoUrlInput}
                            alt="Logo"
                            className="w-6 h-6 object-contain rounded-full bg-white/10 p-0.5 border border-yellow-400/60 shrink-0"
                          />
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-yellow-400 text-neutral-950 font-black text-[10px] flex items-center justify-center shrink-0">
                            JP
                          </span>
                        )}
                        <div>
                          <span className="text-white font-bold block leading-tight">
                            {designerRoleInput || 'Design & Identidade Visual'} por {designerNameInput || 'João Paulo'}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Identidade visual oficial criada pelo designer
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload & Form Section */}
                <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-200/80 space-y-5">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-700" />
                    <h5 className="font-bold text-sm text-neutral-900">
                      Alterar Logo do Designer (Cadeado)
                    </h5>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Faça o upload do arquivo da sua logo pessoal (PNG, JPG, SVG, WebP) ou insira a URL direta da imagem:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    {/* File Upload Box */}
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-xl p-5 bg-white hover:bg-purple-50/40 transition-colors cursor-pointer relative text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadDesignerLogo}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Upload className="w-7 h-7 text-purple-600 mb-1.5" />
                      <span className="text-xs font-bold text-neutral-800">
                        Clique para enviar arquivo da logo do design
                      </span>
                      <span className="text-[10px] text-neutral-500 mt-0.5">
                        PNG com transparência, JPG, SVG ou WebP
                      </span>
                    </div>

                    {/* URL Input Form */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                          Ou cole a URL / Link direto da logo:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            placeholder="https://exemplo.com/minha-logo.png"
                            value={designerLogoUrlInput}
                            onChange={(e) => setDesignerLogoUrlInput(e.target.value)}
                            className="flex-1 text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none bg-white"
                          />
                        </div>
                      </div>

                      {designerLogoUrlInput && (
                        <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 text-xs">
                            <img
                              src={designerLogoUrlInput}
                              alt="Logo"
                              className="w-8 h-8 object-contain rounded p-0.5 border border-neutral-200"
                            />
                            <span className="font-semibold text-neutral-800">Logo Carregada</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveDesignerLogo}
                            className="text-xs text-red-600 hover:text-red-800 font-bold"
                          >
                            Remover
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Designer Credits Form */}
                  <form onSubmit={handleSaveDesignerConfig} className="pt-4 border-t border-purple-200/80 space-y-4">
                    <h5 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">
                      Informações dos Créditos (Você):
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                          Nome do Designer
                        </label>
                        <input
                          type="text"
                          value={designerNameInput}
                          onChange={(e) => setDesignerNameInput(e.target.value)}
                          placeholder="Ex: João Paulo"
                          className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                          Cargo / Título do Crédito
                        </label>
                        <input
                          type="text"
                          value={designerRoleInput}
                          onChange={(e) => setDesignerRoleInput(e.target.value)}
                          placeholder="Ex: Design & Identidade Visual"
                          className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                        Link de Portfólio / Instagram / Contato (Opcional)
                      </label>
                      <input
                        type="url"
                        value={designerPortfolioInput}
                        onChange={(e) => setDesignerPortfolioInput(e.target.value)}
                        placeholder="Ex: https://instagram.com/seu_perfil ou seu portfólio"
                        className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none bg-white"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Salvar Créditos e Logo do Design</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDesignerNameInput('João Paulo');
                          setDesignerRoleInput('Design & Identidade Visual');
                          setDesignerLogoUrlInput('');
                          setDesignerPortfolioInput('');
                          onUpdateDesignerConfig({
                            designerName: 'João Paulo',
                            role: 'Design & Identidade Visual',
                            logoUrl: undefined,
                            portfolioUrl: undefined,
                            showInHeader: true,
                            showInFooter: true,
                          });
                          setToastMessage('Créditos restaurados para o padrão.');
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="text-xs text-neutral-500 hover:text-neutral-800 font-semibold cursor-pointer"
                      >
                        Restaurar Padrão
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Modal for Product Deletion (Works 100% in all iframes) */}
        {productToDelete && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-inner">
                <Trash2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900">Excluir Produto da Loja?</h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Tem certeza que deseja remover <strong>"{productToDelete.name}"</strong>?
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Esta ação não pode ser desfeita, exceto ao restaurar o catálogo padrão.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Factory Reset */}
        {showResetConfirm && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-yellow-100 text-yellow-700 mx-auto flex items-center justify-center shadow-inner">
                <RotateCcw className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900">Restaurar Todos os Produtos?</h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Isso voltará todo o catálogo de produtos e estoques para a configuração padrão original.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetProducts();
                    setShowResetConfirm(false);
                    setToastMessage('Catálogo padrão restaurado com sucesso.');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="flex-1 py-2.5 px-4 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Sim, Restaurar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Banner Slide Deletion */}
        {slideToDelete && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-inner">
                <Trash2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900">Remover Foto do Banner?</h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Tem certeza que deseja excluir a foto <strong>"{slideToDelete.title}"</strong> do carrossel?
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSlideToDelete(null)}
                  className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteSlide}
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Sim, Remover
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Resetting Slides */}
        {showResetSlidesConfirm && (
          <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-200 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-yellow-100 text-yellow-700 mx-auto flex items-center justify-center shadow-inner">
                <RotateCcw className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900">Restaurar Fotos Padrão?</h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Isso irá resetar todas as fotos do carrossel para as 4 imagens originais do estádio e da torcida.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetSlidesConfirm(false)}
                  className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetHeroSlides();
                    setShowResetSlidesConfirm(false);
                    setToastMessage('Fotos padrão do time restauradas com sucesso.');
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="flex-1 py-2.5 px-4 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Sim, Restaurar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-40 bg-neutral-900 text-white border border-neutral-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
