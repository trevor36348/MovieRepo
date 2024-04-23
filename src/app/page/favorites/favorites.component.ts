import { Component, OnInit, OnDestroy } from '@angular/core';
import { Movie } from '../../model/movies.model'; 
import { MovieFilter } from '../../model/filter.model';
import { MoviesService } from '../../services/movies.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  title = 'Favorites List';
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  filter: MovieFilter = { title: '', minRating: 0, maxRating: 10 };
  userFavorites: string[] = [];

  private email = '';
  private authenticationSub: Subscription = new Subscription();
  private favoritesSub: Subscription = new Subscription();
  userAuth = false;

  constructor(private moviesService: MoviesService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserFavorites(); 
    this.authenticationSub = this.authService.getAuthSub().subscribe(status => {
      this.userAuth = status;
    });
    this.userAuth = this.authService.getIsAuth();
  }

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
    this.favoritesSub.unsubscribe();
  }

  loadUserFavorites(): void {
    const userKey: string | null = this.authService.getUserkey(); 
    this.email = userKey !== null ? userKey : '';
    this.favoritesSub = this.authService.getFavorites(this.email).subscribe((favorites: string[]) => {
      this.userFavorites = favorites;
      this.loadFavoriteMovies();
    });
  }

  loadFavoriteMovies(): void {
    this.filteredMovies = []; // Clear existing filtered movies
    this.userFavorites.forEach(id => {
      const movieId = parseInt(id, 10); // Convert string ID to number
      this.moviesService.getMovieById(movieId).subscribe(movie => {
        if (movie) {
          this.filteredMovies.push(movie);
        }
      });
    });
  }

  handleImageError(event: any) {
    event.target.src = '../../../assets/placeholder.png';
    event.target.alt = 'Image Not Found';
  }

  removeFavorite(movieId: string): void {
    // Implement if needed
  }

  isInFavorites(movieId: number): boolean {
    return this.userFavorites.includes(movieId.toString());
  }
}
