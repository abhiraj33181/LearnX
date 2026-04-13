import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Link, Route, Routes } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Auth } from './pages/Auth'
import ProtectedRoute from './components/ProtectedRoute'
import HostSession from './pages/HostSession'
import JoinSession from './pages/JoinSession'
import Dashboard from './pages/Dashboard'
import { SessionProvider } from './context/SessionContext'
import {Toaster} from 'react-hot-toast'


function Layout({ children, showHeader = true, showFooter = true }) {
  return (
    <>
      {showHeader && <Header />}

      <main className={showHeader ? 'pt-16' : ''}>
        {children}
      </main>

      {showFooter && <Footer />}
    </>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <SessionProvider>
        <BrowserRouter>
        <Toaster
          position='top-right'
          toastOptions={{
            duration : 3000,
            style : {
              background : '#363636',
              color :  "#fff"
            },
            success : {
              duration : 3000,
              iconTheme : {
                primary : '#10b981',
                secondary : '#fff'
              }
            },
            error : {
              duration : 4000,
              iconTheme : {
                primary : "#ef4444",
                secondary : '#fff'
              }
            }
          }}
        />
          <div className='min-h-screen flex flex-col bg-gray-50'>
            <Routes>

              <Route path='/' element={
                <Layout>
                  <Home />
                </Layout>
              } />


              <Route path='/register' element={
                <Layout showHeader={false} showFooter={false}>
                  <Auth />
                </Layout>
              } />


              <Route path='/login' element={
                <Layout showHeader={false} showFooter={false}>
                  <Auth />
                </Layout>
              } />


              {/* Protected Routes */}

              <Route path='/dashboard' element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />


              <Route path='/host' element={
                <ProtectedRoute>
                  <Layout>
                    <HostSession />
                  </Layout>
                </ProtectedRoute>
              } />


              <Route path='/join' element={
                <ProtectedRoute>
                  <Layout>
                    <JoinSession />
                  </Layout>
                </ProtectedRoute>
              } />



              <Route path='*' element={
                <Layout>
                  <div className='min-h-screen flex items-center justify-center'>
                    <div className='text-center'>
                      <h1 className='text-4xl font-bold text-gray-800 mb-4'>404</h1>

                      <p className='text-gray-600 mb-4'>Page not found</p>
                      <Link to={'/'} className='text-blue-600 hover:text-blue-500'>Go to Home</Link>
                    </div>

                  </div>
                </Layout>
              } />


            </Routes>
          </div>
        </BrowserRouter>
      </SessionProvider>
    </AuthProvider>
  )
}

export default App