import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';
import { Comic } from '../../interfaces/comic.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() comic!: Comic;
  @Output() addToFavorites = new EventEmitter<number>(); // Cambiado a number
  @Output() removeFromFavorites = new EventEmitter<number>();
  isFavorite: boolean = false;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.checkIfFavorite();
  }

  checkIfFavorite(): void {
    this.favoritesService.getFavorites().subscribe(favorites => {
      this.isFavorite = favorites.some(favorite => favorite.id === this.comic.id);
    });
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.removeFromFavorites.emit(this.comic.id);
    } else {
      this.addToFavorites.emit(this.comic.id);
    }
    this.isFavorite = !this.isFavorite;
  }

  get thumbnailUrl(): string {
    return `${this.comic.thumbnail.path}.${this.comic.thumbnail.extension}`;
  }

  get onsaleDate(): string | undefined {
    const date = this.comic.dates.find(d => d.type === 'onsaleDate');
    return date ? date.date.split('T')[0] : undefined;
  }

  get focDate(): string | undefined {
    const date = this.comic.dates.find(d => d.type === 'focDate');
    return date ? date.date.split('T')[0] : undefined;
  }

  get printPrice(): number | undefined {
    const price = this.comic.prices.find(p => p.type === 'printPrice');
    return price ? price.price : undefined;
  }

  get truncatedTitle(): string {
    return this.comic.title.length > 30 
      ? `${this.comic.title.substring(0, 27)}...` 
      : this.comic.title;
  }

  formatDate(date: string): string {
    return date.split('T')[0];
  }
}
