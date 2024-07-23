import { FC, ReactNode } from "react";

interface Props extends Partial<Omit<HTMLButtonElement, 'type' | 'children' | 'className'>> {
  type: 'primary' | 'secundary';
  size: 'dl' | 'md' | 'sm';
  children?: string | ReactNode;
  onClick?(): void;
}

const Btn: FC<Props> = ({ type, children, size, disabled, onClick }) => (
    <button
      className={`btn btn-${type} btn-${size} ${disabled ? `btn-${type}--disabled` : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );

export default Btn;