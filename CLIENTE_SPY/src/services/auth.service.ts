import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MidService } from './mid.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private midService: MidService) {}

  login(username: string, password: string): Observable<any> {
    return this.midService.loginUser({ username, password });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  
}
