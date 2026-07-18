import { Outlet } from 'react-router-dom'
import { PortfolioProvider } from '../../context/PortfolioContext'
import Navbar from './Navbar'
import Footer from './Footer'
import BackToTop from './BackToTop'
import ScrollToHash from './ScrollToHash'

export default function Layout() {
  return (
    <PortfolioProvider>
      <div className="flex min-h-dvh min-w-0 flex-col overflow-x-clip">
        <ScrollToHash />
        <Navbar />
        <main id="main-content" className="min-w-0 flex-1 overflow-x-clip">
          <Outlet />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PortfolioProvider>
  )
}
