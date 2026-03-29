// ── Core domain types ─────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_usd: number;
  /** When true, hide the price and show a "Más información en WhatsApp" CTA */
  price_hidden: boolean;
  category: string;
  image: string;
  stock: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  price_usd: number;
  image: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  items: OrderItem[];
  total: number;
  total_usd: number;
  currency: 'DOP' | 'USD';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shipping_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
  created_at?: string;
}

export type Currency = 'DOP' | 'USD';

// ── Categories (static reference list) ───────────────────────────────────────

export const CATEGORIES = [
  { id: 'seguridad',     name: 'Seguridad Industrial', slug: 'seguridad',     image: '/products/001_cascos_de_protección.jpg' },
  { id: 'electricidad',  name: 'Electricidad',         slug: 'electricidad',  image: '/products/003_bombillos_halógenos_gu10.jpg' },
  { id: 'herramientas',  name: 'Herramientas',         slug: 'herramientas',  image: '/products/064_todo_tipo_de_herramientas.jpg' },
  { id: 'plomeria',      name: 'Plomería',             slug: 'plomeria',      image: '/products/016_ducha_de_mano.jpg' },
  { id: 'limpieza',      name: 'Limpieza',             slug: 'limpieza',      image: '/products/009_escobas.jpg' },
  { id: 'papeleria',     name: 'Papelería',            slug: 'papeleria',     image: '/products/050_rollo_de_servilletas_junior.jpg' },
  { id: 'construccion',  name: 'Construcción',         slug: 'construccion',  image: '/products/051_cemento_blanco.jpg' },
  { id: 'automotriz',    name: 'Automotriz',           slug: 'automotriz',    image: '/products/014_espejo_inteligente_para_vehículos.jpg' },
  { id: 'tecnologia',    name: 'Tecnología',           slug: 'tecnologia',    image: '/products/060_tarjeta_de_memoria_64gb.jpg' },
  { id: 'hogar',         name: 'Hogar',                slug: 'hogar',         image: '/products/008_glade_aromatizante.jpg' },
] as const;

// ── Seed / fallback data (used before Supabase responds) ─────────────────────
// Keep price_hidden: false for all seed products
export const PRODUCTS_DATA: Product[] = [
  {
    id: '1',
    name: 'Cascos de Protección',
    description: 'Cascos de seguridad industrial resistentes a impactos, cumplen con normas internacionales de seguridad.',
    price: 850, price_usd: 14.50, price_hidden: false,
    category: 'seguridad', image: '/products/001_cascos_de_protección.jpg',
    stock: 50, available: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Gorritos Desechables',
    description: 'Gorros desechables para protección en ambientes de trabajo, cocina o limpieza. Paquete de 100 unidades.',
    price: 350, price_usd: 6.00, price_hidden: false,
    category: 'seguridad', image: '/products/002_gorritos_desechables.jpg',
    stock: 100, available: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Bombillos Halógenos GU10',
    description: 'Bombillos halógenos GU10 de 35W, luz cálida ideal para iluminación interior.',
    price: 125, price_usd: 2.15, price_hidden: false,
    category: 'electricidad', image: '/products/003_bombillos_halógenos_gu10.jpg',
    stock: 200, available: true,
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
];