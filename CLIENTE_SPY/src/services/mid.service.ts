import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class MidService {

  private baseUrl = `http://${API_URLS.MID.Api_mid}`;

  constructor(private http: HttpClient) {}

  // Ejemplo: método para registrar usuario
  registerUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, data);
  }

  // Ejemplo: método para login
  loginUser(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/login`, data);
  }

  // Puedes seguir agregando más métodos aquí para otros endpoints
}
