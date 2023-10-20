import { getMockComments, getMockFilms } from '../mocks';

export default class FilmModel {
  #films = [];
  #comments = [];

  constructor() {
    this.#films = [];
    this.#comments = [];
  }

  init() {
    this.#films = getMockFilms();
    this.#comments = getMockComments();
  }

  get films() {
    return this.#films;
  }

  get comments() {
    return this.#comments;
  }
}
