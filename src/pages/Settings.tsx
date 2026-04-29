import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import {
  Store,
  User,
  Loader2,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { cn } from '../components/ui/utils';
import { useAuth } from '../contexts/AuthContext';

interface GymProfile {
  id: number;
  name: string | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
}

interface GymProfileInput {
  name: string | null;
}

export function Settings() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'gym' | 'user'>('gym');
  const [isLoading, setIsLoading] = useState(true);

  // Gym Profile State
  const [isSavingGym, setIsSavingGym] = useState(false);
  const [saveGymStatus, setSaveGymStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [gymErrorMessage, setGymErrorMessage] = useState('');

  const [gymFormData, setGymFormData] = useState<GymProfileInput>({
    name: '',
  });

  const [initialGymData, setInitialGymData] = useState<GymProfileInput>({
    name: '',
  });

  // User Credentials State  
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [saveUserStatus, setSaveUserStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [userErrorMessage, setUserErrorMessage] = useState('');

  const [userFormData, setUserFormData] = useState({
    username: user?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await invoke<GymProfile>('get_gym_profile');
      const inputData = {
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      };
      setGymFormData(inputData);
      setInitialGymData(inputData);
    } catch (err: any) {
      console.error('Error loading gym profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGymProfile = async () => {
    try {
      setIsSavingGym(true);
      setSaveGymStatus('idle');

      const payload: GymProfileInput = {
        name: gymFormData.name?.trim() || null,
      };

      await invoke('update_gym_profile', { input: payload });

      setInitialGymData(gymFormData);
      setSaveGymStatus('success');
      window.dispatchEvent(new Event('gym-profile-updated'));

      setTimeout(() => setSaveGymStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Error saving gym profile:', err);
      setGymErrorMessage(err.toString());
      setSaveGymStatus('error');
    } finally {
      setIsSavingGym(false);
    }
  };

  const handleDiscardGymChanges = () => {
    setGymFormData(initialGymData);
  };

  const handleSaveUserCredentials = async () => {
    try {
      if (!userFormData.currentPassword) {
        setUserErrorMessage('Debes ingresar tu contraseña actual.');
        setSaveUserStatus('error');
        return;
      }

      if (userFormData.newPassword && userFormData.newPassword !== userFormData.confirmPassword) {
        setUserErrorMessage('Las contraseñas nuevas no coinciden.');
        setSaveUserStatus('error');
        return;
      }

      setIsSavingUser(true);
      setSaveUserStatus('idle');

      const payload = {
        userId: user?.id,
        newUsername: userFormData.username,
        currentPassword: userFormData.currentPassword,
        newPassword: userFormData.newPassword || null
      };

      await invoke('update_user_credentials', { input: payload });

      setSaveUserStatus('success');

      // If credentials changed successfully, require re-login
      setTimeout(() => {
        logout();
      }, 1500);

    } catch (err: any) {
      console.error('Error saving user credentials:', err);
      setUserErrorMessage(err.toString());
      setSaveUserStatus('error');
    } finally {
      setIsSavingUser(false);
    }
  };

  const hasGymChanges =
    gymFormData.name !== initialGymData.name;

  const hasUserChanges =
    userFormData.username !== user?.username ||
    userFormData.currentPassword.length > 0 ||
    userFormData.newPassword.length > 0;

  const tabs = [
    { id: 'gym', label: 'Información del Gimnasio', icon: Store },
    { id: 'user', label: 'Usuario', icon: User },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Configuración</h1>
        <p className="text-zinc-400">Personaliza tu sistema de gestión</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="flex lg:flex-col gap-2 rounded-xl bg-zinc-900/50 p-2 border border-zinc-800/50 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap lg:whitespace-normal",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  )}
                >
                  <tab.icon className={cn("h-5 w-5", isActive ? "text-blue-200" : "text-zinc-500")} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'gym' && (
            <div className="flex flex-col rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-sm">

              {/* Header Box */}
              <div className="flex items-center gap-4 p-6 border-b border-zinc-800/60 bg-zinc-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-inner">
                  <Store className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Información del Gimnasio</h2>
                  <p className="text-sm text-zinc-400">Datos generales de tu negocio</p>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 sm:p-8 space-y-8">

                {saveGymStatus === 'success' && (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    Cambios guardados correctamente
                  </div>
                )}

                {saveGymStatus === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    {gymErrorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="name" className="text-sm font-medium text-zinc-300">Nombre del Gimnasio</Label>
                    <Input
                      id="name"
                      placeholder="Ej. RFGym"
                      value={gymFormData.name || ''}
                      onChange={(e) => setGymFormData({ ...gymFormData, name: e.target.value })}
                      className="bg-zinc-950/50 border-zinc-800 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all text-white placeholder:text-zinc-600"
                    />
                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800/60 bg-zinc-900/50 rounded-b-2xl">
                <Button
                  variant="ghost"
                  onClick={handleDiscardGymChanges}
                  disabled={!hasGymChanges || isSavingGym}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Descartar cambios
                </Button>
                <Button
                  onClick={handleSaveGymProfile}
                  disabled={!hasGymChanges || isSavingGym}
                  className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  {isSavingGym ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Guardar cambios
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'user' && (
            <div className="flex flex-col rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl overflow-hidden backdrop-blur-sm">
              <div className="flex items-center gap-4 p-6 border-b border-zinc-800/60 bg-zinc-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shadow-inner">
                  <KeyRound className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Credenciales de Usuario</h2>
                  <p className="text-sm text-zinc-400">Actualiza tu nombre de usuario y contraseña</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8">
                {saveUserStatus === 'success' && (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    Guardado correctamente. Cerrando sesión...
                  </div>
                )}

                {saveUserStatus === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    {userErrorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="username" className="text-sm font-medium text-zinc-300">Nombre de Usuario</Label>
                    <Input
                      id="username"
                      placeholder="Ej. admin"
                      value={userFormData.username}
                      onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                      className="bg-zinc-950/50 border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all text-white placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2 border-t border-zinc-800/50 pt-4 mt-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium text-zinc-300">Contraseña Actual <span className="text-red-400">*</span></Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Requerido para guardar cambios"
                      value={userFormData.currentPassword}
                      onChange={(e) => setUserFormData({ ...userFormData, currentPassword: e.target.value })}
                      className="bg-zinc-950/50 border-zinc-800 focus:border-red-500/50 focus:ring-red-500/20 transition-all text-white placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium text-zinc-300">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Dejar en blanco para no cambiar"
                      value={userFormData.newPassword}
                      onChange={(e) => setUserFormData({ ...userFormData, newPassword: e.target.value })}
                      className="bg-zinc-950/50 border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all text-white placeholder:text-zinc-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-300">Confirmar Nueva Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repita la nueva contraseña"
                      value={userFormData.confirmPassword}
                      onChange={(e) => setUserFormData({ ...userFormData, confirmPassword: e.target.value })}
                      className="bg-zinc-950/50 border-zinc-800 focus:border-orange-500/50 focus:ring-orange-500/20 transition-all text-white placeholder:text-zinc-600"
                      disabled={!userFormData.newPassword}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800/60 bg-zinc-900/50 rounded-b-2xl">
                <Button
                  onClick={handleSaveUserCredentials}
                  disabled={!hasUserChanges || isSavingUser || !userFormData.currentPassword}
                  className="bg-orange-600 hover:bg-orange-700 text-white border border-orange-500 shadow-lg shadow-orange-900/20 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  {isSavingUser ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Actualizar Credenciales
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
