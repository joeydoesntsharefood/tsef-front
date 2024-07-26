import { createElement, useEffect, useState } from "react";
import { productsColumns } from "../columns/products.column";
import Table from "../components/Table";
import { useLoad } from "../contexts/UseLoading";
import { toast } from "react-toastify";
import productService from "../services/products.service";
import TuneIcon from '@mui/icons-material/Tune';
import Btn from "../components/Btn";
import t from "../translate";
import ProductForm from "../components/ProductForm";
import FormModal from "../components/FormModal";
import { Product } from "../types/product.type";
import formatError from "../utils/formatError";
import productsService from "../services/products.service";
import providerService from "../services/provider.service";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Badge, MenuItem, Pagination, Select } from "@mui/material";
import { IPagination } from "../types/globals";
import ProductFilter, { IProductFilter } from "../components/ProductFilter";

const FILTERS_INITIAL_VALUE: IProductFilter = {
  name: '',
  country_code: '',
  priceEnd: 0,
  priceStart: 0,
  providerId: '',
  quantityEnd: 0,
  quantityStart: 0,
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
  quantity: 0,
};

const INITIAL_PAGINATION_VALUE: IPagination = {
  page: 1,
  pageSize: 10,
  totalDocs: 0,
  totalPages: 0, 
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
  const [pagination, setPagination] = useState<IPagination>(INITIAL_PAGINATION_VALUE);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [country_codes, setCountry_codes] = useState<{ value: string, label: string }[]>([]);
  const [sort, setSort] = useState<string>('');

  const handleShowFilterModal = () =>
    setShowFilterModal(prev => !prev);

  const handlePagination = (value: Partial<IPagination>) => 
    setPagination(prev => ({ ...prev, ...value }));

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
      const params = { 
        ...pagination,
        ...(sort ? { sort } : {}),
        ...(filters?.name && filters?.name.length !== 0 ? { name: filters?.name } : {}),
        ...(filters?.country_code && filters?.country_code.length !== 0 ? { country_code: filters?.country_code } : {}),
        ...(filters?.priceEnd && filters?.priceEnd !== 0 ? { priceEnd: filters?.priceEnd } : {}),
        ...(filters?.priceStart && filters?.priceStart !== 0 ? { priceStart: filters?.priceStart } : {}),
        ...(filters?.providerId && filters?.providerId.length !== 0 ? { providerId: filters?.providerId } : {}),
        ...(filters?.quantityEnd && filters?.quantityEnd !== 0 ? { quantityEnd: filters?.quantityEnd } : {}),
        ...(filters?.quantityStart && filters?.quantityStart !== 0 ? { quantityStart: filters?.quantityStart } : {}),
      };

      const res = await productService.find(params);

      if (!res?.success) 
        throw new Error(res?.message ?? 'Ocorreu um erro ao buscar os fornecedores.'); 
    
      setData(res?.data?.data);
      setPagination(res?.data?.pagination);
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? 'Ocorreu um erro.');
    }
    showLoad && hideLoading()
  };

  const handleSort = async (value: string) => {
    if (!value.includes('RM')) setSort(value);
    else setSort('');
    await getData();
  };

  const handleFilters = (value: Partial<IProductFilter>) =>
    setFilters(prev => ({ ...prev, ...value }));

  const getProviders = async () => {
    try {
      const res = await providerService.find();

      if (!res?.success)
        throw new Error(res?.data ?? 'Não foi possível encontrar os fornecedores.');

      setProviderOptions(res?.data?.data.map(({ id, name }) => ({ value: id, label: name })));
    } catch (err) {
      toast.error(err?.message ?? 'Ocorreu um erro.');
    }
  };

  const getCountryCodes = async () => {
    try {
      const res = await providerService.country_codes();

      if (!res?.success)
        throw new Error(res?.data ?? 'Não foi possível encontrar os códigos de area de fornecedores.');

      setCountry_codes(res?.data.map((value: string) => ({ value, label: value })));
    } catch (err) {
      toast.error(err?.message ?? 'Ocorreu um erro.');
    }
  };

  useEffect(() => {
    getData();
  }, [pagination.page, pagination.pageSize])

  useEffect(() => {
    getProviders();
    getCountryCodes();
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
    setErrors(null);
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
        onSubmit={async () => {
          await getData(true);
          handleShowFilterModal();
        }}
        onClose={handleShowFilterModal}
        open={showFilterModal}
        onCancel={() => {
          handleFilters(FILTERS_INITIAL_VALUE);
        }}
        form={
          createElement(
            ProductFilter,
            {
              providers: providerOptions,
              onChange: handleFilters,
              value: filters,
              country_codes,
            },
          )
        }
        texts={{
          title: 'Filtros',
          confirm: 'Buscar',
          cancel: 'Limpar filtros'
        }}
      />

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
          <div className='products-table__filters__actions'>
            <Btn
              size="sm"
              type="primary"
              onClick={() => {
                setErrors(null);
                setProductData(PRODUCT_DATA_INITIAL);
                setTypeForm('create');
                handleShowModal();
              }}
            >
              {t('pages.products.btns.create')}
            </Btn>

            <Badge color="primary" badgeContent={select.length}>
              <Btn
                size="sm"
                type="primary"
                disabled={select.length === 0}
                onClick={deleteMany}
              >
                <DeleteForeverIcon />
              </Btn>
            </Badge>

            <Btn
              size="sm"
              type="primary"
              onClick={handleShowFilterModal}
            >
              <TuneIcon />
            </Btn>
          </div>
        </div>

        <Table
          columns={productsColumns({
            select: handleSelect,
            edit,
            sort: handleSort,
          })}
          orderBy={sort}
          data={data}
          className="products-table__table"
        />

        <div className='full-width flex items-center'>
          <Pagination
            page={pagination.page}
            count={pagination.totalPages}
            onChange={async (_, page) => {
              handlePagination({ page });
            }}
          />

          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={pagination.pageSize}
            onChange={e => handlePagination({ pageSize: Number(e.target.value) })}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </div>
      </div>
    </>
  )
};

export default Products;