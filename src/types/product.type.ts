import { Provider } from "./provider.type";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  quatity: number;
  category: string;
  providerId?: string;
  Provider?: Provider;
  createdAt: string;
  updatedAt: string;
}