import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import ResultPage from './pages/ResultPage';
import GalleryPage from './pages/GalleryPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: '首页',
    path: '/',
    element: <HomePage />,
    visible: true,
  },
  {
    name: '创作',
    path: '/create',
    element: <CreatePage />,
    visible: true,
  },
  {
    name: '结果',
    path: '/result/:id',
    element: <ResultPage />,
    visible: false,
  },
  {
    name: '画廊',
    path: '/gallery',
    element: <GalleryPage />,
    visible: true,
  },
];

export default routes;
