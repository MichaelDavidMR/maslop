// Catalog.tsx — Supabase-connected via useProducts
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { PriceDisplay } from '@/components/PriceDisplay';
import { CATEGORIES } from '@/types';
import {
  Search, SlidersHorizontal, X, Grid3X3, List,
  PackageSearch, ChevronLeft, ChevronRight, ShoppingCart,
} from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Draggable Dual-Range Slider ─────────────────────────────────────────────
interface DualRangeSliderProps {
  min: number; max: number; step?: number;
  value: [number, number]; onChange: (value: [number, number]) => void;
}

function DualRangeSlider({ min, max, step = 100, value, onChange }: DualRangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [low, high] = value;

  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const clamp = (v: number) => Math.round(Math.max(min, Math.min(max, v)) / step) * step;

  const startDrag = useCallback(
    (thumb: 'low' | 'high') => (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);
      const onMove = (ev: PointerEvent) => {
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
        const clamped = clamp(min + ratio * (max - min));
        if (thumb === 'low') onChange([Math.min(clamped, high - step), high]);
        else onChange([low, Math.max(clamped, low + step)]);
      };
      const onUp = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
    },
    [low, high, min, max, step, onChange, clamp]
  );

  return (
    <div className="px-2 py-3">
      <div ref={trackRef} className="relative h-1.5 bg-slate-700/60 rounded-full select-none">
        <div
          className="absolute h-full bg-blue-500/80 rounded-full"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
        />
        {(['low', 'high'] as const).map((thumb) => (
          <div
            key={thumb}
            onPointerDown={startDrag(thumb)}
            style={{ left: `${pct(thumb === 'low' ? low : high)}%` }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 cursor-pointer shadow-md hover:scale-110 transition-transform"
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-500">
        <span>RD$ {low.toLocaleString('es-DO')}</span>
        <span>RD$ {high.toLocaleString('es-DO')}</span>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, view, currency }: { product: any; view: 'grid' | 'list'; currency: any }) {
  const { addToCart } = useCart();

  if (view === 'list') {
    return (
      <Link
        to={`/producto/${product.id}`}
        className="group flex gap-4 glass-strong rounded-2xl border border-white/[0.06] p-4 hover:border-white/[0.12] transition-all hover:shadow-lg hover:shadow-black/30"
      >
        <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-slate-900/60 overflow-hidden">
          <img
            src={product.image} alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).src = '/products/placeholder.jpg'; }}
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="text-white font-bold text-sm leading-tight">{product.name}</p>
            <p className="text-slate-500 text-xs mt-1 line-clamp-2">{product.description}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <PriceDisplay product={product} currency={currency} variant="card" />
            {!product.price_hidden && product.stock > 0 && (
              <button
                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                className="w-8 h-8 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 border border-blue-600/20 flex items-center justify-center text-blue-400 hover:text-blue-300 transition-all"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group glass-strong rounded-2xl border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40"
    >
      <div className="relative aspect-square bg-slate-900/60 overflow-hidden">
        <img
          src={product.image} alt={product.name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = '/products/placeholder.jpg'; }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-red-500/80 px-2 py-1 rounded-full">Agotado</span>
          </div>
        )}
        {!product.price_hidden && product.stock > 0 && (
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-1 group-hover:translate-y-0"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="p-4">
        <p className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1.5">{product.name}</p>
        <PriceDisplay product={product} currency={currency} variant="card" />
      </div>
    </Link>
  );
}

// ─── Main Catalog ─────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 20;

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useProducts();
  const { currency } = useCart();

  const maxPrice = Math.max(...products.filter(p => !p.price_hidden).map(p => p.price), 10000);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync priceRange max when products load
  useEffect(() => {
    if (!loading) setPriceRange((prev) => [prev[0], Math.max(prev[1], maxPrice)]);
  }, [loading, maxPrice]);

  // Sync URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.search = searchQuery;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    setSearchParams(params, { replace: true });
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const filtered = products.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (!p.price_hidden && (p.price < priceRange[0] || p.price > priceRange[1])) return false;
    if (showAvailableOnly && (!p.available || p.stock === 0)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange([0, maxPrice]);
    setShowAvailableOnly(false);
    setCurrentPage(1);
  };

  const hasFilters = searchQuery || selectedCategory !== 'all' || showAvailableOnly || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="text-white font-bold text-sm mb-3">Categoría</h3>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedCategory === 'all' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
          >
            Todas las categorías
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${selectedCategory === cat.slug ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-white font-bold text-sm mb-2">Precio (RD$)</h3>
        <DualRangeSlider min={0} max={maxPrice} step={100} value={priceRange} onChange={setPriceRange} />
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2.5">
        <Checkbox
          id="available"
          checked={showAvailableOnly}
          onCheckedChange={(v) => setShowAvailableOnly(Boolean(v))}
          className="border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
        <label htmlFor="available" className="text-slate-400 text-sm cursor-pointer hover:text-white transition-colors">
          Solo disponibles
        </label>
      </div>

      {hasFilters && (
        <Button onClick={resetFilters} variant="ghost" className="w-full btn-ghost-border rounded-xl h-9 text-sm">
          <X className="w-3.5 h-3.5 mr-1.5" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#06090f] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="section-label mb-3 inline-flex">Catálogo</span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            Todos nuestros productos
          </h1>
          <p className="text-slate-400">
            {loading ? 'Cargando…' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </motion.div>

        {/* Search + controls bar */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos…"
              className="pl-9 bg-slate-900/60 border-slate-700/40 text-white placeholder:text-slate-600 rounded-xl h-10 focus:border-blue-500/50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile filter sheet */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden btn-ghost-border rounded-xl h-10 px-4 gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-[#0a0f1e] border-white/[0.08] w-72">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-white font-black">Filtros</SheetTitle>
              </SheetHeader>
              <FilterPanel />
            </SheetContent>
          </Sheet>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-slate-900/60 border border-white/[0.06] rounded-xl p-1">
            {(['grid', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${view === v ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {v === 'grid' ? <Grid3X3 className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="glass-strong rounded-2xl border border-white/[0.06] p-5 sticky top-28">
              <FilterPanel />
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading && !products.length ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-500 text-sm">Cargando productos…</p>
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/[0.06] flex items-center justify-center">
                  <PackageSearch className="w-8 h-8 text-slate-600" />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-base mb-1">Sin resultados</p>
                  <p className="text-slate-500 text-sm">Intenta ajustar los filtros</p>
                </div>
                {hasFilters && (
                  <Button onClick={resetFilters} className="btn-primary rounded-xl h-9 px-5 text-sm">
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4' : 'flex flex-col gap-3'}>
                  {paginated.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ProductCard product={product} view={view} currency={currency} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/[0.2] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-xl border text-sm font-bold transition-all ${currentPage === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-white/[0.08] text-slate-400 hover:text-white hover:border-white/[0.2]'}`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/[0.2] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}