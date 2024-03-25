import { RouteObject, createBrowserRouter } from 'react-router-dom'
import CropCalendar from './pages/CropCalendar'
import Info from './pages/Info'
import Landing from './pages/Landing'

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
    ],
  },
]

const router = createBrowserRouter(routes)
export default router
