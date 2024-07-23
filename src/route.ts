import React, { createElement, ReactNode } from "react";
import { Signin } from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import Infos from "./pages/Infos";
import Providers from "./pages/Providers";
import Products from "./pages/Products";
import User from "./pages/User";

import Inventory2Icon from '@mui/icons-material/Inventory2';
import PersonIcon from '@mui/icons-material/Person';
import PrecisiconManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import InfoIcon from '@mui/icons-material/Info';

interface Route {
  path: string;
  element: React.FunctionComponentElement<ReactNode>;
  title: string;
  unAuth: boolean;
  sidebar: boolean;
  icon?: ReactNode
}

export const routes: Route[] = [
  {
    path: '/',
    element: createElement(Signin),
    title: 'StockController',
    unAuth: true,
    sidebar: false,
  },
  {
    path: '/dashboard/*',
    element: createElement(Dashboard),
    title: 'Dashboard',
    unAuth: false,
    sidebar: false,
  },
  {
    path: '',
    element: createElement(Infos),
    title: 'Infos',
    unAuth:  false,
    sidebar: true,
    icon: createElement(InfoIcon),
  },
  {
    path: '/providers',
    element: createElement(Providers),
    title: 'Fornecedores',
    unAuth:  false,
    sidebar: true,
    icon: createElement(PrecisiconManufacturingIcon),
  },
  {
    path: '/products',
    element: createElement(Products),
    title: 'Produtos',
    unAuth:  false,
    sidebar: true,
    icon: createElement(Inventory2Icon),
  },
  {
    path: '/user',
    element: createElement(User),
    title: 'Perfil do usuário',
    unAuth:  false,
    sidebar: true,
    icon: createElement(PersonIcon),
  },
]