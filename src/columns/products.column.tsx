import { changeTimeZone } from "../utils/changeTimeZone";
import { Column } from "../components/Table";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { createElement } from "react";
import { Product } from "../types/product.type";

const productsColumns: (select: (e: boolean, id: string) => void, edit: (id: Product) => void) => Array<Column> = (select, edit) => {
  return [
    ...(select
      ? [{
          key: 'id',
          title: 'Selecionar',
          render: (value: string) => {
            
            return <input type='checkbox' onChange={e => select(e.target.checked, value)} />;
          }
        }]
      : []
    ),
    {
      key: 'name',
      title: 'Nome',
    },
    {
      key: 'price',
      title: 'Preço',
    },
    {
      key: 'quantity',
      title: 'Quantidade',
    },
    {
      key: 'category',
      title: 'Categoria',
    },
    {
      key: 'Provider',
      title: 'Fornecedor',
      render: (value) => {
        return value?.name;
      }
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
      } 
    },
    {
      key: 'updatedAt',
      title: 'Atualizado em',
      render: value => {
        return changeTimeZone(value);
      }
    },
    {
      key: 'id',
      title: 'Editar',
      render: (id) => {
        const onClick = () => edit(id);
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