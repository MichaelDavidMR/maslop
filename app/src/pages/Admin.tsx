// Admin.tsx — Supabase connected
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import { CATEGORIES, type Product } from '@/types';
import {
  LogOut, Plus, Search, Edit2, Trash2, Package, ShoppingCart,
  TrendingUp, AlertTriangle, Save, X, LayoutDashboard, Boxes,
  ImagePlus, MessageCircle, RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';

// ── Blank product template ────────────────────────────────────
const BLANK_PRODUCT: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  description: '',
  price: 0,
  price_usd: 0,
  price_hidden: false,
  category: CATEGORIES[0].slug,
  image: '/products/placeholder.jpg',
  stock: 0,
  available: true,
};

type EditState = Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string };

export function Admin() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const {
    products, loading, error, fetchProducts,
    deleteProduct, updateProduct, createProduct,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<EditState | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Access guard ─────────────────────────────────────────────
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#06090f] flex items-center justify-center">
        <div className="text-center glass-strong rounded-2xl p-12 border border-white/[0.07]">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-3">Acceso Denegado</h1>
          <p className="text-slate-400 mb-6">Debes iniciar sesión como administrador.</p>
          <Button onClick={() => navigate('/login')} className="btn-primary rounded-xl font-semibold px-6">
            Ir al Login
          </Button>
        </div>
      </div>
    );
  }

  // ── Stats ─────────────────────────────────────────────────────
  const stats = {
    totalProducts: products.length,
    totalValue: products.reduce((s, p) => s + (p.price_hidden ? 0 : p.price * p.stock), 0),
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Handlers ──────────────────────────────────────────────────
  const openEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setImageFile(null);
    setImagePreview(null);
    setIsEditDialogOpen(true);
  };

  const openNew = () => {
    setEditingProduct({ ...BLANK_PRODUCT });
    setImageFile(null);
    setImagePreview(null);
    setIsEditDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    setIsSaving(true);

    const payload = {
      name: editingProduct.name,
      description: editingProduct.description,
      price: editingProduct.price_hidden ? 0 : editingProduct.price,
      price_usd: editingProduct.price_hidden ? 0 : editingProduct.price_usd,
      price_hidden: editingProduct.price_hidden,
      category: editingProduct.category,
      image: editingProduct.image,
      stock: editingProduct.stock,
      available: editingProduct.available,
    };

    if (editingProduct.id) {
      await updateProduct(editingProduct.id, payload, imageFile ?? undefined);
    } else {
      await createProduct(payload, imageFile ?? undefined);
    }

    // ── Force-refresh the list so changes are visible immediately,
    //    regardless of whether Supabase Realtime is enabled on this table.
    await fetchProducts();

    setIsSaving(false);
    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProduct(id);
      // Same here — explicit refetch guarantees the row disappears.
      await fetchProducts();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ── Stat cards ────────────────────────────────────────────────
  const statCards = [
    { icon: Boxes,         value: stats.totalProducts,                                  label: 'Total Productos',     iconColor: 'text-blue-400',    iconBg: 'bg-blue-500/10 border border-blue-500/20',     valueColor: 'text-blue-300'    },
    { icon: TrendingUp,    value: `RD$ ${stats.totalValue.toLocaleString('es-DO')}`,    label: 'Valor en Inventario', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/10 border border-emerald-500/20', valueColor: 'text-emerald-300' },
    { icon: AlertTriangle, value: stats.lowStock,                                        label: 'Stock Bajo',          iconColor: 'text-amber-400',   iconBg: 'bg-amber-500/10 border border-amber-500/20',   valueColor: 'text-amber-300'   },
    { icon: ShoppingCart,  value: stats.outOfStock,                                      label: 'Agotados',            iconColor: 'text-red-400',     iconBg: 'bg-red-500/10 border border-red-500/20',       valueColor: 'text-red-300'     },
  ];

  return (
    <div className="min-h-screen bg-[#06090f] pt-24 pb-16">
      <div className="absolute inset-0 bg-grid opacity-100 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Panel de Administración</h1>
              <p className="text-slate-500 text-sm font-normal mt-0.5">
                Gestiona productos · {loading ? 'Cargando…' : `${products.length} productos`}
                {error && <span className="text-red-400 ml-2">⚠ Error de conexión</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={fetchProducts}
              className="btn-ghost-border rounded-xl font-medium text-sm h-9 px-3 w-fit"
              title="Recargar"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="btn-ghost-border rounded-xl font-medium text-sm h-9 px-4 w-fit"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06 }}
              className="stat-card p-5"
            >
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
              </div>
              <p className={`text-2xl font-black ${card.valueColor} leading-none mb-1 font-numeric`}>
                {card.value}
              </p>
              <p className="text-slate-500 text-xs font-medium">{card.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <Tabs defaultValue="products">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <TabsList className="bg-slate-900/60 border border-white/[0.06] rounded-xl p-1 h-auto">
                <TabsTrigger value="products" className="rounded-lg px-4 py-1.5 text-sm font-medium data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-500">
                  <Package className="w-3.5 h-3.5 mr-1.5" />
                  Productos
                </TabsTrigger>
                <TabsTrigger value="orders" className="rounded-lg px-4 py-1.5 text-sm font-medium data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-500">
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  Pedidos
                </TabsTrigger>
              </TabsList>
              <Button onClick={openNew} className="btn-primary rounded-xl font-semibold text-sm h-9 px-4 gap-2 w-fit">
                <Plus className="w-4 h-4" />
                Nuevo Producto
              </Button>
            </div>

            {/* ── Products Tab ── */}
            <TabsContent value="products">
              <div className="glass-strong rounded-2xl border border-white/[0.06] overflow-hidden">
                {/* Search bar */}
                <div className="p-4 border-b border-white/[0.04]">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar productos…"
                      className="pl-9 bg-slate-900/60 border-slate-700/40 text-white placeholder:text-slate-600 rounded-xl h-9 text-sm focus:border-blue-500/50"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.04] hover:bg-transparent">
                        <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider w-12">Img</TableHead>
                        <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Nombre</TableHead>
                        <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Categoría</TableHead>
                        <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Precio</TableHead>
                        <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Stock</TableHead>
                        <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Estado</TableHead>
                        <TableHead className="text-slate-500 text-xs font-semibold uppercase tracking-wider text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading && !products.length ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-16">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                              <p className="text-slate-600 text-sm">Cargando productos…</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-16">
                            <div className="empty-state-icon"><Package className="w-7 h-7 text-slate-600" /></div>
                            <p className="text-slate-500 text-sm">No se encontraron productos</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id} className="border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                            <TableCell>
                              <div className="w-10 h-10 rounded-lg bg-slate-800/80 overflow-hidden border border-white/[0.06] flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/products/placeholder.jpg'; }}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-white font-semibold text-sm">{product.name}</p>
                              <p className="text-slate-500 text-xs mt-0.5 line-clamp-1">{product.description}</p>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-slate-400 text-xs capitalize">{product.category}</span>
                            </TableCell>
                            <TableCell>
                              {product.price_hidden ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                  <MessageCircle className="w-3 h-3" />
                                  WhatsApp
                                </span>
                              ) : (
                                <span className="text-slate-200 text-sm font-semibold">
                                  RD$ {product.price.toLocaleString('es-DO')}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className={`text-sm font-semibold ${product.stock === 0 ? 'text-red-400' : product.stock <= 10 ? 'text-amber-400' : 'text-slate-300'}`}>
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {product.available && product.stock > 0 ? (
                                <span className="badge-green px-2.5 py-1 rounded-full text-xs">Activo</span>
                              ) : (
                                <span className="badge-red px-2.5 py-1 rounded-full text-xs">Inactivo</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => openEdit(product)} className="icon-btn icon-btn-blue" title="Editar">
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDelete(product.id)} className="icon-btn icon-btn-red" title="Eliminar">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filteredProducts.length > 0 && (
                  <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
                    <p className="text-slate-600 text-xs">
                      {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                      {searchQuery && ` encontrado${filteredProducts.length !== 1 ? 's' : ''}`}
                    </p>
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                        <X className="w-3 h-3" /> Limpiar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* ── Orders Tab ── */}
            <TabsContent value="orders">
              <div className="glass-strong rounded-2xl border border-white/[0.06] p-12 text-center">
                <div className="empty-state-icon">
                  <ShoppingCart className="w-7 h-7 text-slate-600" />
                </div>
                <h3 className="text-white font-bold text-base mb-2">Gestión de Pedidos</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
                  Los pedidos se gestionan directamente por WhatsApp. Los clientes envían sus pedidos y tú los procesas manualmente.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* ── Edit / Create Dialog ── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#0c1424] border border-white/[0.08] text-white max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-white font-black text-lg tracking-tight">
              {editingProduct?.id ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4 mt-1">

              {/* ── Image upload ── */}
              <div className="space-y-1.5">
                <label className="field-label">Imagen del producto</label>
                <div className="flex gap-3 items-start">
                  <div className="w-20 h-20 rounded-xl bg-slate-900/80 border border-slate-700/60 overflow-hidden flex-shrink-0">
                    <img
                      src={imagePreview ?? editingProduct.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/products/placeholder.jpg'; }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      placeholder="URL de la imagen"
                      className="bg-slate-900/80 border-slate-700/60 text-white rounded-xl h-9 text-sm focus:border-blue-500/60 placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 border border-dashed border-slate-700/60 hover:border-blue-500/40 rounded-xl py-2 text-slate-500 hover:text-blue-400 text-xs font-medium transition-all"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      {imageFile ? imageFile.name : 'Subir archivo desde dispositivo'}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>

              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="field-label">Nombre *</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="Nombre del producto"
                  className="bg-slate-900/80 border-slate-700/60 text-white rounded-xl h-10 focus:border-blue-500/60 placeholder:text-slate-600"
                />
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="field-label">Descripción</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  placeholder="Descripción del producto…"
                  className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white text-sm resize-none focus:outline-none focus:border-blue-500/60 transition-colors placeholder:text-slate-600"
                />
              </div>

              {/* Price hidden toggle */}
              <label className="flex items-start gap-3 cursor-pointer group py-2 px-3 rounded-xl border border-emerald-600/20 bg-emerald-500/5 hover:bg-emerald-500/8 transition-colors">
                <input
                  type="checkbox"
                  checked={editingProduct.price_hidden}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price_hidden: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-emerald-500 mt-0.5"
                />
                <div>
                  <span className="text-white text-sm font-semibold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Precio a consultar por WhatsApp
                  </span>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Oculta el precio y muestra un botón de WhatsApp en su lugar
                  </p>
                </div>
              </label>

              {/* Precios */}
              {!editingProduct.price_hidden && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="field-label">Precio (RD$)</label>
                    <Input
                      type="number" min={0}
                      value={editingProduct.price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      placeholder="0"
                      className="bg-slate-900/80 border-slate-700/60 text-white rounded-xl h-10 focus:border-blue-500/60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="field-label">Precio (USD)</label>
                    <Input
                      type="number" min={0} step="0.01"
                      value={editingProduct.price_usd || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price_usd: Number(e.target.value) })}
                      placeholder="0.00"
                      className="bg-slate-900/80 border-slate-700/60 text-white rounded-xl h-10 focus:border-blue-500/60"
                    />
                  </div>
                </div>
              )}

              {/* Categoría */}
              <div className="space-y-1.5">
                <label className="field-label">Categoría</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/60 transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="space-y-1.5">
                <label className="field-label">Stock</label>
                <Input
                  type="number" min={0}
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="bg-slate-900/80 border-slate-700/60 text-white rounded-xl h-10 focus:border-blue-500/60"
                />
              </div>

              {/* Disponible */}
              <label className="flex items-center gap-3 cursor-pointer group py-1">
                <input
                  type="checkbox"
                  checked={editingProduct.available}
                  onChange={(e) => setEditingProduct({ ...editingProduct, available: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-blue-500"
                />
                <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                  Producto disponible
                </span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !editingProduct.name.trim()}
                  className="flex-1 btn-primary rounded-xl h-10"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando…
                    </span>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="btn-ghost-border rounded-xl h-10 px-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}