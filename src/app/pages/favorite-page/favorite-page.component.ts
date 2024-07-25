import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { Comic } from '../../interfaces/comic.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favorite-page',
  templateUrl: './favorite-page.component.html',
  styleUrls: ['./favorite-page.component.css']
})
export class FavoritePageComponent implements OnInit {
  comics: Comic[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavoriteComics();
  }

  loadFavoriteComics(): void {
    this.favoritesService.getFavorites().subscribe(
      (response) => {
        this.comics = response;
      },
      (error: any) => {
        console.error('Error loading favorite comics', error);
      }
    );
  }

  removeFromFavorites(comicId: number): void {
    this.favoritesService.removeFavorite(comicId).subscribe(
      () => {
        this.comics = this.comics.filter(comic => comic.id !== comicId);
      },
      (error) => {
        console.error('Error removing comic from favorites', error);
      }
    );
  }
}
