import Obervable from '../framework/observable';
import { UpdateType } from '../const';

export default class CommentModel extends Obervable {
  #comments = [];
  #isLoading = false;
  #filmModel = null;
  #commentsApiService = null;
  #isUploading = false;
  #isDeleting = false;

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
    this.#isUploading = true;
    this._notify(UpdateType.LOAD);
    try {
      const response = await this.#commentsApiService.addComment(userComment, film);
      const updatedFilm = this.#filmModel.addFilmComment(response.film);
      if (updatedFilm !== null) {
        this.#comments = response.comments;
        this._notify(UpdateType.PATCH, updatedFilm);
      }

      this.#isUploading = false;
    } catch {
      this.#isUploading = false;
      throw new Error('Can\'t add film comment');
    }
  }

  async deleteComment({commentId, film}) {
    this.#isDeleting = true;
    this._notify(UpdateType.LOAD);
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
      this.#isDeleting = false;
    } catch {
      this.#isDeleting = false;
      throw new Error('Can\'t delete film comment');
    }
  }

  get comments() {
    return this.#comments;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get isDeleting() {
    return this.#isDeleting;
  }

  get isUploading() {
    return this.#isUploading;
  }
}
