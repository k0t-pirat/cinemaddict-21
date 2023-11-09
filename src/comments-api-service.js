import ApiService from './framework/api-service';

export default class CommentsApiService extends ApiService {
  getCommentsByFilmId(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(ApiService.parseResponse);
  }
}
