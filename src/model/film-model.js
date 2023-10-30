import { getMockFilmsPromise } from '../mocks';

export default class FilmModel {
  #films = [];
  #callback = null;
  #isLoading = false;
  #loadHandlers = [];

  constructor() {
    this.#films = [];
  }

  init() {
    this.#isLoading = true;
    getMockFilmsPromise()
      .then((loadedFilms) => {
        this.#films = loadedFilms;
        this.#isLoading = false;
        // this.#callback();
        this.handleLoad.forEach((handler) => {
          handler();
        });
      })
      .catch(() => {
        this.#films = [];
      });
  }

  get films() {
    return this.#films;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get callback() {
    return this.#callback;
  }

  set callback(callback) {
    this.#callback = callback;
  }

  get handleLoad() {
    return this.#loadHandlers;
  }

  set handleLoad(handleLoad) {
    this.#loadHandlers.push(handleLoad);
  }
}
