import { createElement, useEffect, useState } from "react";
import { providersColumns } from "../columns/providers.column";
import Table from "../components/Table";
import { useLoad } from "../contexts/UseLoading";
import { Provider } from "../types/provider.type";
import { toast } from "react-toastify";
import providerService from "../services/provider.service";
import TuneIcon from '@mui/icons-material/Tune';
import Btn from "../components/Btn";
import t from "../translate";
import FormModal from "../components/FormModal";
import ProviderForm from "../components/ProviderForm";
import formatError from "../utils/formatError";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Badge, MenuItem, Pagination, Select } from "@mui/material";
import { IPagination } from "../types/globals";
import ProviderFilter, { IProviderFilter } from "../components/ProviderFilter";

const FILTERS_INITIAL_VALUE: IProviderFilter = {
  name: '',
  country_code: '',
};

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

const PROVIDER_DATA_INITIAL: Partial<Provider> = {
  country_code: '',
  name: '',
};

const INITIAL_PAGINATION_VALUE: IPagination = {
  page: 1,
  pageSize: 10,
  totalDocs: 0,
  totalPages: 0, 
};

const Providers = () => {
  const [data, setData] = useState<Provider[]>([]);
  const [providerData, setProviderData] = useState<Partial<Provider>>(PROVIDER_DATA_INITIAL);
  const { boxedLoading, hideLoading } = useLoad();
  const [filters, setFilters] = useState(FILTERS_INITIAL_VALUE);
  const [showModal, setModal] = useState(false);
  const [typeForm, setTypeForm] = useState<'edit' | 'create'>('create');
  const [errors, setErrors] = useState<Record<string, string>>();
  const [select, setSelect] = useState<string[]>([]);
  const [pagination, setPagination] = useState<IPagination>(INITIAL_PAGINATION_VALUE);
  const [sort, setSort] = useState<string>('');
  const [country_codes, setCountry_codes] = useState<{ label: string, value: string }[]>([]);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const handleShowFilterModal = () => setShowFilterModal(prev => !prev);

  const handlePagination = (value: Partial<IPagination>) => 
    setPagination(prev => ({ ...prev, ...value }));

  const handleSelect = (insert: boolean, value: string) => {
    if (insert) setSelect(prev => [...prev, value]); 
    else 
      setSelect(prev => prev.filter(id => id !== value));
  }

  const handleShowModal = () => setModal(prev => !prev);

  const handleProvider = (value: Partial<Provider>) =>
    setProviderData(prev => ({ ...prev, ...value }));

  const getData = async (showLoad: boolean = true) => {
    showLoad && boxedLoading('Carregando os seus dados');
    try {
      const params = {
        ...pagination,
        ...(filters?.name && filters.name.length !== 0 ? { name: filters.name } : {}),
        ...(filters?.country_code && filters.country_code.length !== 0 ? { country_code: filters.country_code } : {}),
      };

      const res = await providerService.find(params);

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

  const onInsertProvider = async () => {
    boxedLoading('Criando o seu fornecedor.');

    const res = await providerService.create(providerData);

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

  const onEditProvider = async () => {
    boxedLoading('Editando o seu fornecedor.');

    const res = await providerService.edit(providerData?.id, providerData);

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

  const edit = (data: Provider) => {
    setErrors(null);
    setProviderData(data);
    setTypeForm('edit');
    handleShowModal();
  };
  
  const deleteMany = async () => {
    boxedLoading(`Deletando fornecedor${select.length > 1 ? 'es' : ''}`);
    for await (const id of select) {
      try {
        const res = await providerService.delete(id);

        console.log(res)
      } catch (e) {
        toast.error(e);
      }
    }

    await getData();
    hideLoading();
  }

  const handleFilters = (value: Partial<IProviderFilter>) =>
    setFilters(prev => ({ ...prev, ...value }));

  useEffect(() => {
    getCountryCodes();
    getData();
  }, []);

  return (
    <>
      <FormModal
        texts={{
          confirm: 'Buscar',
          title: 'Filtros',
          cancel: 'Limpar filtros'
        }}
        form={createElement(ProviderFilter, {
          data: filters,
          onChange: handleFilters,
          options: country_codes,
        })}
        onClose={handleShowFilterModal}
        onCancel={() => {
          handleFilters(FILTERS_INITIAL_VALUE);
        }}
        onSubmit={async () => {
          await getData(true);
          handleShowFilterModal();
        }}
        open={showFilterModal}
      />

      <FormModal
        onSubmit={typeForm === 'create' ? onInsertProvider : onEditProvider}
        onClose={handleShowModal}
        open={showModal}
        form={createElement(ProviderForm, { data: providerData, onChange: handleProvider, errors })}
        texts={textsModals[typeForm]}
      />

      <div className='provider-table'>
        <div className='provider-table__filters'>
          <div className='provider-table__filters__actions'>
            <Btn
              size="sm"
              type="primary"
              onClick={() => {
                setErrors(null);
                setProviderData(null);
                setTypeForm('create');
                handleShowModal();
              }}
            >
              {t('pages.providers.btns.create')}
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
          columns={providersColumns({
            select: handleSelect,
            edit,
            sort: handleSort,
          })}
          data={data}
          className="provider-table__table"
          orderBy={sort}
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

export default Providers;