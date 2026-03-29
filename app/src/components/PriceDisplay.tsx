/**
 * PriceDisplay
 * Renders the product price, or a "Más información en WhatsApp" button
 * when product.price_hidden === true.
 *
 * Usage:
 *   <PriceDisplay product={product} currency={currency} />
 *   <PriceDisplay product={product} currency={currency} variant="card" />
 *   <PriceDisplay product={product} currency={currency} variant="detail" />
 */

import type { Product, Currency } from '@/types';
import { MessageCircle } from 'lucide-react';

const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '18095206178';

function buildWhatsAppUrl(productName: string) {
  const text = encodeURIComponent(
    `Hola, me gustaría obtener más información sobre el precio de: *${productName}*`
  );
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

function formatPrice(price: number, priceUsd: number, currency: Currency) {
  return currency === 'DOP'
    ? `RD$ ${price.toLocaleString('es-DO')}`
    : `$ ${priceUsd.toFixed(2)} USD`;
}

// ── Variants ─────────────────────────────────────────────────────────────────

interface PriceDisplayProps {
  product: Product;
  currency: Currency;
  /** "card" → compact inline; "detail" → large block; "inline" → plain text */
  variant?: 'card' | 'detail' | 'inline';
  className?: string;
}

export function PriceDisplay({
  product,
  currency,
  variant = 'card',
  className = '',
}: PriceDisplayProps) {
  if (!product.price_hidden) {
    // ── Normal price ─────────────────────────────────────────
    if (variant === 'detail') {
      return (
        <div className={`flex flex-col gap-0.5 ${className}`}>
          <span className="text-3xl font-black text-white tracking-tight">
            {formatPrice(product.price, product.price_usd, currency)}
          </span>
          {currency === 'DOP' && (
            <span className="text-slate-500 text-sm">
              ≈ $ {product.price_usd.toFixed(2)} USD
            </span>
          )}
        </div>
      );
    }

    if (variant === 'inline') {
      return (
        <span className={`font-bold text-white ${className}`}>
          {formatPrice(product.price, product.price_usd, currency)}
        </span>
      );
    }

    // card (default)
    return (
      <span className={`font-black text-white text-lg leading-none ${className}`}>
        {formatPrice(product.price, product.price_usd, currency)}
      </span>
    );
  }

  // ── Price hidden → WhatsApp CTA ──────────────────────────────
  const waUrl = buildWhatsAppUrl(product.name);

  if (variant === 'detail') {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 text-sm font-medium">Precio a consultar</span>
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[15px] px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-600/25 hover:-translate-y-0.5 w-fit"
        >
          <WhatsAppIcon className="w-5 h-5" />
          Más información en WhatsApp
        </a>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className={`inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors ${className}`}
      >
        <WhatsAppIcon className="w-3.5 h-3.5" />
        Consultar precio
      </a>
    );
  }

  // card (default)
  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-600/30 text-emerald-400 hover:text-emerald-300 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-200 ${className}`}
    >
      <WhatsAppIcon className="w-3.5 h-3.5 flex-shrink-0" />
      Más info en WhatsApp
    </a>
  );
}

// ── Tiny inline WhatsApp SVG (avoids lucide-react weight for this icon) ──────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ── Utility (use anywhere you need the formatted price string) ────────────────
export function getPriceLabel(product: Product, currency: Currency): string {
  if (product.price_hidden) return 'Consultar precio';
  return formatPrice(product.price, product.price_usd, currency);
}