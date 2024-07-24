import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthResponse } from '../interfaces/auth.interface'; // Asegúrate de tener el camino correcto al archivo

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Método para registrar un nuevo usuario
  register(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/register/`;
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(url, body, { headers });
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    const url = `${this.apiUrl}/login/`;
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<AuthResponse>(url, body, { headers }).pipe(
      tap(response => {
        // Almacenar el token, accessToken y refreshToken en localStorage
        localStorage.setItem('token', response.token);  // Si el token es necesario
        localStorage.setItem('accessToken', response.access);
        localStorage.setItem('refreshToken', response.refresh);

        // Mostrar en consola si los tokens se almacenaron
        console.log('Token almacenado:', localStorage.getItem('token') !== null);
        console.log('Token:', localStorage.getItem('token'));
        console.log('Access Token almacenado:', localStorage.getItem('accessToken') !== null);
        console.log('Access Token:', localStorage.getItem('accessToken'));
        console.log('Refresh Token almacenado:', localStorage.getItem('refreshToken') !== null);
        console.log('Refresh Token:', localStorage.getItem('refreshToken'));
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    // Elimina todos los tokens almacenados
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Método para verificar autenticación
  checkAuthentication(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Método para obtener el usuario actual como Promesa
  // Método para obtener el usuario actual
  getCurrentUser(): Observable<any> {
    const url = `${this.apiUrl}/user/`;
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken) {
      console.error('Access token no encontrado.');
      return throwError('Access token no encontrado.');
    }

    // Intenta obtener los datos del usuario con el accessToken
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.trim()}`
      })
    }).pipe(
      catchError(error => {
        // Si el acceso ha expirado, intenta renovar el token
        if (error.status === 401 && refreshToken) {
          return this.refreshAccessToken(refreshToken).pipe(
            switchMap(newTokens => {
              // Almacena los nuevos tokens
              localStorage.setItem('accessToken', newTokens.access);
              localStorage.setItem('refreshToken', newTokens.refresh);

              // Reintenta la solicitud con el nuevo accessToken
              return this.http.get(url, {
                headers: new HttpHeaders({
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${newTokens.access}`
                })
              });
            }),
            catchError(refreshError => {
              console.error('Error al renovar el token:', refreshError);
              return throwError('No se pudo renovar el token.');
            })
          );
        }
        console.error('Error al obtener el usuario:', error);
        return throwError(error);
      })
    );
  }

  // Método para renovar el accessToken usando el refreshToken
  private refreshAccessToken(refreshToken: string): Observable<any> {
    const url = `${this.apiUrl}/refresh-token/`; // Asegúrate de que esta ruta es la correcta
    const body = { refresh: refreshToken };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ access: string, refresh: string }>(url, body, { headers });
  }
}

