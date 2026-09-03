export type Category = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: "shield" | "flame" | "camera" | "battery" | "scan" | "radio" | "tool";
  count: number;
  subcategories: string[];
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  reference: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  vatRate: number;
  stock: "available" | "limited" | "unavailable";
  stockLabel: string;
  image: string;
  gallery: string[];
  badge?: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  isNew?: boolean;
  description: string;
  features: string[];
  specs: Record<string, string>;
};

export type CartLine = {
  product: Product;
  quantity: number;
};
