import { FC, ReactNode } from "react";
import SwapVertIcon from '@mui/icons-material/SwapVert';

export interface Column {
  title: string | ReactNode;
  key: string;
  render?(value: any, row: Record<string, any>): ReactNode | string | number;
  sort?(key: string): void;
}

interface Props {
  columns: Array<Column>;
  data?: Array<Record<string, any>>;
  className: string;
  orderBy?: string;
}

const Table: FC<Props> = ({ columns, data, className, orderBy }) => {
  return (
    <div className='table--wrapper'>
      <div className='table--scroll'>
        <table className={`table ${className}`}>
          <thead className={`${className}__thead table__thead`}>
            <tr className={`${className}__thead__tr table__thead__tr`}>
              { 
                columns
                  .map(({ title, key, sort }) => 
                    <th
                      className={`${className}__thead__tr__th table__thead__tr__th ${className}__column--${key}`}
                    >
                      {!sort
                        ? title
                        : <>
                            <SwapVertIcon
                              className={
                                orderBy.includes(key)
                                ? orderBy.includes('DESC') ? 'cursor-pointer sort_desc' : 'cursor-pointer sort_asc'
                                : 'cursor-pointer'
                              }
                              onClick={() => {
                                sort(
                                  `${key}/${orderBy.includes(key) 
                                    ? orderBy.includes('DESC') ? 'RM' : 'DESC'
                                    : 'ASC'
                                }`);
                              }}
                            />
                            {title}
                          </>
                      }
                    </th>
                  )
              }
            </tr>
          </thead>
          <tbody className={`${className}__tbody table__tbody`}>
            {
            data?.length !== 0 && data
                .map(value => 
                  <tr className={`${className}__tbody__tr table__tbody__tr`}>
                    {
                      columns
                        .map(col => 
                          <td className={`${className}__tbody__tr__td table__tbody__tr__td ${className}__row--${col.key}`}>
                            {
                              col?.render
                              ? col?.render(value[col?.key], value)
                              : value[col?.key]
                            }
                          </td>
                        )
                    }
                  </tr>
                )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
};

export default Table;