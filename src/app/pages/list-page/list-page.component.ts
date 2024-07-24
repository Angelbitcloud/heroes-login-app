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
  loadedItems: number = 0;
  itemsPerLoad: number = 5;
  isLoading: boolean = false;
  hasMore: boolean = true;

  constructor(
    private marvelService: MarvelService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.loadComics();
  }

  loadComics(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.marvelService.getComics(this.loadedItems, this.itemsPerLoad).subscribe(
      response => {
        this.comics = [...this.comics, ...response];
        this.loadedItems += this.itemsPerLoad;
        this.isLoading = false;

        // Check if there are more comics available
        this.hasMore = response.length === this.itemsPerLoad;
      },
      error => {
        console.error('Error loading comics', error);
        this.isLoading = false;
      }
    );
  }

  onShowMore(): void {
    if (this.hasMore) {
      this.loadComics();
    }
  }

  addToFavorites(comic: Comic): void {
    this.favoritesService.addFavorite(comic);
  }

  removeFromFavorites(comicId: number): void {
    this.favoritesService.removeFavorite(comicId);
  }
}
