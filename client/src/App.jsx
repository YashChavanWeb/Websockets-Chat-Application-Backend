import { Routes, Route, Navigate } from 'react-router-dom'
import Chat from './pages/Chat'
import Login from './pages/Login'
import Register from './pages/Register'
import { Container } from 'react-bootstrap'
import NavBar from './components/Navbar'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext'


function App() {

  const { user } = useContext(AuthContext)

  return (
    <>
      <ChatContextProvider user={user}>
        <NavBar />
        <Container>
          <Routes>
            {/* Protected Routes */}
            {user ? (
              <>
                <Route path='/' element={<Chat />} />
                <Route path='/login' element={<Navigate to='/' />} />
                <Route path='/register' element={<Navigate to='/' />} />
              </>
            ) : (
              // Public Routes
              <>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </>
            )}

            {/* Catch-all for undefined routes */}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </Container>
      </ChatContextProvider>
    </>
  )
}

export default App
