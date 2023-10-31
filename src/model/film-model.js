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
}
