import { FC, ReactNode } from "react";

export interface Column {
  title: string;
  key: string;
  render?(value: any, row: Record<string, any>): ReactNode | string | number;
}

interface Props {
  columns: Array<Column>;
  data?: Array<Record<string, any>>;
  className: string;
}

const Table: FC<Props> = ({ columns, data, className }) => {
  return (
    <table className={`table ${className}`}>
      <thead className={`${className}__thead table__thead`}>
        <tr className={`${className}__thead__tr table__thead__tr`}>
          { 
            columns
              .map(({ title, key }) => 
                <th
                  className={`${className}__thead__tr__th table__thead__tr__th ${className}__column--${key}`}
                >
                  {title}
                </th>
              )
          }
        </tr>
      </thead>
      <tbody className={`${className}__tbody table__tbody`}>
        {
        data && data
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
  )
};

export default Table;