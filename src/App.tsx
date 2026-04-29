import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { AppSplash } from './components/AppSplash'
import { router } from './routes'

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false)
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <AppSplash />
  }

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
