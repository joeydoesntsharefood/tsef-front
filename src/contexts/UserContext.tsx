import { User } from '../types/user.types';
import { Auth, Register } from '../types/auth.type';
import { createContext, useState, useContext, ReactNode, FC, useMemo, useEffect } from 'react';
import { unauthService } from '../services/unauth.service';
import { toast } from 'react-toastify';

interface ContextProps {
  isAuth: boolean;
  signin: (data: Auth) => Promise<boolean>;
  signout: () => Promise<boolean>;
  signup: (data: Register) => Promise<any>;
  user?: User;
}

const Context = createContext<ContextProps | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>();

  const getRefreshToken = async (value: string) => {
    const res = await unauthService.refreshToken(value);

    setUser(res?.data?.user);
    
    window.localStorage.setItem(
      'accessToken', 
      res?.data?.tokens?.accessToken?.token
    );

    window.localStorage.setItem(
      'refreshToken', 
      res?.data?.tokens?.refreshToken?.token
    );
  } 

  useEffect(() => {
    const refreshToken = window.localStorage.getItem('refreshToken');

    if (!user?.id && refreshToken) {
      getRefreshToken(refreshToken);
    }
  }, [user?.id])

  const signin = async (data: Auth) => {
    const res = await unauthService.signin(data);

    if (!res?.success) {
      toast.error('Ocorreu um erro.');
      return false
    }

    setUser(res?.data?.user);
    
    window.localStorage.setItem(
      'accessToken', 
      res?.data?.tokens?.accessToken?.token
    );

    window.localStorage.setItem(
      'refreshToken', 
      res?.data?.tokens?.refreshToken?.token
    );

    toast.success('Seu acesso foi autenticado.');
    return true;
  };

  const signout = async () => {
    setUser(null);
    toast.success('Você saiu da plataforma.');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
    return true;
  };

  const signup = async (data: Register) => {
    const res = await unauthService.signup(data);

    if (!res?.success) {
      toast.error('Ocorreu um erro.');
      return res?.data;
    }

    setUser(res?.data?.user);
    
    window.localStorage.setItem(
      'accessToken', 
      res?.data?.tokens?.accessToken?.token
    );

    window.localStorage.setItem(
      'refreshToken', 
      res?.data?.tokens?.refreshToken?.token
    );
    
    toast.success('Seu cadastro foi executado.');
    
    return true;
  };

  const value = useMemo<ContextProps>(() => ({
    isAuth: Boolean(user?.id),
    signin,
    signout,
    user,
    signup,
  }), [user]);

  return (
    <Context.Provider value ={value}>
      {children}
    </Context.Provider>
  )
};

export const useAuth = () => useContext(Context);