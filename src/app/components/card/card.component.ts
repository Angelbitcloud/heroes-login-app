import { Component, Input, OnInit } from '@angular/core';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() comic: any;
  isFavorite: boolean = false;

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.checkIfFavorite();
  }

  checkIfFavorite(): void {
    const favorites = this.favoritesService.getFavorites();
    this.isFavorite = favorites.some(favorite => favorite.id === this.comic.id);
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.favoritesService.removeFavorite(this.comic.id);
    } else {
      this.favoritesService.addFavorite(this.comic);
    }
    this.isFavorite = !this.isFavorite;
  }
}
