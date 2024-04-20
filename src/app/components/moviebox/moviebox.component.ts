import { Component, OnInit } from '@angular/core';
import { Movie } from '../../model/movies.model';
import { MovieFilter } from '../../model/filter.model';
import { MoviesService } from '../../services/movies.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moviebox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moviebox.component.html',
  styleUrl: './moviebox.component.css'
})
export class MovieboxComponent implements OnInit {
  title = 'Movie List';
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  filter: MovieFilter = { title: '', minRating: 0, maxRating: 10 };
  userFavorites: String[] = [];

  private email = "";

  private authenticationSub: Subscription = new Subscription;
  userAuth = false;

  constructor(private moviesService: MoviesService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getMovies();
    this.authenticationSub = this.authService.getAuthSub().subscribe(status => {
      this.userAuth = status;
      if(this.userAuth) {
        this.loadUserFavorites();
      }
    })
    this.userAuth = this.authService.getIsAuth();
  }

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }

  loadUserFavorites(): void {
    const userKey = this.authService.getUserkey();
    this.email = userKey !== null ? userKey : '';
    this.userFavorites = this.authService.getFavorites(this.email)
  }

  getMovies(): void {
    this.moviesService.getMovies()
      .subscribe(movies => {
        this.movies = movies;
        this.applyFilter();
      });
  }

  handleImageError(event: any) {
    event.target.src = '../../../assets/placeholder.png';
    event.target.alt = 'Image Not Found';
  }

  applyFilter() {
    this.filteredMovies = this.movies.filter(movie =>
      movie.movie.toLowerCase().includes(this.filter.title.toLowerCase()) &&
      movie.rating >= this.filter.minRating &&
      movie.rating <= this.filter.maxRating
    );
  }

  clearFilter() {
    this.filter = { title: '', minRating: 0, maxRating: 10 };
    this.applyFilter();
  }

  addToFavorites(movieId: number): void {
    if(this.userAuth && movieId != null) {
      console.log(this.userFavorites);

      const userKey = this.authService.getUserkey();
      this.email = userKey !== null ? userKey : '';

      this.authService.setFavorite(this.email, movieId);
      
      console.log('Movie ID added to favorites:', movieId, ' ', this.email);
    } else {
      console.log('NO');
    }
  }

  removeFavorite(movieId: number): void {

  }

  isInFavorites(movieId: number): boolean {
    return this.userFavorites.includes(movieId.toString());
  }
}
