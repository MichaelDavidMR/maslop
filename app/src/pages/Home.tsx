// Home.tsx - Supabase-connected (useProducts hook)
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES } from '@/types';
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  Package,
  Check,
  Phone,
  MapPin,
  Star,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: smoothEase },
});

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ── Pull live products from Supabase (same hook used by Admin) ──
  const { products, loading } = useProducts();

  const featuredProducts = products.slice(0, 8);
  const filteredProducts =
    selectedCategory === 'all'
      ? featuredProducts
      : featuredProducts.filter((p) => p.category === selectedCategory);

  const features = [
    { icon: Truck, title: 'Envío Gratis', description: 'En compras mayores a RD$ 5,000', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Shield, title: 'Garantía', description: 'Todos nuestros productos', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Headphones, title: 'Soporte 24/7', description: 'Atención personalizada', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Package, title: 'Stock Real', description: 'Disponibilidad inmediata', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const stats = [
    { value: `${products.length || '500'}+`, label: 'Productos', icon: Package },
    { value: '10+', label: 'Categorías', icon: Star },
    { value: '1000+', label: 'Clientes', icon: Headphones },
    { value: '5+', label: 'Años exp.', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#06090f]">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[#06090f]">
          <div className="absolute inset-0 bg-mesh" />
          <div className="absolute inset-0 bg-grid opacity-100" />
          <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px] pointer-events-none" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <motion.div {...fadeUp(0.1)}>
                <span className="section-label mb-6 inline-flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  Ferretería · San Pedro de Macorís
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.2)}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.02] mb-6 tracking-tight"
              >
                Todo para
                <br />
                <span className="gradient-text">construir</span>
                <br />
                tu mundo
              </motion.h1>

              <motion.p {...fadeUp(0.3)} className="text-slate-400 text-lg mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Herramientas, materiales de construcción y artículos para el hogar.
                Calidad garantizada, precios sin igual.
              </motion.p>

              <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button size="lg" className="btn-primary h-13 px-8 text-[15px] font-semibold rounded-xl" asChild>
                  <Link to="/catalogo">
                    Ver Catálogo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="btn-ghost-border h-13 px-8 text-[15px] font-semibold rounded-xl" asChild>
                  <a href="https://wa.me/18095206178" target="_blank" rel="noopener noreferrer">
                    <Phone className="w-4 h-4 mr-2 text-green-400" />
                    WhatsApp
                  </a>
                </Button>
              </motion.div>

              <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-5 justify-center lg:justify-start mt-8">
                {['Envío Gratis', 'Garantía Incluida', 'Mejores Precios'].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    </span>
                    {badge}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-indigo-500/10 blur-sm" />
                <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] shadow-2xl">
                  <img
                    src="/products/064_todo_tipo_de_herramientas.jpg"
                    alt="Herramientas MASLOP"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06090f]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">Calidad Garantizada</p>
                        <p className="text-slate-400 text-xs">Más de {products.length || 500} productos</p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="absolute -bottom-5 -left-6 glass-strong rounded-xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg leading-none">{products.length || '500'}+</p>
                      <p className="text-slate-400 text-xs mt-0.5">Productos</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                  className="absolute -top-4 -right-4 glass-strong rounded-xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {['from-blue-400 to-blue-600', 'from-emerald-400 to-emerald-600', 'from-purple-400 to-purple-600'].map((g, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 border-[#0c1220]`} />
                      ))}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm leading-none">1,000+</p>
                      <p className="text-slate-400 text-xs mt-0.5">Clientes felices</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <section className="py-10 relative">
        <div className="divider-glow mb-0" />
        <div className="bg-gradient-to-r from-transparent via-blue-950/20 to-transparent py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 group"
                >
                  <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{f.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="divider-glow" />
      </section>

      {/* ── Categories ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="section-label mb-4 inline-flex">Categorías</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Encuentra lo que necesitas
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Explora nuestra amplia variedad de productos organizados por categoría
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {CATEGORIES.map((category, i) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/catalogo?category=${category.slug}`}
                  className="group block relative rounded-xl overflow-hidden aspect-square"
                >
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/30 group-hover:to-indigo-500/20 transition-all duration-500 z-10" />
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-112"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06090f]/90 via-[#06090f]/30 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                    <p className="text-white font-semibold text-sm leading-snug group-hover:text-blue-300 transition-colors">
                      {category.name}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
          >
            <div>
              <span className="section-label mb-3 inline-flex">Destacados</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                Productos Populares
              </h2>
              <p className="text-slate-400">Los favoritos de nuestros clientes</p>
            </div>
            <Button variant="outline" className="btn-ghost-border rounded-xl font-medium shrink-0" asChild>
              <Link to="/catalogo">
                Ver Todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          <div className="mb-8">
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </div>

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-strong rounded-2xl border border-white/[0.06] aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[#0a0f1e]" />
            <div className="absolute inset-0 bg-dots" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            <div className="relative grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/[0.06]">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="px-8 py-10 text-center group"
                >
                  <stat.icon className="w-5 h-5 text-blue-500/60 mx-auto mb-3 group-hover:text-blue-400 transition-colors" />
                  <p className="font-display text-5xl sm:text-6xl text-white mb-1 tracking-wide">{stat.value}</p>
                  <p className="text-slate-500 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="relative rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900" />
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative px-6 py-14 sm:px-14 sm:py-18 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest mb-6">
                ¿Necesitas ayuda?
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                Estamos aquí para ti
              </h2>
              <p className="text-blue-100/80 text-lg mb-10 max-w-2xl mx-auto">
                Escríbenos por WhatsApp y te ayudaremos a encontrar exactamente
                lo que tu proyecto necesita.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 h-13 px-8 font-bold rounded-xl shadow-lg" asChild>
                  <a href="https://wa.me/18095206178" target="_blank" rel="noopener noreferrer">
                    <Phone className="w-5 h-5 mr-2" />
                    Escribir por WhatsApp
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-13 px-8 font-semibold rounded-xl" asChild>
                  <Link to="/contacto">
                    <MapPin className="w-5 h-5 mr-2" />
                    Visitar Tienda
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}