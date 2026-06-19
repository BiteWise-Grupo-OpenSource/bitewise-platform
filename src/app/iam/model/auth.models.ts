export type UserRole = 'patient' | 'nutritionist';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  onboardingCompleted: boolean;
}

export interface StoredUser extends AuthUser {
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface MockJwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  displayName: string;
  iat: number;
  exp: number;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}
