import { FC } from "react";
import { Input } from "./Input";
import Select from "./Select";

export interface IProductFilter {
  priceStart: number;
  name: string;
  priceEnd: number;
  quantityStart: number;
  quantityEnd: number;
  providerId: string;
  country_code: string;
}

interface Props {
  value: IProductFilter;
  onChange(value: Partial<IProductFilter>): void;
  providers: { label: string; value: string }[];
  country_codes: { label: string; value: string }[];
}

const ProductFilter: FC<Props> = ({ onChange, value, providers, country_codes }) => (
    <div className='flex-col gap-xs'>
      <Input.Text
        label="Busque por nome"
        name="name"
        value={value}
        onChange={onChange}
      />

      <div className="flex gap-xs">
        <Input.Number
          name='priceStart'
          label="Preço inicial"
          onChange={onChange}
          value={value}
        />

        <Input.Number
          name='priceEnd'
          label="Preço final"
          onChange={onChange}
          value={value}
        />
      </div>

      <div className="flex gap-xs">
        <Input.Number
          name='quantityStart'
          label="Quantidade inicial"
          onChange={onChange}
          value={value}
        />

        <Input.Number
          name='quantityEnd'
          label="Quantidade final"
          onChange={onChange}
          value={value}
        />
      </div>

      <div className='flex gap-xs'>
        <Select
          label="Código do país"
          name="country_code"
          options={country_codes}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );

export default ProductFilter;