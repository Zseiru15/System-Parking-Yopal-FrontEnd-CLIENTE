import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api-config';
import { ApiService } from './api.service'; // ajusta la ruta si es necesario

@Injectable({
  providedIn: 'root'
})
export class MidService {
  private baseUrl = `${API_URLS.MID.Api_mid}`;

  constructor(private http: HttpClient, private apiService: ApiService) { }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/usuarios`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${API_URLS.MID.Api_mid}/usuarios/login`, data);
  }

  getVehiculosByUsuario(idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/vehiculos/usuario/${idUsuario}`);
  }

  getParqueaderosByUsuario(idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/parqueaderos/usuario/${idUsuario}`);
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

  updateVehiculo(id: number, data: any): Observable<any> {
    return this.apiService.put(`vehiculos/${id}`, data);
  }

  updateParqueadero(id: number, body: any): Observable<any> {
    return this.apiService.put(`parqueaderos/${id}`, body);
  }

  getTrabajadoresPorParqueadero(idParqueadero: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuarios/trabajador/${idParqueadero}`);
  }

}
