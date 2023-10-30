import Observable from '../framework/observable';
import { getMockFilmsPromise } from '../mocks';

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
        this._notify();
      })
      .catch(() => {
        throw new Error('catch error in getMockFilmsPromise');
      });
  }

  get films() {
    return this.#films;
  }

  get isLoading() {
    return this.#isLoading;
  }
}
