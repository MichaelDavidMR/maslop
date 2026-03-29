import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, currency } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const formatPrice = (price: number, usdPrice: number) => {
    if (currency === 'DOP') {
      return `RD$ ${price.toLocaleString('es-DO')}`;
    }
    return `$ ${usdPrice.toFixed(2)} USD`;
  };

  const isOutOfStock = product.stock === 0 || !product.available;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group relative bg-slate-800/50 border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
        {/* Image Container */}
        <Link to={`/producto/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-slate-900">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-slate-900 hover:bg-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isOutOfStock && (
                <Badge variant="destructive" className="text-xs">
                  Agotado
                </Badge>
              )}
              {product.stock > 0 && product.stock <= 10 && (
                <Badge className="bg-amber-500 text-white text-xs">
                  Pocas unidades
                </Badge>
              )}
            </div>

            {/* Category Badge */}
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="bg-slate-900/80 text-slate-200 text-xs capitalize">
                {product.category}
              </Badge>
            </div>
          </div>
        </Link>

        {/* Content */}
        <CardContent className="p-4">
          <Link to={`/producto/${product.id}`} className="block">
            <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-blue-400 font-bold text-lg">
                {formatPrice(product.price, product.price_usd)}
              </p>
              {product.price > 0 && (
                <p className="text-slate-500 text-xs">
                  {currency === 'DOP' 
                    ? `$${product.price_usd.toFixed(2)} USD` 
                    : `RD$${product.price.toLocaleString('es-DO')}`
                  }
                </p>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`transition-all duration-300 ${
                isAdded
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAdded ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
