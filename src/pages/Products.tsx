import { useEffect, useState } from "react";
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

const Products = () => {
  const [data, setData] = useState<Provider[]>([]);
  const { boxedLoading, hideLoading } = useLoad();
  const [filters, setFilters] = useState(FILTERS_INITIAL_VALUE);

  const getData = async () => {
    boxedLoading('Carregando os seus dados');
    try {
      const res = await productService.find();

      if (!res?.success) 
        throw new Error(res?.message ?? 'Ocorreu um erro ao buscar os fornecedores.'); 
    
      setData(res?.data);
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? 'Ocorreu um erro.');
    }
    hideLoading()
  };

  const edit = (id: string) => {
    console.log(id);
  };

  const handleFilters = (value: Partial<Filter>) =>
    setFilters(prev => ({ ...prev, ...value }));

  useEffect(() => {
    getData();
  }, []);

  return (
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
        columns={productsColumns(edit)}
        data={data}
        className="products-table__table"
      />
    </div>
  )
};

export default Products;