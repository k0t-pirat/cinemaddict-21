import { getMockCommentsPromise } from '../mocks';

export default class CommentModel {
  #comments = [];
  #handleLoad = null;
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
        this.handleLoad();
      });
  }

  get comments() {
    return this.#comments;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get handleLoad() {
    return this.#handleLoad;
  }

  set handleLoad(callback) {
    this.#handleLoad = callback;
  }
}
