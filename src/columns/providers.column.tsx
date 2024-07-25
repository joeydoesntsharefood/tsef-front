import { changeTimeZone } from "../utils/changeTimeZone";
import { Column } from "../components/Table";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { createElement } from "react";
import { Provider } from "../types/provider.type";

const providersColumns: (select: (e: boolean, id: string) => void, edit: (id: Provider) => void) => Array<Column> = 
  (select, edit) => {
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
        render: (_, row) => {
          const onClick = () => edit(row as Provider);
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