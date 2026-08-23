import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { PRODUCTS } from '@/data/products';

const CUSTOM_PRODUCTS_KEY = 'tajie_custom_products';
const WISHLIST_KEY = 'tajie_user_wishlist';

/** Get all products (default + custom user added) */
export function getAllProducts(): Product[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    const custom: Product[] = raw ? JSON.parse(raw) : [];
    return [...custom, ...PRODUCTS];
  } catch {
    return PRODUCTS;
  }
}

/** Add a new product to local store */
export function saveCustomProduct(product: Product): void {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    const custom: Product[] = raw ? JSON.parse(raw) : [];
    const updated = [product, ...custom.filter((p) => p.id !== product.id)];
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tajie_products_updated'));
  } catch (err) {
    console.error('Failed to save product', err);
  }
}

/** Delete a custom product */
export function deleteCustomProduct(productId: string): void {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    const custom: Product[] = raw ? JSON.parse(raw) : [];
    const updated = custom.filter((p) => p.id !== productId);
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tajie_products_updated'));
  } catch (err) {
    console.error('Failed to delete product', err);
  }
}

/** React hook for live products list */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>(getAllProducts);

  useEffect(() => {
    const update = () => setProducts(getAllProducts());
    window.addEventListener('tajie_products_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('tajie_products_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return products;
}

/** Get wishlist IDs */
export function getWishlistIds(): string[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Toggle item in wishlist */
export function toggleWishlist(productId: string): boolean {
  try {
    const current = getWishlistIds();
    const exists = current.includes(productId);
    const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('tajie_wishlist_updated'));
    return !exists;
  } catch {
    return false;
  }
}

/** React hook for live wishlist */
export function useWishlist(): string[] {
  const [wishlist, setWishlist] = useState<string[]>(getWishlistIds);

  useEffect(() => {
    const update = () => setWishlist(getWishlistIds());
    window.addEventListener('tajie_wishlist_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('tajie_wishlist_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return wishlist;
}
