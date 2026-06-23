export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  category: string;
  price: number;
  image: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { nameEn: string; nameAr: string };
}

export interface Order {
  id: string;
  user: { id: string; name: string; email: string };
  address: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}
