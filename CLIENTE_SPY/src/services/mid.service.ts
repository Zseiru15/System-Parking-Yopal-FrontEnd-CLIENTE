import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api-config';

@Injectable({
  providedIn: 'root'
})
export class MidService {
  private baseUrl = `${API_URLS.MID.Api_mid}`;

  constructor(private http: HttpClient) {}

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios/login`, data);
  }

  obtenerComentarios(): Observable<any> {
    return this.http.get(this.baseUrl + '/comentarios');
  }

  postComentario(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/comentarios`, data);
  }

  getParqueaderos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/parqueaderos`);
  }
}
