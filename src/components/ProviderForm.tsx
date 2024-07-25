import { FC } from "react";
import { Input } from "./Input";
import { Provider } from "../types/provider.type";

interface Props {
  disabled?: boolean;
  errors?: any;
  data: Partial<Provider>;
  onChange?(value: Partial<Provider>): void;
}

const ProviderForm: FC<Props> = ({ data, onChange, errors }) => (
    <>
      <Input.Text
        value={data}
        label="Insira um nome"
        name="name"
        onChange={onChange}
        error={errors}
      />

      <Input.Text
        value={data}
        label="Insira o codigo do pais"
        name="country_code"
        onChange={onChange}
        error={errors}
      />
    </>
  );

export default ProviderForm;