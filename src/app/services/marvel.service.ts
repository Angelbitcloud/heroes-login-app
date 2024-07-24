import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { map } from 'rxjs/operators';
import { ComicDataWrapper, Comic } from '../interfaces/comic.interface';

@Injectable({
  providedIn: 'root'
})
export class MarvelService {
  private baseUrl: string = 'https://gateway.marvel.com/v1/public';
  private publicKey: string = '987b0c4e436026ddc174aafb83ba24a7';
  private privateKey: string = 'db291d71364dc3ce985c22bea3d467f7984fd77c';

  constructor(private http: HttpClient) {}

  private getHash(ts: string): string {
    return CryptoJS.MD5(ts + this.privateKey + this.publicKey).toString();
  }

  private getAuthParams(): string {
    const ts = new Date().getTime().toString();
    const hash = this.getHash(ts);
    return `ts=${ts}&apikey=${this.publicKey}&hash=${hash}`;
  }

  getComics(offset: number = 0, limit: number = 30): Observable<Comic[]> {
    const url = `${this.baseUrl}/comics?${this.getAuthParams()}&offset=${offset}&limit=${limit}`;
    return this.http.get<ComicDataWrapper>(url).pipe(
      map(response => this.extractComicData(response))
    );
  }

  private extractComicData(response: ComicDataWrapper): Comic[] {
    return response.data.results.map((comic) => ({
      id: comic.id,
      title: comic.title,
      description: comic.description || 'No description available',
      thumbnail: {
        path: comic.thumbnail.path,
        extension: comic.thumbnail.extension
      },
      dates: comic.dates.filter(date => date.type === 'onsaleDate' || date.type === 'focDate'),
      prices: comic.prices
    }));
  }
}
