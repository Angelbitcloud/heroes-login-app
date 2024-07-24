import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private storageKey: string = 'favorites';

  getFavorites(): any[] {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(item: any): void {
    const favorites = this.getFavorites();
    favorites.push(item);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }

  removeFavorite(itemId: number): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(item => item.id !== itemId);
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }
}
