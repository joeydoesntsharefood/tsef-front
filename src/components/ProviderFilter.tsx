import { FC } from "react";
import { Input } from "./Input";
import Select from "./Select";

export interface IProviderFilter {
  name: string;
  country_code: string;
}

interface Props {
  options: { label: string; value: string; }[];
  data: IProviderFilter;
  onChange(value: Partial<IProviderFilter>): void
}

const ProviderFilter: FC<Props> = ({ data, onChange, options }) => 
  (
    <div className='flex-col gap-xs'>
      <Input.Text
        label="Busque por nome"
        name="name"
        value={data}
        onChange={onChange}
      />

      <Select
        name='country_code'
        label='Selecione um fornecedor'
        value={data}
        onChange={onChange}
        options={options}
      />
    </div>
  );

export default ProviderFilter;