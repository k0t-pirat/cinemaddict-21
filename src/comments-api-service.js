import ApiService from './framework/api-service';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {
  getCommentsByFilmId(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse);
  }

  async addComment(userComment, film) {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.POST,
      body: JSON.stringify(userComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    const {movie, comments} = parsedResponse;

    return {film: this.#adaptToClient(movie), comments};
  }

  async deleteComment(commentId) {
    const response = await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });

    return response.ok;
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
}
