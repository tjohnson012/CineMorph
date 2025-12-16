import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Studio } from './pages/Studio';
import { Blend } from './pages/Blend';
import { Presets } from './pages/Presets';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'studio',
        element: <Studio />,
      },
      {
        path: 'blend',
        element: <Blend />,
      },
      {
        path: 'presets',
        element: <Presets />,
      },
    ],
  },
]);