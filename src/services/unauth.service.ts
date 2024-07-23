import app from "../config/axios";
import { Auth, Register } from "../types/auth.type";
import { unauthPath } from "../paths/unauth.path";

export const unauthService = {
  signin: async (data: Auth) => {
    try {
      const res = await app.post(unauthPath.signin, data);

      return res.data;
    } catch (e) {
      return e;
    }
  },
  signup: async (data: Register) => {
    try {
      const res = await app.post(unauthPath.signup, data);

      return res.data;
    } catch (e) {
      return e;
    }
  },
  refreshToken: async (refreshToken: string) => {
    try {
      const res = await app.post(unauthPath.refreshToken, { refreshToken });

      return res.data;
    } catch (e) {
      return e;
    }
  }
}