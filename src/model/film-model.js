import { UpdateType } from '../const';
import Observable from '../framework/observable';
import { updateItem } from '../util/common';

export default class FilmModel extends Observable {
  #films = [];
  #isLoading = false;
  #filmsApiService = null;

  constructor({filmsApiService}) {
    super();
    this.#films = [];
    this.#filmsApiService = filmsApiService;
  }

  get films() {
    return this.#films;
  }

  get isLoading() {
    return this.#isLoading;
  }

  #updateFilmComments(film, updatedComments) {
    const filmIndex = this.#films.findIndex((nextFilm) => nextFilm.id === film.id);

    if (filmIndex !== -1) {
      const updatedFilm = {...film, comments: updatedComments};
      this.#films = updateItem(this.#films, updatedFilm);

      return updatedFilm;
    }

    return null;
  }

  async init() {
    this.#isLoading = true;
    try {
      const films = await this.#filmsApiService.films;
      this.#films = films;
    } catch {
      this.#films = [];
    } finally {
      this.#isLoading = false;
      this._notify(UpdateType.INIT);
    }
  }

  async updateFilm(updatedFilm) {
    try {
      const response = await this.#filmsApiService.updateFilm(updatedFilm);
      this.#films = updateItem(this.#films, response);
      this._notify(UpdateType.PATCH, response);
    } catch {
      throw new Error('Can\'t update film');
    }
  }

  removeFilmComment(commentId, film) {
    const commentIndex = film.comments.findIndex((id) => id === commentId);
    const filmComments = [
      ...film.comments.slice(0, commentIndex),
      ...film.comments.slice(commentIndex + 1),
    ];

    return this.#updateFilmComments(film, filmComments);
  }

  addFilmComment(film) {
    return this.#updateFilmComments(film, film.comments);
  }
}
