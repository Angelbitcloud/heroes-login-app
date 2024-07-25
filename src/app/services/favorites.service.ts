import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.apiUrl}/favorites/`;

  constructor(private http: HttpClient) {}

  // Obtener la lista de favoritos
  getFavorites(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Agregar un cómic a favoritos
  addFavorite(comicId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    const body = { id: comicId };  // Asegúrate de que 'comic' es la clave correcta
    console.log('Sending to backend:', body);
    return this.http.post(this.apiUrl, body, { headers }).pipe(
      tap(response => console.log('Response from backend:', response))
    );
  }
  

  // Eliminar un cómic de favoritos
  removeFavorite(comicId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    });
    return this.http.delete(`${this.apiUrl}${comicId}/`, { headers }).pipe(
      tap(response => console.log('Response from backend:', response))
    );
  }
}
