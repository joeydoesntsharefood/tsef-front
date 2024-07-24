import { productsPath } from "../paths/products.path";
import app from "../config/axios";

const productsService = {
  find: async (params?: any) => {
    try {
      const res = await app.get(productsPath.find, { params });
      
      return res.data;
    } catch (e) {
      return e;
    }
  }
};

export default productsService;