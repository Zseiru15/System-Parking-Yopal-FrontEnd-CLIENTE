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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUsuarioActual() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  getCurrentUserId(): number {
    const userData = JSON.parse(localStorage.getItem('usuario') || '{}');
    return userData?.Id || 0;
  }

}
