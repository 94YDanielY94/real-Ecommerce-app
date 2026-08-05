export interface ProductImage {
  id: string;
  image_url: string;
  product_id: string;
  is_primary?: boolean;
  created_at?: Date;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock_quantity: number;
  brand: string;
  specifications: Record<string, unknown>;
  is_active: boolean;
  created_at: Date;
  product_images: ProductImage[];
  reviews?: Review[];
}

export interface ReviewUser {
  id: string;
  first_name: string;
  last_name: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: Date | string | null;
  users?: ReviewUser;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
}

export type User = {
  id: string; // uuid
  email: string;
  password_hash: string;
  google_id?: string | null;
  first_name: string;
  last_name: string;
  phone?: string | null;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
};

export type SessionUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
};
