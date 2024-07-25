import { Component, OnInit } from '@angular/core';
import { MarvelService } from '../../services/marvel.service';
import { FavoritesService } from '../../services/favorites.service';
import { Comic } from '../../interfaces/comic.interface';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.css']
})
export class ListPageComponent implements OnInit {
  comics: Comic[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  offset: number = 0;
  limit: number = 3;

  constructor(
    private marvelService: MarvelService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadComics();
  }

  loadComics(): void {
    this.isLoading = true;
    this.marvelService.getComics(this.offset, this.limit).subscribe(
      (comics) => {
        this.comics = comics;
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Failed to load comics';
        this.isLoading = false;
      }
    );
  }

  loadMore(): void {
    this.offset += this.limit;
    this.loadComics();
  }

  addToFavorites(comicId: number): void {
    this.favoritesService.addFavorite(comicId).subscribe(() => {
      this.comics = this.comics.map(comic =>
        comic.id === comicId ? { ...comic, isFavorite: true } : comic
      );
    });
  }
  
  removeFromFavorites(comicId: number): void {
    this.favoritesService.removeFavorite(comicId).subscribe(() => {
      this.comics = this.comics.map(comic =>
        comic.id === comicId ? { ...comic, isFavorite: false } : comic
      );
    });
  }
}
