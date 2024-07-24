// list-page.component.ts
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
  itemsPerLoad: number = 30;
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
        const newComics: Comic[] = response.data.results.map((comic: any) => ({
          id: comic.id,
          title: comic.title,
          description: comic.description || 'No description available',
          imageUrl: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
          subtitle: comic.issueNumber ? `Issue #${comic.issueNumber}` : 'No issue number'
        }));

        this.comics = [...this.comics, ...newComics];
        this.loadedItems += this.itemsPerLoad;
        this.isLoading = false;

        // Check if there are more comics available
        this.hasMore = response.data.results.length === this.itemsPerLoad;
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
