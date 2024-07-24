import providerPath from "../paths/provider.path";
import app from "../config/axios";

const providerService = {
  find: async (params?: any) => {
    try {
      const res = await app.get(providerPath.find, { params });

      return res.data;
    } catch (err) {
      return err;
    }
  }
};

export default providerService;