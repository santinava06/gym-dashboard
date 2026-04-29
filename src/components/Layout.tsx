import { useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Users,
  Clock,
  Settings,
  Shield,
  Dumbbell,
  LogOut,
  BadgeInfo,
  Menu,
} from 'lucide-react'
import { cn } from './ui/utils'
import { NotificationsPopover } from './NotificationsPopover'
import { useAuth } from '../contexts/AuthContext'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Button } from './ui/button'
import { invoke } from '@tauri-apps/api/core'
import { useEffect } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [gymName, setGymName] = useState('RFGym')

  useEffect(() => {
    const fetchGymName = async () => {
      try {
        const profile = await invoke<{ name: string | null }>('get_gym_profile')
        setGymName(profile.name || 'RFGym')
      } catch (e) {
        console.error('Failed to get gym profile', e)
      }
    }

    fetchGymName()
    window.addEventListener('gym-profile-updated', fetchGymName)
    return () => window.removeEventListener('gym-profile-updated', fetchGymName)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navigation = [
    { name: 'Alumnos', href: '/', icon: Users },
    { name: 'Turnos', href: '/turnos', icon: Clock },
    { name: 'Acerca de', href: '/acerca-de', icon: BadgeInfo },
  ]

  const secondaryNav = [
    { name: 'Ajustes', href: '/ajustes', icon: Settings, disabled: false },
  ]

  const navContent = (
    <>
      <div className="border-b border-zinc-700/50 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 p-2 shadow-lg">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white max-w-[150px] truncate">{gymName}</h1>
            <p className="text-xs text-zinc-400">Panel de Gestion</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-6 p-4">
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Principal
          </p>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-zinc-700 to-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="border-t border-zinc-700/50 pt-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Configuración
          </p>
          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = location.pathname === item.href
              
              if (item.disabled) {
                return (
                  <button
                    key={item.name}
                    disabled
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 cursor-not-allowed text-zinc-600 opacity-50"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    <span className="ml-auto rounded-full bg-zinc-700/50 px-2 py-0.5 text-[10px]">
                      Proximamente
                    </span>
                  </button>
                )
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-zinc-700 to-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white',
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <div className="border-t border-zinc-700/50 p-4">
        <div className="text-center text-xs text-zinc-500">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white lg:flex">
      <aside className="hidden w-72 flex-col border-r border-zinc-700/50 bg-gradient-to-b from-zinc-800 to-zinc-900 lg:flex">
        {navContent}
      </aside>

      <main className="flex min-h-screen flex-1 flex-col">
        <div className="safe-top safe-left safe-right sticky top-0 z-30 border-b border-zinc-700/50 bg-gradient-to-r from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-1 py-3 sm:px-2 lg:px-4">
            <div className="flex items-center gap-3">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-zinc-200 hover:bg-zinc-800 hover:text-white lg:hidden"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="flex w-[86vw] max-w-none flex-col border-zinc-700 bg-zinc-900 p-0 sm:max-w-sm"
                >
                  <SheetHeader className="sr-only">
                    <SheetTitle>Menu principal</SheetTitle>
                    <SheetDescription>Navegacion principal de la aplicacion.</SheetDescription>
                  </SheetHeader>
                  {navContent}
                  <SheetClose className="sr-only" />
                </SheetContent>
              </Sheet>

              <div className="lg:hidden">
                <p className="text-sm font-semibold text-white truncate max-w-[200px]">{gymName}</p>
                <p className="text-xs text-zinc-400">Panel mobile</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {user && (
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-white">{user.username}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{user.role}</p>
                </div>
              )}
              <NotificationsPopover />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden text-sm sm:inline">Cerrar sesion</span>
              </button>
            </div>
          </div>
        </div>

        <div className="safe-left safe-right safe-bottom flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
