import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import productsService from "../services/products.service";
import providerService from "../services/provider.service";

const COUNTS_INITIAL_VALUE: { providers: number, products: number } = {
  products: 0,
  providers: 0,
}

const Infos = () => {
  const [counts, setCounts] = useState(COUNTS_INITIAL_VALUE);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await productsService.count();

        setCounts(prev => ({ ...prev, products: res?.data }));
      } catch (e) {
        toast.error(e?.message ?? 'Ocorreu um erro.');
      }
    }

    const getProviders = async () => {
      try {
        const res = await providerService.count();

        setCounts(prev => ({ ...prev, providers: res?.data }));
      } catch (e) {
        toast.error(e?.message ?? 'Ocorreu um erro.');
      }
    }

    getProducts();
    getProviders();
  }, []);

  return (
    <div className='flex-col'>
      <p className='text-xxxl'>{counts.products} produto{counts.products > 1 ? 's' : ''}</p>
      <p className='text-xxxl'>{counts.providers} fornecedor{counts.providers > 1 ? 'es' : ''}</p>
    </div>
  );
};

export default Infos;