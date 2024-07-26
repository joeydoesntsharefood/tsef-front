import { Modal } from "@mui/material";
import { FC, ReactNode } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Btn from "./Btn";
import t from "../translate";

interface Props {
  open: boolean;
  onClose(): void;
  form: ReactNode;
  texts: {
    title: string;
    confirm: string;
    cancel?: string;
  }
  onCancel?(): void;
  onSubmit(): Promise<void>;
}

const FormModal: FC<Props> = ({ onClose, onCancel, open, texts, form, onSubmit }) => (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className='bg-neutral-light form-modal'>
        <div className='form-modal__header'>
          <p className='text-xs'>
            {texts.title}
          </p>
          
          <CloseIcon className='cursor-pointer' onClick={onClose} />
        </div>
        <div className='form-modal__content'>
          {form}
        </div>
        <div className='form-modal__footer'>
          <Btn
            size="sm"
            type="secundary"
            onClick={onCancel ?? onClose}
          >
            {texts?.cancel ?? t('modals.form.cancel')}
          </Btn>
          
          <Btn
            size="sm"
            type="primary"
            onClick={onSubmit}
          >
            {texts.confirm}
          </Btn>
        </div>
      </div>
    </Modal>
  );

export default FormModal;