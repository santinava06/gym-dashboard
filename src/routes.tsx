import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Students } from './pages/Students';
import { Schedule } from './pages/Schedule';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><Students /></Layout>,
  },
  {
    path: '/turnos',
    element: <Layout><Schedule /></Layout>,
  },
]);