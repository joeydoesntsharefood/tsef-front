import { createElement, useEffect, useState } from "react";
import { providersColumns } from "../columns/providers.column";
import Table from "../components/Table";
import { useLoad } from "../contexts/UseLoading";
import { Provider } from "../types/provider.type";
import { toast } from "react-toastify";
import providerService from "../services/provider.service";
import { Input } from "../components/Input";
import TuneIcon from '@mui/icons-material/Tune';
import Btn from "../components/Btn";
import t from "../translate";
import FormModal from "../components/FormModal";
import ProviderForm from "../components/ProviderForm";
import formatError from "../utils/formatError";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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

const Providers = () => {
  const [data, setData] = useState<Provider[]>([]);
  const [providerData, setProviderData] = useState<Partial<Provider>>(PROVIDER_DATA_INITIAL);
  const { boxedLoading, hideLoading } = useLoad();
  const [filters, setFilters] = useState(FILTERS_INITIAL_VALUE);
  const [showModal, setModal] = useState(false);
  const [typeForm, setTypeForm] = useState<'edit' | 'create'>('create');
  const [errors, setErrors] = useState<Record<string, string>>();
  const [select, setSelect] = useState<string[]>([]);

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
      const res = await providerService.find();

      if (!res?.success) 
        throw new Error(res?.message ?? 'Ocorreu um erro ao buscar os fornecedores.'); 
    
      setData(res?.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? 'Ocorreu um erro.');
    }
    showLoad && hideLoading()
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

  const handleFilters = (value: Partial<Filter>) =>
    setFilters(prev => ({ ...prev, ...value }));

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <FormModal
        onSubmit={typeForm === 'create' ? onInsertProvider : onEditProvider}
        onClose={handleShowModal}
        open={showModal}
        form={createElement(ProviderForm, { data: providerData, onChange: handleProvider, errors })}
        texts={textsModals[typeForm]}
      />

      <div className='provider-table'>
        <div className='provider-table__filters'>
          <Input.Text
            label="Busque por nome"
            name="name"
            value={filters}
            onChange={handleFilters}
          />

          <Btn
            size="sm"
            type="primary"
            onClick={() => {
              setProviderData(null);
              setTypeForm('create');
              handleShowModal();
            }}
          >
            {t('pages.providers.btns.create')}
          </Btn>

          <Btn
            size="sm"
            type="primary"
            disabled={select.length === 0}
            onClick={deleteMany}
          >
            <DeleteForeverIcon />
          </Btn>

          <Btn
            size="sm"
            type="primary"
          >
            <TuneIcon />
          </Btn>
        </div>

        <Table
          columns={providersColumns(handleSelect, edit)}
          data={data}
          className="provider-table__table"
        />
      </div>
    </>
  )
};

export default Providers;