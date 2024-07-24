import { FC } from "react";
import { Input } from "./Input";
import { Provider } from "../types/provider.type";

interface Props {
  disabled?: boolean;
  errors?: any;
  data: Partial<Provider>;
  onChange?(value: Partial<Provider>): void;
}

const Provider: FC<Props> = ({ data, onChange }) => (
    <>
      <Input.Text
        value={data}
        label="Insira um nome"
        name="name"
        onChange={onChange}
      />

      <Input.Text
        value={data}
        label="Insira o codigo do pais"
        name="country_code"
        onChange={onChange}
      />
    </>
  );

export default Provider;