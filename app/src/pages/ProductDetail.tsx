// ProductDetail.tsx — Supabase-connected, with PriceDisplay
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { PriceDisplay } from '@/components/PriceDisplay';
import { CATEGORIES } from '@/types';
import {
  ShoppingCart, ArrowLeft, Check, Package, Shield, Truck,
  Minus, Plus, Share2, Heart, ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    delay,
    ease: [0.22, 1, 0.36, 1] as const
  },
});

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, currency } = useCart();
  const { products, loading } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [id]);
  useEffect(() => { setQuantity(1); setIsWishlisted(false); }, [id]);

  const product = products.find((p) => p.id === id);
  const category = product ? CATEGORIES.find((c) => c.slug === product.category) : undefined;
  const relatedProducts = products
    .filter((p) => product && p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => { if (product) addToCart(product, quantity); };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  // Loading skeleton
  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#06090f] pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Cargando producto…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#06090f] pt-28 pb-16 flex items-center justify-center">
        <div className="text-center glass-strong rounded-2xl p-12 border border-white/[0.07]">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-slate-600" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Producto no encontrado</h1>
          <p className="text-slate-400 mb-6 text-sm">El producto que buscas no existe o fue eliminado.</p>
          <Button className="btn-primary rounded-xl font-semibold px-6" asChild>
            <Link to="/catalogo">Ver Catálogo</Link>
          </Button>
        </div>
      </div>
    );
  }

  const canAddToCart = !product.price_hidden;
  const isOutOfStock = product.stock === 0 || !product.available;

  return (
    <div className="min-h-screen bg-[#06090f] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <motion.nav {...fadeUp(0)} className="flex items-center gap-2 text-sm text-slate-500 mb-8 mt-6">
          <Link to="/" className="hover:text-slate-300 transition-colors">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/catalogo" className="hover:text-slate-300 transition-colors">Catálogo</Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to={`/catalogo?category=${category.slug}`} className="hover:text-slate-300 transition-colors capitalize">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-400 truncate max-w-[180px]">{product.name}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Image ── */}
          <motion.div {...fadeUp(0.05)}>
            <div className="relative rounded-2xl overflow-hidden bg-slate-900/60 border border-white/[0.06] aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-6"
                onError={(e) => { (e.target as HTMLImageElement).src = '/products/placeholder.jpg'; }}
              />
              {isOutOfStock && (
                <div className="absolute top-4 right-4 bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Agotado
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Info ── */}
          <motion.div {...fadeUp(0.1)} className="flex flex-col gap-6">

            {/* Category + name */}
            <div>
              {category && (
                <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-2 block">
                  {category.name}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <PriceDisplay product={product} currency={currency} variant="detail" />

            {/* Stock badge */}
            {!isOutOfStock && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400">
                  {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'} disponibles
                </span>
              </div>
            )}

            {/* Quantity + cart — hidden when price_hidden or out of stock */}
            {canAddToCart && !isOutOfStock && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm font-medium">Cantidad:</span>
                  <div className="flex items-center gap-1 bg-slate-900/80 rounded-xl border border-slate-700/60 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-white font-bold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="btn-primary h-12 text-[15px] font-bold rounded-xl w-full sm:w-auto"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al Carrito
                </Button>
              </div>
            )}

            {isOutOfStock && (
              <p className="text-red-400 text-sm font-semibold">Este producto está agotado.</p>
            )}

            {/* Action row */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                  isWishlisted
                    ? 'border-red-500/40 bg-red-500/10 text-red-400'
                    : 'border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Guardado' : 'Guardar'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-medium transition-all"
              >
                <Share2 className="w-4 h-4" />
                Compartir
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/[0.04]">
              {[
                { icon: Shield, label: 'Producto verificado' },
                { icon: Package, label: 'Disponible en tienda' },
                { icon: Truck,  label: 'Envío a todo el país' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-white/[0.06] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-slate-500 text-[11px] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Tabs: description ── */}
        <motion.div {...fadeUp(0.2)} className="mt-14">
          <Tabs defaultValue="description">
            <TabsList className="bg-slate-900/60 border border-white/[0.06] rounded-xl p-1 h-auto mb-6">
              <TabsTrigger value="description" className="rounded-lg px-5 py-1.5 text-sm font-medium data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-500">
                Descripción
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <div className="glass-strong rounded-2xl border border-white/[0.06] p-7">
                <p className="text-slate-300 leading-relaxed">{product.description}</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* ── Related products ── */}
        {relatedProducts.length > 0 && (
          <motion.div {...fadeUp(0.25)} className="mt-14">
            <h2 className="text-xl font-black text-white mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/producto/${related.id}`}
                  className="group glass-strong rounded-2xl border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
                >
                  <div className="aspect-square bg-slate-900/60 overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/products/placeholder.jpg'; }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-white font-bold text-sm leading-tight line-clamp-2">{related.name}</p>
                    <div className="mt-1.5">
                      <PriceDisplay product={related} currency={currency} variant="card" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back button */}
        <motion.div {...fadeUp(0.3)} className="mt-10">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="btn-ghost-border rounded-xl h-9 px-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </motion.div>
      </div>
    </div>
  );
}