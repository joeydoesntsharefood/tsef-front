import { changeTimeZone } from "../utils/changeTimeZone";
import { Column } from "../components/Table";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { createElement } from "react";
import { Provider } from "../types/provider.type";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Props {
  select(e: boolean, id: string): void;
  edit(id: Provider): void;
  sort(value: string): void;
} 

const providersColumns: (props: Props) => Array<Column> = 
  ({ select, edit, sort }) => {
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
        key: 'country_code',
        title: 'Código do país',
        sort,
      },
      {
        key: 'createdAt',
        title: 'Criado em',
        render: value => {
          return changeTimeZone(value);
        },
        sort
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