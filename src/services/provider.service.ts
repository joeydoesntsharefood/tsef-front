import providerPath from "../paths/provider.path";
import app from "../config/axios";
import { Provider } from "../types/provider.type";

const providerService = {
  find: async (params?: any) => {
    try {
      const res = await app.get(providerPath.find, { params });

      return res.data;
    } catch (err) {
      return err;
    }
  },
  create: async (data: Partial<Provider>, params?: any) => {
    try {
      const res = await app.post(providerPath.create, data, { params });

      return res.data;
    } catch (err) {
      return err?.response?.data;
    }
  },
  delete: async (id: string, params?: any) => {
    try {
      const endPoint = providerPath.delete.replace(':id', id);
      const res = await app.delete(endPoint, { params });

      return res.data;
    } catch (err) {
      return err?.response?.data;
    }
  },
  edit: async (id: string, data: Partial<Provider>, params?: any) => {
    try {
      const endPoint = providerPath.edit.replace(':id', id);
      const res = await app.patch(endPoint, data, { params });

      return res.data;
    } catch (err) {
      return err?.response?.data;
    }
  }
};

export default providerService;