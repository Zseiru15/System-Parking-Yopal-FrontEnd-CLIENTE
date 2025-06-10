import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api-config';
import { ApiService } from './api.service'; // ajusta la ruta si es necesario

@Injectable({
  providedIn: 'root'
})
export class MidService {

  private baseCrud = `${API_URLS.MID.Api_mid}`;
  private baseMid = `${API_URLS.MID.Api_mid}`;
  constructor(private http: HttpClient, private apiService: ApiService) { }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseMid}/usuarios`, data);
  }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${API_URLS.MID.Api_mid}/usuarios/login`, data);
  }

  getUsuarioPorIdentificacion(identificacion: string) {
    return this.http.get<any>(`${this.baseMid}/usuarios/identificacion/${identificacion}`);
  }

  actualizarUsuario(id: number, data: any) {
    return this.http.put<any>(`${this.baseCrud}/usuarios/${id}`, data);
  }

  obtenerComentarios(): Observable<any> {
    return this.http.get(this.baseMid + '/comentarios');
  }

  postComentario(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseMid}/comentarios`, data);
  }

  getVehiculosByUsuario(idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseMid}/vehiculos/usuario/${idUsuario}`);
  }

  updateVehiculo(id: number, data: any): Observable<any> {
    return this.apiService.put(`vehiculos/${id}`, data);
  }

  eliminarVehiculo(id: number): Observable<any> {
    return this.http.put(`${this.baseMid}/vehiculos/desactivar/${id}`, {});
  }

  getParqueaderos(): Observable<any> {
    return this.http.get(`${this.baseMid}/parqueaderos`);
  }

  getParqueaderosByUsuario(idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseMid}/parqueaderos/usuario/${idUsuario}`);
  }

  updateParqueadero(id: number, body: any): Observable<any> {
    return this.apiService.put(`parqueaderos/${id}`, body);
  }

  eliminarParqueadero(id: number): Observable<any> {
    return this.http.put(`${this.baseMid}/parqueaderos/desactivar/${id}`, {});
  }

  getTrabajadoresPorParqueadero(idParqueadero: number): Observable<any> {
    return this.http.get(`${this.baseMid}/usuarios/trabajador/${idParqueadero}`);
  }

  getParqueaderoDeEmpleado(idUsuario: number): Observable<any> {
    return this.http.get(`${this.baseMid}/parqueaderos/empleo/${idUsuario}`);
  }

  getPromocionesPorParqueadero(idParqueadero: number): Observable<any> {
    return this.http.get(`${this.baseMid}/parqueaderos/promociones/${idParqueadero}`);
  }

  registrarPromocion(parqueaderoId: number, data: any) {
    return this.http.post(`${this.baseMid}/parqueaderos/registrarPromocion/${parqueaderoId}`, data);
  }

  actualizarPromocion(id: number, body: any) {
    return this.http.put(`${this.baseMid}/promociones/${id}`, body);
  }

}
