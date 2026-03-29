import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Copy .env.example → .env and fill in your credentials.'
  );
}

// ── Database type definitions ──────────────────────────────
export type ProductRow = {
  id: string;
  name: string;
  description: string;
  price: number;
  price_usd: number;
  price_hidden: boolean;
  category: string;
  image: string;
  stock: number;
  available: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, 'id' | 'created_at' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<ProductRow, 'id' | 'created_at'>>;
      };
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProfileRow, 'id' | 'created_at'>>;
      };
    };
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// ── Storage helpers ────────────────────────────────────────
export const STORAGE_BUCKET = 'product-images';

/**
 * Upload an image file → returns the public URL or throws.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

/**
 * Delete an image by its public URL (no-op if URL is not from Storage).
 */
export async function deleteProductImage(publicUrl: string): Promise<void> {
  if (!publicUrl.includes(STORAGE_BUCKET)) return;
  const path = publicUrl.split(`${STORAGE_BUCKET}/`)[1];
  if (path) await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}