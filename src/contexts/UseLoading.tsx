import { Modal } from '@mui/material';
import { createContext, useState, useContext, ReactNode, FC, useMemo } from 'react';
import LinearProgress from '@mui/material/LinearProgress'; 

interface ContextProps {
  hasLoading: boolean;
  boxedLoading(message?: string): void;
  hideLoading(): void;
}

const Context = createContext<ContextProps | undefined>(undefined);

export const LoadingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>();

  const value = useMemo<ContextProps>(() => ({
    hasLoading: loading,
    boxedLoading: (value?: string) => {
      setLoading(true);
      setMessage(value ?? null);
    },
    hideLoading: () => {
      setLoading(false);
      setMessage(null);
    }
  }), [])

  return (
    <Context.Provider value ={value}>
      {children}

      <Modal
        open={loading}
      >
        <div className='bg-neutral-light loading__modal'>
          <p className='text-xs'>{message ?? 'Carregando...'}</p>
          <LinearProgress color='primary' />
        </div>
      </Modal>
    </Context.Provider>
  )
};

export const useLoad = () => useContext(Context);