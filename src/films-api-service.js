import ApiService from './framework/api-service';

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse)
      .then(this.#adaptToClient);
  }

  #adaptToClient(films) {
    return films.map((film) => {
      const clientFilm = {
        ...film,
        filmInfo: {
          ...film.film_info,
          altTitle: film.film_info.alternative_title,
          totalRating: film.film_info.total_rating,
          ageRating: film.film_info.age_rating,
          genres: film.film_info.genre,
          release: {
            ...film.film_info.release,
            releaseCountry: film.film_info.release.release_country,
          },
        },
        userDetails: {
          inWatchlist: film.user_details.watchlist,
          alreadyWatched: film.user_details.already_watched,
          watchingDate: film.user_details.watching_date,
          isFavorite: film.user_details.favorite,
        }
      };

      delete clientFilm.film_info;
      delete clientFilm.user_details;

      delete clientFilm.filmInfo.alternative_title;
      delete clientFilm.filmInfo.total_rating;
      delete clientFilm.filmInfo.age_rating;
      delete clientFilm.filmInfo.genre;

      return clientFilm;
    });
  }
}
