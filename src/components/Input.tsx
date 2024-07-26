import { FC } from "react";
import t from "../translate";

interface Props extends Partial<Omit<HTMLInputElement, 'className' | 'onchange' | 'value'>> {
  label: string;
  name: string;
  value?: Record<string, any>;
  onChange?(value: Record<string, string | boolean | number | Date>): void;
  error?: Record<string, string>;
}

interface SubComponents extends Omit<Props, 'name' | 'label'> {
  name?: string;
  label?: string;
}

const BaseInput: FC<Props> = ({ value, onChange, label, disabled, name, type, error }) => (
    <div className='form'>
      <div className='form__group field'>
        <input
          value={value?.[name]}
          type={type ?? 'text'}
        placeholder={label}
          id={name}
          name={name}
          className={`form__field input input-${type ?? 'text'}${disabled ? ' input--disabled' : ''}${error?.[name] ? ' input--error' : ''}`}
          onChange={e => onChange && onChange({ [name]: e.target.value })}
        />

        <label htmlFor={name} className="form__label">{label}</label>
      </div>
      {
        error?.[name] && <p className='text-macro text-error'>{error?.[name]}</p>
      }
    </div>
  );

const Email: FC<SubComponents> = ({ label, name, ...props }) => (
    <BaseInput
      {...props}
      name={name ?? 'email'}
      type='email'
      label={label ?? t('inputs.email')}
    />
  );

const Password: FC<SubComponents> = ({ label, name, ...props}: Props) => (
  <BaseInput
    {...props}
    type='password'
    name={name ?? 'password'}
    label={label ?? t('inputs.password')}
  />
);

const InputNumber: FC<SubComponents> = ({ onChange, label, name, ...props}: Props) => (
  <BaseInput
    {...props}
    onChange={e => onChange({ [name]: Number(e[name]) })}
    type='number'
    name={name ?? 'number'}
    label={label ?? t('inputs.numbers')}
  />
);

export const Input = {
  Email,
  Password,
  Text: BaseInput,
  Number: InputNumber,
}