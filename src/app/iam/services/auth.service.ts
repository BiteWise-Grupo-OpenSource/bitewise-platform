import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, throwError } from 'rxjs';
import {
  AuthSession,
  AuthUser,
  LoginRequest,
  MockJwtPayload,
  RegisterRequest,
  StoredUser
} from '../model/auth.models';

const SESSION_KEY = 'bitewise.auth.session';
const TOKEN_KEY = 'bitewise.auth.token';
const LOCAL_USERS_KEY = 'bitewise.auth.localUsers';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const DEMO_USERS: StoredUser[] = [
  {
    id: 'patient-demo',
    email: 'andrea@email.com',
    password: '123456',
    displayName: 'Andrea Flores',
    role: 'patient',
    onboardingCompleted: true
  },
  {
    id: 'nutritionist-demo',
    email: 'dr.carlos@email.com',
    password: '123456',
    displayName: 'Dr. Carlos Medina',
    role: 'nutritionist',
    onboardingCompleted: true
  }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly currentSession = signal<AuthSession | null>(null);

  readonly session = this.currentSession.asReadonly();
  readonly session$ = toObservable(this.currentSession);
  readonly user = computed(() => this.currentSession()?.user ?? null);
  readonly isAuthenticated = computed(() => this.hasValidSession());

  constructor() {
    this.restoreSession();
  }

  login(request: LoginRequest): Observable<AuthSession> {
    const email = request.email.trim().toLowerCase();
    const user = this.getUsers().find((storedUser) => storedUser.email === email);

    if (!user || user.password !== request.password || user.role !== request.role) {
      return throwError(() => new Error('invalidCredentials'));
    }

    return of(this.createAndStoreSession(this.toAuthUser(user)));
  }

  register(request: RegisterRequest): Observable<AuthSession> {
    const email = request.email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some((user) => user.email === email)) {
      return throwError(() => new Error('emailExists'));
    }

    const user: StoredUser = {
      id: this.createId(),
      email,
      password: request.password,
      displayName: request.displayName.trim(),
      role: request.role,
      onboardingCompleted: request.role === 'nutritionist'
    };

    this.writeUsers([...users, user]);

    return of(this.createAndStoreSession(this.toAuthUser(user)));
  }

  completeOnboarding(): Observable<AuthSession> {
    const session = this.currentSession();

    if (!session) {
      return throwError(() => new Error('missingSession'));
    }

    const updatedUser: AuthUser = {
      ...session.user,
      onboardingCompleted: true
    };

    this.writeUsers(
      this.getUsers().map((user) =>
        user.id === session.user.id
          ? { ...user, onboardingCompleted: true }
          : user
      )
    );

    return of(this.createAndStoreSession(updatedUser));
  }

  logout(): void {
    this.currentSession.set(null);
    this.writeStorage(null);
    void this.router.navigateByUrl('/auth/login');
  }

  nextRouteFor(session: AuthSession | null = this.currentSession()): string {
    if (!session) {
      return '/auth/login';
    }

    if (session.user.role === 'patient' && !session.user.onboardingCompleted) {
      return '/auth/onboarding';
    }

    if (session.user.role === 'patient') {
      return '/patient';
    }

    return '/session';
  }

  hasValidSession(): boolean {
    const session = this.currentSession();
    return !!session && session.expiresAt > Date.now() && this.isTokenValid(session.token);
  }

  private createAndStoreSession(user: AuthUser): AuthSession {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const payload: MockJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      iat: nowSeconds,
      exp: nowSeconds + SESSION_TTL_SECONDS
    };
    const session: AuthSession = {
      token: this.encodeJwt(payload),
      user,
      expiresAt: payload.exp * 1000
    };

    this.currentSession.set(session);
    this.writeStorage(session);

    return session;
  }

  private restoreSession(): void {
    if (!this.canUseStorage()) {
      return;
    }

    const rawSession = localStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      return;
    }

    try {
      const session = JSON.parse(rawSession) as AuthSession;
      if (session.expiresAt > Date.now() && this.isTokenValid(session.token)) {
        this.currentSession.set(session);
        return;
      }
    } catch {
      this.writeStorage(null);
      return;
    }

    this.writeStorage(null);
  }

  private writeStorage(session: AuthSession | null): void {
    if (!this.canUseStorage()) {
      return;
    }

    if (!session) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(TOKEN_KEY, session.token);
  }

  private isTokenValid(token: string): boolean {
    const payload = this.decodePayload(token);
    return !!payload && payload.exp * 1000 > Date.now();
  }

  private decodePayload(token: string): MockJwtPayload | null {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    try {
      return JSON.parse(this.base64UrlDecode(payload)) as MockJwtPayload;
    } catch {
      return null;
    }
  }

  private encodeJwt(payload: MockJwtPayload): string {
    return [
      this.base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' })),
      this.base64UrlEncode(JSON.stringify(payload)),
      'mock-signature'
    ].join('.');
  }

  private base64UrlEncode(value: string): string {
    return btoa(unescape(encodeURIComponent(value)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  private base64UrlDecode(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return decodeURIComponent(escape(atob(padded)));
  }

  private toAuthUser(user: StoredUser): AuthUser {
    const { password: _password, ...authUser } = user;
    return authUser;
  }

  private getUsers(): StoredUser[] {
    if (!this.canUseStorage()) {
      return DEMO_USERS;
    }

    const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);

    if (!rawUsers) {
      return DEMO_USERS;
    }

    try {
      return [...DEMO_USERS, ...JSON.parse(rawUsers) as StoredUser[]];
    } catch {
      localStorage.removeItem(LOCAL_USERS_KEY);
      return DEMO_USERS;
    }
  }

  private writeUsers(users: StoredUser[]): void {
    if (!this.canUseStorage()) {
      return;
    }

    const demoEmails = new Set(DEMO_USERS.map((user) => user.email));
    localStorage.setItem(
      LOCAL_USERS_KEY,
      JSON.stringify(users.filter((user) => !demoEmails.has(user.email)))
    );
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `${Date.now()}`;
  }

  private canUseStorage(): boolean {
    return isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined';
  }
}
