import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { Minus, Plus, Trash2, ShoppingBag, Send, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    totalPriceUSD,
    currency,
    setCurrency,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const formatPrice = (dop: number, usd: number) => {
    if (currency === 'DOP') {
      return `RD$ ${dop.toLocaleString('es-DO')}`;
    }
    return `$ ${usd.toFixed(2)} USD`;
  };

  const generateWhatsAppMessage = () => {
    const phone = '18095206178';
    let message = '*🛒 NUEVO PEDIDO - MASLOP PRODUCT*\n\n';
    message += '*Productos:*\n';
    
    items.forEach((item, index) => {
      const price = currency === 'DOP' ? item.product.price : item.product.price_usd;
      const subtotal = currency === 'DOP' 
        ? item.product.price * item.quantity 
        : item.product.price_usd * item.quantity;
      
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: ${currency === 'DOP' ? 'RD$' : '$'} ${price.toLocaleString('es-DO')}\n`;
      message += `   Subtotal: ${currency === 'DOP' ? 'RD$' : '$'} ${subtotal.toLocaleString('es-DO')}\n\n`;
    });

    message += `*Total: ${formatPrice(totalPrice, totalPriceUSD)}*\n\n`;
    message += 'Por favor confirmar disponibilidad y método de pago. Gracias!';

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }
    
    const whatsappUrl = generateWhatsAppMessage();
    window.open(whatsappUrl, '_blank');
    setIsCartOpen(false);
    toast.success('Redirigiendo a WhatsApp...');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-slate-900 border-slate-800 flex flex-col">
        <SheetHeader className="space-y-2.5 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
              Tu Carrito
              {totalItems > 0 && (
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  {totalItems}
                </Badge>
              )}
            </SheetTitle>
            
            {/* Currency Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Moneda:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrency(currency === 'DOP' ? 'USD' : 'DOP')}
                className="h-7 px-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <DollarSign className="w-3 h-3 mr-1" />
                {currency}
              </Button>
            </div>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <Button
              onClick={() => setIsCartOpen(false)}
              className="bg-blue-600 hover:bg-blue-700"
              asChild
            >
              <Link to="/catalogo">Ver Catálogo</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-4"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/producto/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-20 h-20 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/producto/${item.product.id}`}
                          onClick={() => setIsCartOpen(false)}
                          className="block"
                        >
                          <h4 className="text-white font-medium text-sm line-clamp-2 hover:text-blue-400 transition-colors">
                            {item.product.name}
                          </h4>
                        </Link>
                        <p className="text-blue-400 font-semibold text-sm mt-1">
                          {formatPrice(item.product.price, item.product.price_usd)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-800"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-white text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-800"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <div className="border-t border-slate-800 pt-4 mt-4 space-y-4">
              {/* Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">
                    {formatPrice(totalPrice, totalPriceUSD)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Envío</span>
                  <span className="text-green-400">Gratis</span>
                </div>
                <Separator className="bg-slate-800" />
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-blue-400 font-bold text-lg">
                    {formatPrice(totalPrice, totalPriceUSD)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Pedido por WhatsApp
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Vaciar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                    asChild
                  >
                    <Link to="/catalogo">Seguir Comprando</Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
