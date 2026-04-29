import { isTauriApp } from './platform'

const ACCESS_TOKEN_KEY = 'access_token'
const AUTH_USER_KEY = 'auth_user'

export interface AuthUser {
  id: string
  username: string
  role: string
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

interface LoginInput {
  username: string
  password: string
}

export interface AuthRepository {
  restoreSession(): AuthSession | null
  login(input: LoginInput): Promise<AuthSession>
  logout(): Promise<void>
}

class LocalAuthRepository implements AuthRepository {
  restoreSession(): AuthSession | null {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const rawUser = localStorage.getItem(AUTH_USER_KEY)

    if (!accessToken || !rawUser) {
      return null
    }

    try {
      const user = JSON.parse(rawUser) as AuthUser
      return { accessToken, user }
    } catch {
      this.clearSession()
      return null
    }
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const username = input.username.trim().toLowerCase()

    if (username !== 'admin' || input.password !== '123456') {
      throw new Error('Usuario o contrasena invalidos')
    }

    const session: AuthSession = {
      accessToken: `local-session-${Date.now()}`,
      user: {
        id: 'local-admin',
        username: 'admin',
        role: 'owner',
      },
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user))
    return session
  }

  async logout() {
    this.clearSession()
  }

  private clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }
}

class TauriAuthRepository implements AuthRepository {
  restoreSession(): AuthSession | null {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const rawUser = localStorage.getItem(AUTH_USER_KEY)

    if (!accessToken || !rawUser) {
      return null
    }

    try {
      const user = JSON.parse(rawUser) as AuthUser
      return { accessToken, user }
    } catch {
      this.clearSession()
      return null
    }
  }

  async login(input: LoginInput): Promise<AuthSession> {
    const { invoke } = await import('@tauri-apps/api/core')
    const user = await invoke<AuthUser>('login', {
      input: {
        username: input.username.trim().toLowerCase(),
        password: input.password,
      },
    })

    const session: AuthSession = {
      accessToken: `tauri-session-${Date.now()}`,
      user,
    }

    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user))
    return session
  }

  async logout() {
    this.clearSession()
  }

  private clearSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }
}

let repository: AuthRepository | null = null

export function getAuthRepository(): AuthRepository {
  if (repository) {
    return repository
  }

  repository = isTauriApp ? new TauriAuthRepository() : new LocalAuthRepository()
  return repository
}
