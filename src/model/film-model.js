import { getMockComments, getMockFilms } from '../mocks';

export default class FilmModel {
  constructor() {
    this.films = [];
    this.comments = [];
  }

  init() {
    this.films = getMockFilms();
    this.comments = getMockComments();
  }

  getFilms() {
    return this.films;
  }

  getComments() {
    return this.comments;
  }
}
