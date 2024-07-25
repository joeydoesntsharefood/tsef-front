import { User } from '../types/user.types';
import { Auth, Register } from '../types/auth.type';
import { createContext, useState, useContext, ReactNode, FC, useMemo, useEffect } from 'react';
import { unauthService } from '../services/unauth.service';
import { toast } from 'react-toastify';

interface ContextProps {
  isAuth: boolean;
  signin: (data: Auth) => Promise<boolean>;
  signout: () => Promise<boolean>;
  signup: (data: Register) => Promise<boolean>;
  user?: User;
  getAuthenticate(): Promise<boolean>;
}

const Context = createContext<ContextProps | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>();

  const getRefreshToken = async (value: string) => {
    const res = await toast.promise<any>(unauthService.refreshToken(value), {
    error: 'Ocorreu um erro ao verificar o seu acesso anterior.',
    pending: 'Estamos verificando o seu acesso anterior.',
    success: 'Verificamos o seu acesso anterior!'
    });

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

  const getAuthenticate = async () => {
    const refreshToken = window.localStorage.getItem('refreshToken');

    if (!user?.id && refreshToken !== null) {
      await getRefreshToken(refreshToken);
      
      return true;
    }

    return false;
  };

  useEffect(() => {
    getAuthenticate();
  }, [user?.id]);


  const signin = async (data: Auth) => {
    const res =  await unauthService.signin(data)
      

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
    getAuthenticate,
  }), [user]);

  return (
    <Context.Provider value ={value}>
      {children}
    </Context.Provider>
  )
};

export const useAuth = () => useContext(Context);