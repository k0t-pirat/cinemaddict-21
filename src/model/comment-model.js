import { getMockCommentsPromise } from '../mocks';

export default class CommentModel {
  #comments = [];
  #onLoad = null;
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
        this.onLoad();
      });
  }

  get comments() {
    return this.#comments;
  }

  get isLoading() {
    return this.#isLoading;
  }

  get onLoad() {
    return this.#onLoad;
  }

  set onLoad(callback) {
    this.#onLoad = callback;
  }
}
