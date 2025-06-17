import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MidService } from './mid.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private midService: MidService) { }

  login(email: string, password: string): Observable<any> {
    return this.midService.loginUser({ email, password });
  }

  register(firstName: string, lastName: string, documentNumber: string, phone: number, email: string, password: string): Observable<any> {
    return this.midService.registerUser({ firstName, lastName, documentNumber, phone, email, password });
  }

  saveToken(token: string): void {
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setUserSession(user: any): void {
    if (user && typeof user === 'object') {
      localStorage.setItem('usuario', JSON.stringify(user));
    } else {
      console.warn('❗ Datos de usuario inválidos al intentar guardar la sesión:', user);
    }
  }

  getUsuarioActual(): any {
    try {
      const data = localStorage.getItem('usuario');
      if (!data) {
        console.warn('⚠️ No hay datos de usuario en localStorage');
        return null;
      }
      const parsed = JSON.parse(data);
      if (!parsed?.Id) {
        console.warn('⚠️ El usuario no tiene ID válido:', parsed);
        return null;
      }
      return parsed;
    } catch (err) {
      console.error('❌ Error al obtener el usuario desde localStorage:', err);
      return null;
    }
  }

  getCurrentUserId(): number {
    const user = this.getUsuarioActual();
    return user?.Id || 0;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  logout(): void {
    this.clearSession();
  }
}
