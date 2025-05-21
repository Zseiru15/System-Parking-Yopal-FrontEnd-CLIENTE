import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = 'http://localhost:8082/v1'; // ← Ajusta esto según tu MID

    constructor(private http: HttpClient) { }

    get<T>(url: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${url}`);
    }

    post<T>(url: string, data: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/${url}`, data);
    }

    put<T>(url: string, data: any): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}/${url}`, data);
    }

    delete<T>(url: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}/${url}`);
    }
}
