import { createElement, useEffect, useState } from "react";
import { productsColumns } from "../columns/products.column";
import Table from "../components/Table";
import { useLoad } from "../contexts/UseLoading";
import { Provider } from "../types/provider.type";
import { toast } from "react-toastify";
import productService from "../services/products.service";
import { Input } from "../components/Input";
import TuneIcon from '@mui/icons-material/Tune';
import Btn from "../components/Btn";
import t from "../translate";
import ProductForm from "../components/ProductForm";
import FormModal from "../components/FormModal";
import { Product } from "../types/product.type";
import formatError from "../utils/formatError";
import productsService from "../services/products.service";
import providerService from "../services/provider.service";

interface Filter {
  name: string,
  country_code: string,
  createdAt: {
    start: string,
    end: string,
  },
  updatedAt: {
    start: string,
    end: string,
  },
}

const FILTERS_INITIAL_VALUE: Filter = {
  name: undefined,
  country_code: undefined,
  createdAt: {
    start: undefined,
    end: undefined,
  },
  updatedAt: {
    start: undefined,
    end: undefined,
  },
}

const textsModals = {
  'edit': {
    title: 'Editar fornecedor',
    confirm: 'Editar'
  },
  'create': {
    title: 'Criar fornecedor',
    confirm: 'Criar'
  }
};

const PRODUCT_DATA_INITIAL: Partial<Product> = {
  name: '',
  description: '',
  category: '',
  price: 0,
  quatity: 0,
};

const Products = () => {
  const [data, setData] = useState<Product[]>([]);
  const { boxedLoading, hideLoading } = useLoad();
  const [productData, setProductData] = useState<Partial<Product>>(PRODUCT_DATA_INITIAL);
  const [filters, setFilters] = useState(FILTERS_INITIAL_VALUE);
  const [showModal, setModal] = useState(false);
  const [typeForm, setTypeForm] = useState<'edit' | 'create'>('create');
  const [errors, setErrors] = useState<Record<string, string>>();
  const [select, setSelect] = useState<string[]>([]);
  const [providerOptions, setProviderOptions] = useState<{ value: string, label: string }[]>([]);

  const handleSelect = (insert: boolean, value: string) => {
    if (insert) setSelect(prev => [...prev, value]); 
    else 
      setSelect(prev => prev.filter(id => id !== value));
  };

  const handleShowModal = () => setModal(prev => !prev);

  const handleProduct = (value: Partial<Product>) =>
    setProductData(prev => ({ ...prev, ...value }));

  const getData = async (showLoad: boolean = true) => {
    showLoad && boxedLoading('Carregando os seus dados');
    try {
      const res = await productService.find();

      if (!res?.success) 
        throw new Error(res?.message ?? 'Ocorreu um erro ao buscar os fornecedores.'); 
    
      setData(res?.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? 'Ocorreu um erro.');
    }
    showLoad && hideLoading()
  };

  const handleFilters = (value: Partial<Filter>) =>
    setFilters(prev => ({ ...prev, ...value }));

  const getProviders = async () => {
    try {
      const res = await providerService.find();

      if (!res?.success)
        throw new Error(res?.data ?? 'Não foi possível encontrar os fornecedores.');

      setProviderOptions(res?.data.map(({ id, name }) => ({ value: id, label: name })));
    } catch (err) {
      toast.error(err?.message ?? 'Ocorreu um erro.');
    }
  };

  useEffect(() => {
    getData();
    getProviders();
  }, []);

  const onInsertProvider = async () => {
    boxedLoading('Criando o seu fornecedor.');

    const res = await productService.create(productData);

    if (!res?.success) {
      setErrors(formatError(res?.error));
      toast.error(res?.message ?? 'Ocorreu um erro ao criar o fornecedor'); 
    } else {
      await getData(false);
      
      
      handleShowModal();
      
      toast.success('Fornecedor criado com sucesso!');
    }

    hideLoading();
  };

  const onEditProvider = async () => {
    boxedLoading('Editando o seu fornecedor.');

    const res = await productService.edit(productData?.id, productData);

    if (!res?.success) {
      setErrors(formatError(res?.error));
      toast.error(res?.message ?? 'Ocorreu um erro ao editar o fornecedor'); 
    } else {
      await getData(false);
      
      
      handleShowModal();
      
      toast.success('Fornecedor editado com sucesso!');
    }

    hideLoading();
  };

  const edit = (data: Product) => {
    setProductData(data);
    setTypeForm('edit');
    handleShowModal();
  };

  const deleteMany = async () => {
    boxedLoading(`Deletando fornecedor${select.length > 1 ? 'es' : ''}`);
    for await (const id of select) {
      try {
        const res = await productsService.delete(id);

        console.log(res)
      } catch (e) {
        toast.error(e);
      }
    }

    await getData();
    hideLoading();
  }

  return (
    <>
      <FormModal
        onSubmit={typeForm === 'create' ? onInsertProvider : onEditProvider}
        onClose={handleShowModal}
        open={showModal}
        form={
          createElement(
            ProductForm, 
            { 
              data: productData,
              onChange: handleProduct,
              errors,
              providerOptions 
            }
          )
        }
        texts={textsModals[typeForm]}
      />

      <div className='products-table'>
        <div className='products-table__filters'>
          <Input.Text
            label="Busque por nome"
            name="name"
            value={filters}
            onChange={handleFilters}
          />

          <Btn
            size="sm"
            type="primary"
            onClick={handleShowModal}
          >
            {t('pages.products.btns.create')}
          </Btn>

          <Btn
            size="sm"
            type="primary"
          >
            <TuneIcon />
          </Btn>
        </div>

        <Table
          columns={productsColumns(handleSelect, edit)}
          data={data}
          className="products-table__table"
        />
      </div>
    </>
  )
};

export default Products;