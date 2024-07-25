import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Auth, Register } from "../types/auth.type";
import Btn from "../components/Btn";
import { useAuth } from "../contexts/AuthContext";
import t from "../translate";
import { Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLoad } from "../contexts/UseLoading";
import { toast } from "react-toastify";

type _tab =
  'signin'
  | 'signup';

const banners: Record<_tab, string> = {
  'signin': './sign_in.svg',
  'signup': './sign_up.svg',
};

const tabs: { label: string, value: _tab }[] = [
  {
    label: 'Acesso',
    value: 'signin',
  },
  {
    label: 'Registro',
    value: 'signup',
  },
];

const INITIAL_DATA_VALUE: Auth = { email: '', password: '' };

const INITIAL_REGISTER_DATA_VALUE: Register = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
}
const Signin = () => {
  const [data, setData] = useState<Auth>(INITIAL_DATA_VALUE);
  const [registerData, setRegisterData] = useState<Register>(INITIAL_REGISTER_DATA_VALUE);
  const { signin, signup, getAuthenticate } = useAuth();
  const [tab, setTab] = useState<_tab>('signin');
  const history = useNavigate();
  const { boxedLoading, hasLoading, hideLoading } = useLoad();

  useEffect(() => {
    const verifyAuthenticate = async () => {
      const res = await getAuthenticate();

      if (res) history('/dashboard');
    };

    verifyAuthenticate();
  }, []);

  const onChange = (value: Partial<Auth>) =>
    setData(prev => ({ ...prev, ...value }));

  const onChangeRegister = (value: Partial<Register>) =>
    setRegisterData(prev => ({ ...prev, ...value }));

  const emitSignin = async () => {
    boxedLoading('Enviando seus dados.');
    const success = await signin(data)
    if (success) history('/dashboard');
    hideLoading();
  };

  const emitSignup = async () => {
    boxedLoading('Enviando seus dados');
    const success = await signup(registerData);

    if (success) history('/dashboard');
    hideLoading();
  }

  const forms: Record<_tab, any> = {
    'signin': <>
      <Input.Email
        value={data}
        onChange={onChange}
        disabled={hasLoading}
      />
  
      <Input.Password
        value={data}
        onChange={onChange}
        disabled={hasLoading}
      />
  
      <div className='wrapper-signin__form__fields__actions'>
        <a>{t('pages.signin.btns.forget')}</a>
        
        <Btn
          size="sm"
          type="primary"
          onClick={emitSignin}
          disabled={hasLoading}
        >
          {t('pages.signin.btns.signin')}
        </Btn>
      </div>
    </>,
    'signup': <>
      <Input.Text
        name='name'
        label={t('inputs.name')}
        value={registerData}
        onChange={onChangeRegister}
        disabled={hasLoading}
      />

      <Input.Email
        value={registerData}
        onChange={onChangeRegister}
        disabled={hasLoading}
      />

      <Input.Password
        value={registerData}
        onChange={onChangeRegister}
        disabled={hasLoading}
      />

      <Input.Password
        name='confirmPassword'
        label={t('inputs.confirmPassword')}
        value={registerData}
        onChange={onChangeRegister}
        disabled={hasLoading}
      />

      <div className='wrapper-signin__form__fields__actions'>
        <Btn
          size="sm"
          type="secundary"
          onClick={() => setRegisterData(INITIAL_REGISTER_DATA_VALUE)}
          disabled={hasLoading}
        >
          {t('pages.signin.btns.cleanFields')}
        </Btn>
        
        <Btn
          size="sm"
          type="primary"
          onClick={emitSignup}
          disabled={hasLoading}
        >
          {t('pages.signin.btns.register')}
        </Btn>
      </div>
    </>
  }
  

  return (
    <div className='wrapper-signin'>
      <div className='wrapper-signin__banner'>
        <img src={banners[tab]} />
      </div>

      <div className='wrapper-signin__form'>
        <img src='./coffee.svg' className='wrapper-signin__form__img' />


        <div className='wrapper-signin__form__tabs'>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} aria-label="basic tabs example">
            {
              tabs.map(value => <Tab {...value} />)
            }
          </Tabs>
        </div>
        
        <div className='wrapper-signin__form__fields'>
          {forms[tab]}
        </div>
      </div>
    </div>
  )
};

export { Signin };