import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class FilmsApiService extends ApiService {
  get films() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse)
      .then((movies) => movies.map(this.#adaptToClient));
  }

  async updateFilm(film) {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parseResponse = await ApiService.parseResponse(response);

    return this.#adaptToClient(parseResponse);
  }

  #adaptToClient(film) {
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
    delete clientFilm.filmInfo.release.release_country;

    return clientFilm;
  }

  #adaptToServer(film) {
    const serverFilm = {
      ...film,
      'film_info': {
        ...film.filmInfo,
        'alternative_title': film.filmInfo.altTitle,
        'total_rating': film.filmInfo.totalRating,
        'age_rating': film.filmInfo.ageRating,
        genre: film.filmInfo.genres,
        release: {
          ...film.filmInfo.release,
          'release_country': film.filmInfo.release.releaseCountry,
        },
      },
      'user_details': {
        watchlist: film.userDetails.inWatchlist,
        'already_watched': film.userDetails.alreadyWatched,
        'watching_date': film.userDetails.watchingDate,
        favorite: film.userDetails.isFavorite,
      }
    };

    delete serverFilm.filmInfo;
    delete serverFilm.userDetails;

    delete serverFilm.film_info.altTitle;
    delete serverFilm.film_info.totalRating;
    delete serverFilm.film_info.ageRating;
    delete serverFilm.film_info.genres;
    delete serverFilm.film_info.release.releaseCountry;

    return serverFilm;
  }
}
