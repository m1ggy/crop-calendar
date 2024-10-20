import { RouteObject, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Admin from './pages/Admin'
import CropCalendar from './pages/CropCalendar'
import Info from './pages/Info'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Municipalities from './pages/Municipalities'
import Municipality from './pages/Municipality'

const routes: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: '/app',
        element: <CropCalendar />,
      },
      {
        path: '/crops',
        element: <Info />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: '/municipalities',
        element: <Municipalities />,
      },
      {
        path: '/municipalities/:municipality',
        element: <Municipality />,
      },
    ],
  },
]

const router = createBrowserRouter(routes)
export default router
