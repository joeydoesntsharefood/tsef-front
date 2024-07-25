import { FC } from "react";

interface Props extends Partial<Omit<HTMLInputElement, 'className' | 'onchange' | 'value'>> {
  label: string;
  name: string;
  value?: Record<string, any>;
  onChange?(value: Record<string, string | boolean | number | Date>): void;
  error?: Record<string, string>;
  options?: Array<{ value: string, label: string }>;
}

const Select: FC<Props> = ({
  label,
  name,
  value,
  onChange,
  disabled,
  error,
  options,
}) => (
    <div className='form'>
      <div className='form__group field'>
        <select
          value={value?.[name]}
          id={name}
          name={name}
          className={`form__field select ${disabled ? ' select--disabled' : ''}${error?.[name] ? ' select--error' : ''}`}
          onChange={e => onChange && onChange({ [name]: e.target.value })}
        >
          { options &&
            options.map(({ label, value }) => <option value={value}>{label}</option>)
          }
        </select>

        <label htmlFor={name} className="form__label">{label}</label>
      </div>
      {
        error?.[name] && <p className='text-macro text-error'>{error?.[name]}</p>
      }
    </div>
  );

export default Select;