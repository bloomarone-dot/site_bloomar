import { RouteObject } from 'react-router-dom'
import HomePage from '@/pages/home/page'
import ServicesPage from '@/pages/services/page'
import AboutPage from '@/pages/about/page'
import ContactPage from '@/pages/contact/page'
import NotFound from '@/pages/NotFound'

const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/services', element: <ServicesPage /> },
  { path: '/a-propos', element: <AboutPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '*', element: <NotFound /> },
]
export default routes
