import Obervable from '../framework/observable';
import { UpdateType } from '../const';

export default class CommentModel extends Obervable {
  #comments = [];
  #isLoading = false;
  #filmModel = null;
  #commentsApiService = null;

  constructor({filmModel, commentsApiService}) {
    super();
    this.#filmModel = filmModel;
    this.#commentsApiService = commentsApiService;
  }

  async init(filmId) {
    this.#isLoading = true;
    try {
      const comments = await this.#commentsApiService.getCommentsByFilmId(filmId);
      this.#comments = comments;
    } catch {
      this.#comments = [];
    } finally {
      this.#isLoading = false;
      this._notify(UpdateType.INIT, this.#comments);
    }
  }

  async addComment({userComment, film}) {
    try {
      const response = await this.#commentsApiService.addComment(userComment, film);
      const updatedFilm = this.#filmModel.addFilmComment(response.film);
      if (updatedFilm !== null) {
        this.#comments = response.comments;
        this._notify(UpdateType.PATCH, updatedFilm);
      }
    } catch {
      throw new Error('Can\'t add film comment');
    }
  }

  async deleteComment({commentId, film}) {
    try {
      const response = await this.#commentsApiService.deleteComment(commentId);

      if (response) {
        const commentIndex = this.#comments.findIndex((comment) => comment.id === commentId);
        const updatedFilm = this.#filmModel.removeFilmComment(commentId, film);

        if (updatedFilm !== null) {
          this.#comments = [
            ...this.#comments.slice(0, commentIndex),
            ...this.#comments.slice(commentIndex + 1),
          ];
          this._notify(UpdateType.PATCH, updatedFilm);
        }
      }
    } catch {
      throw new Error('Can\'t delete film comment');
    }
  }

  get comments() {
    return this.#comments;
  }

  get isLoading() {
    return this.#isLoading;
  }
}
