import { productsPath } from "../paths/products.path";
import app from "../config/axios";

export const productsService = {
  find: async () => {
    try {
      const res = await app.get(productsPath.find);
      
      return res.data;
    } catch (e) {
      return e;
    }
  }
}