import { createBrowserRouter, createHashRouter, type RouteObject } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Students } from './pages/Students';
import { Schedule } from './pages/Schedule';
import { About } from './pages/About';
import { Settings } from './pages/Settings';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout>
          <Students />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/turnos',
    element: (
      <ProtectedRoute>
        <Layout>
          <Schedule />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/acerca-de',
    element: (
      <ProtectedRoute>
        <Layout>
          <About />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/ajustes',
    element: (
      <ProtectedRoute>
        <Layout>
          <Settings />
        </Layout>
      </ProtectedRoute>
    ),
  },
];

const isTauri =
  typeof window !== 'undefined' &&
  ('__TAURI_INTERNALS__' in window || window.navigator.userAgent.includes('Tauri'));

export const router = isTauri ? createHashRouter(routes) : createBrowserRouter(routes);
