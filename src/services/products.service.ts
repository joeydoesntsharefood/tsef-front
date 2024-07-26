import { productsPath } from "../paths/products.path";
import app from "../config/axios";
import { Product } from "../types/product.type";

const productsService = {
  find: async (params?: any) => {
    try {
      const res = await app.get(productsPath.find, { params });

      return res.data;
    } catch (err) {
      return err;
    }
  },
  count: async (params?: any) => {
    try {
      const res = await app.get(productsPath.count, { params });

      return res.data;
    } catch (err) {
      return err;
    }
  },
  create: async (data: Partial<Product>, params?: any) => {
    try {
      const res = await app.post(productsPath.create, data, { params });

      return res.data;
    } catch (err) {
      return err?.response?.data;
    }
  },
  delete: async (id: string, params?: any) => {
    try {
      const endPoint = productsPath.delete.replace(':id', id);
      const res = await app.delete(endPoint, { params });

      return res.data;
    } catch (err) {
      return err?.response?.data;
    }
  },
  edit: async (id: string, data: Partial<Product>, params?: any) => {
    try {
      const endPoint = productsPath.edit.replace(':id', id);
      const res = await app.patch(endPoint, data, { params });

      return res.data;
    } catch (err) {
      return err?.response?.data;
    }
  }
};

export default productsService;