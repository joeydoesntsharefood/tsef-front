import { changeTimeZone } from "../utils/changeTimeZone";
import { Column } from "../components/Table";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { createElement } from "react";

const providersColumns: (edit: (id: string) => void) => Array<Column> = (edit) => {
  return [
    {
      key: 'name',
      title: 'Nome',
    },
    {
      key: 'country_code',
      title: 'Código do país',
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
  providersColumns,
}