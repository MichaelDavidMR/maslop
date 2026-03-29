import { ProductCard } from './ProductCard';
import type { Product } from '@/types';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = 'No se encontraron productos' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <Package className="w-10 h-10 text-slate-500" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">{emptyMessage}</h3>
        <p className="text-slate-400 text-sm">
          Intenta con otros filtros o términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
