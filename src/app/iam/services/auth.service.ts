import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable, switchMap, throwError } from 'rxjs';
import {
  AuthSession,
  AuthUser,
  LoginRequest,
  MockJwtPayload,
  RegisterRequest,
  StoredUser
} from '../model/auth.models';

const API_URL = 'http://localhost:3000/users';
const SESSION_KEY = 'bitewise.auth.session';
const TOKEN_KEY = 'bitewise.auth.token';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
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

    return this.http.get<StoredUser[]>(`${API_URL}?email=${encodeURIComponent(email)}`).pipe(
      map((users) => users[0]),
      switchMap((user) => {
        if (!user || user.password !== request.password || user.role !== request.role) {
          return throwError(() => new Error('invalidCredentials'));
        }

        return [this.createAndStoreSession(this.toAuthUser(user))];
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthSession> {
    const email = request.email.trim().toLowerCase();

    return this.http.get<StoredUser[]>(`${API_URL}?email=${encodeURIComponent(email)}`).pipe(
      switchMap((users) => {
        if (users.length > 0) {
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

        return this.http.post<StoredUser>(API_URL, user);
      }),
      map((user) => this.createAndStoreSession(this.toAuthUser(user)))
    );
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

    return this.http.patch<StoredUser>(`${API_URL}/${session.user.id}`, { onboardingCompleted: true }).pipe(
      map(() => this.createAndStoreSession(updatedUser))
    );
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
