import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';
import { Users, Clock, Wallet, TrendingUp, Dumbbell } from 'lucide-react';
import { cn } from './ui/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: 'Alumnos', href: '/', icon: Users },
    { name: 'Turnos', href: '/turnos', icon: Clock },
  ];

  const secondaryNav = [
    { name: 'Ganancias', href: '/ganancias', icon: TrendingUp, disabled: true },
    { name: 'Billetera', href: '/billetera', icon: Wallet, disabled: true },
  ];

  return (
    <div className="flex h-screen bg-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-zinc-800 to-zinc-900 border-r border-zinc-700/50 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-zinc-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-lg shadow-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Mi Gimnasio</h1>
              <p className="text-xs text-zinc-400">Panel de Gestión</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="mb-4">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Principal
            </p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-zinc-700 to-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-zinc-700/50">
            <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
              Finanzas
            </p>
            {secondaryNav.map((item) => (
              <button
                key={item.name}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  item.disabled
                    ? 'text-zinc-600 cursor-not-allowed opacity-50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
                {item.disabled && (
                  <span className="ml-auto text-[10px] bg-zinc-700/50 px-2 py-0.5 rounded-full">
                    Próximamente
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-700/50">
          <div className="text-xs text-zinc-500 text-center">
            <p>Versión 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-zinc-900">
        {children}
      </main>
    </div>
  );
}
