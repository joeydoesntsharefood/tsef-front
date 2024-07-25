import { FC } from "react";
import { Product } from "../types/product.type";
import { Input } from "./Input";
import Select from "./Select";

interface Props {
  disabled?: boolean;
  errors?: any;
  data: Partial<Product>;
  onChange?(value: Partial<Product>): void;
  providerOptions: { value: string, label: string }[];
}

const ProductForm: FC<Props> = ({ data, disabled, errors, onChange, providerOptions }) => (
    <>
      <Input.Text 
        name='name'
        label="Insira um nome"
        value={data}
        onChange={onChange}
        disabled={disabled}
        error={errors}
      />

      <Input.Text 
        name='description'
        label="Insira uma descrição"
        value={data}
        onChange={onChange}
        disabled={disabled}
        error={errors}
      />

      <Input.Number 
        name='price'
        label="Insira um preço"
        value={data}
        onChange={onChange}
        disabled={disabled}
        error={errors}
      />

      <Input.Number 
        name='quatity'
        label="Insira uma quantidade"
        value={data}
        onChange={onChange}
        disabled={disabled}
        error={errors}
      />

      <Input.Text 
        name='category'
        label="Insira uma categoria"
        value={data}
        onChange={onChange}
        disabled={disabled}
        error={errors}
      />

      <Select
        name='providerId'
        label="Escolha um fornecedor"
        value={data}
        onChange={onChange}
        disabled={disabled}
        error={errors}
        options={providerOptions}
      />
    </>
  );

export default ProductForm;