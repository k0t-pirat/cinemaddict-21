import { getMockCommentsPromise } from '../mocks';

export default class CommentModel {
  #comments = [];
  #callback = null;
  #isLoading = false;

  constructor() {
    this.#comments = [];
  }

  init() {
    this.#isLoading = true;
    getMockCommentsPromise()
      .then((loadedComments) => {
        this.#comments = loadedComments;
        this.#isLoading = false;
        this.callback();
      })
      .catch(() => {
        this.#comments = [];
      });
  }

  get comments() {
    return this.#comments;
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
}
