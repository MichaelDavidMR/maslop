// UserProducts.tsx
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Product } from '@/types';
import { PRODUCTS_DATA } from '@/types';
import { supabase, uploadProductImage, deleteProductImage } from '@/lib/supabase';
import { toast } from 'sonner';

export function useProducts() {
  // Start with seed data so UI isn't blank during first fetch
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Fetch all products ───────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    const { data, error: fetchErr } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchErr) {
      setError(fetchErr.message);
      // Keep showing seed/stale data — don't blank the UI
    } else if (data) {
      setProducts(data as Product[]);
      setError(null);
    }

    setLoading(false);
  }, []);

  // ── Mount: fetch + subscribe to realtime changes ─────────────
  useEffect(() => {
    fetchProducts();

    channelRef.current = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts((prev) => [payload.new as Product, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Product) : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [fetchProducts]);

  // ── Read helpers (synchronous, work on local state) ──────────
  const getProductById = useCallback(
    (id: string): Product | undefined => products.find((p) => p.id === id),
    [products]
  );

  const getProductsByCategory = useCallback(
    (category: string): Product[] =>
      category === 'all' ? products : products.filter((p) => p.category === category),
    [products]
  );

  const searchProducts = useCallback(
    (query: string): Product[] => {
      const q = query.toLowerCase();
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    },
    [products]
  );

  const filterProducts = useCallback(
    (filters: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      available?: boolean;
      search?: string;
    }): Product[] => {
      let result = [...products];

      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }
      if (filters.category && filters.category !== 'all') {
        result = result.filter((p) => p.category === filters.category);
      }
      // Skip price filter for hidden-price products
      if (filters.minPrice !== undefined) {
        result = result.filter((p) => p.price_hidden || p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        result = result.filter((p) => p.price_hidden || p.price <= filters.maxPrice!);
      }
      if (filters.available) {
        result = result.filter((p) => p.available && p.stock > 0);
      }

      return result;
    },
    [products]
  );

  // ── Create ────────────────────────────────────────────────────
  const createProduct = useCallback(
    async (
      productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
      imageFile?: File
    ): Promise<Product | null> => {
      let image = productData.image;

      if (imageFile) {
        try {
          image = await uploadProductImage(imageFile);
        } catch (e) {
          toast.error('Error al subir imagen');
          return null;
        }
      }

      const { data, error: insertErr } = await supabase
        .from('products')
        .insert({ ...productData, image })
        .select()
        .single();

      if (insertErr) {
        toast.error('Error al crear producto');
        console.error(insertErr);
        return null;
      }

      toast.success('Producto creado exitosamente');
      return data as Product;
    },
    []
  );

  // ── Update ────────────────────────────────────────────────────
  const updateProduct = useCallback(
    async (
      id: string,
      updates: Partial<Product>,
      imageFile?: File
    ): Promise<Product | null> => {
      let image = updates.image;

      if (imageFile) {
        try {
          image = await uploadProductImage(imageFile);
          // Delete old image if it was from Storage
          const old = products.find((p) => p.id === id);
          if (old?.image) await deleteProductImage(old.image);
        } catch (e) {
          toast.error('Error al subir imagen');
          return null;
        }
      }

      const { data, error: updateErr } = await supabase
        .from('products')
        .update({ ...updates, ...(image ? { image } : {}), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateErr) {
        toast.error('Error al actualizar producto');
        console.error(updateErr);
        return null;
      }

      toast.success('Producto actualizado');
      return data as Product;
    },
    [products]
  );

  // ── Delete ────────────────────────────────────────────────────
  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      const target = products.find((p) => p.id === id);

      const { error: deleteErr } = await supabase.from('products').delete().eq('id', id);

      if (deleteErr) {
        toast.error('Error al eliminar producto');
        return false;
      }

      // Clean up storage image
      if (target?.image) await deleteProductImage(target.image);

      toast.success('Producto eliminado');
      return true;
    },
    [products]
  );

  // ── Update stock only ─────────────────────────────────────────
  const updateStock = useCallback(async (id: string, newStock: number): Promise<boolean> => {
    const { error: updateErr } = await supabase
      .from('products')
      .update({ stock: newStock, available: newStock > 0 })
      .eq('id', id);

    if (updateErr) {
      toast.error('Error al actualizar stock');
      return false;
    }
    return true;
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    filterProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
  };
}