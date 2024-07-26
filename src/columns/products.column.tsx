import { changeTimeZone } from "../utils/changeTimeZone";
import { Column } from "../components/Table";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { createElement } from "react";
import { Product } from "../types/product.type";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Props {
  select(e: boolean, id: string): void;
  edit(row: Product): void;
  sort(key: string): void;
}

const productsColumns: (value: Props) => Array<Column> = ({ select, edit, sort }) => {
  return [
    ...(select
      ? [{
          key: 'id',
          title: createElement(CheckBoxIcon),
          render: (value: string) => {
            
            return <input type='checkbox' onChange={e => select(e.target.checked, value)} />;
          }
        }]
      : []
    ),
    {
      key: 'name',
      title: 'Nome',
      sort,
    },
    {
      key: 'price',
      title: 'Preço',
      render: value => {
        return `R$ ${String(value.toFixed(2)).replace('.', ',')}`
      },
      sort,
    },
    {
      key: 'quantity',
      title: 'Quantidade',
      sort,
    },
    {
      key: 'category',
      title: 'Categoria',
      sort,
    },
    {
      key: 'Provider',
      title: 'Fornecedor',
      render: (value) => {
        return value?.name;
      },
    },
    {
      key: 'Provider',
      title: 'Código de pais',
      render: (value) => {
        return value?.country_code;
      }
    },
    {
      key: 'createdAt',
      title: 'Criado em',
      render: value => {
        return changeTimeZone(value);
      },
      sort,
    },
    {
      key: 'updatedAt',
      title: 'Atualizado em',
      render: value => {
        return changeTimeZone(value);
      },
      sort,
    },
    {
      key: 'id',
      title: createElement(DriveFileRenameOutlineIcon),
      render: (_, row) => {
        const onClick = () => edit(row as Product);
        
        return createElement(
          DriveFileRenameOutlineIcon, 
          { 
            onClick,
            className: 'cursor-pointer' 
          }
        )
      }
    }
  ];
} 

export {
  productsColumns,
}