import { UpdateType } from '../const';
import Observable from '../framework/observable';
import { getMockFilmsPromise } from '../mocks';
import { updateItem } from '../util/common';

export default class FilmModel extends Observable {
  #films = [];
  #isLoading = false;

  constructor() {
    super();
    this.#films = [];
  }

  init() {
    this.#isLoading = true;
    getMockFilmsPromise()
      .then((loadedFilms) => {
        this.#films = loadedFilms;
        this.#isLoading = false;
        this._notify(UpdateType.INIT);
      });
    // .catch(() => {
    //   throw new Error('catch error in getMockFilmsPromise');
    // });
  }

  updateFilm(updatedFilm) {
    this.#films = updateItem(this.#films, updatedFilm);
    this._notify(UpdateType.PATCH, updatedFilm);
  }

  get films() {
    return this.#films;
  }

  get isLoading() {
    return this.#isLoading;
  }

  removeFilmComment(commentId) {
    const currentFilmIndex = this.#films.findIndex((film) => film.comments.includes(commentId));
    const currentFilm = this.#films[currentFilmIndex];

    if (currentFilm) {
      const commentIndex = currentFilm.comments.findIndex((id) => id === commentId);
      if (commentIndex !== -1) {
        currentFilm.comments = [
          ...currentFilm.comments.slice(0, commentIndex),
          ...currentFilm.comments.slice(commentIndex + 1),
        ];
        this.#films = [
          ...this.#films.slice(0, currentFilmIndex),
          currentFilm,
          ...this.#films.slice(currentFilmIndex + 1),
        ];

        return currentFilm;
      }
    }

    return null;
  }

  addFilmComment(addedComment, filmId) {
    const currentFilmIndex = this.#films.findIndex((film) => film.id === filmId);
    const currentFilm = this.#films[currentFilmIndex];

    if (currentFilm) {
      currentFilm.comments = [
        ...currentFilm.comments.slice(),
        addedComment.id,
      ];
      this.#films = [
        ...this.#films.slice(0, currentFilmIndex),
        currentFilm,
        ...this.#films.slice(currentFilmIndex + 1),
      ];

      return currentFilm;
    }

    return null;
  }
}
