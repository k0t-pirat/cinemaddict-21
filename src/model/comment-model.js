import { getMockCommentsPromise } from '../mocks';
import Obervable from '../framework/observable';
import { UpdateType } from '../const';

const getNewCommentId = (allComments) => {
  const ids = allComments.map((comment) => comment.id);
  const maxId = Math.max(...ids);
  const nextId = Number.isFinite(maxId) ? maxId + 1 : 1;

  return nextId;
};

export default class CommentModel extends Obervable {
  #comments = [];
  #isLoading = false;
  #filmModel = null;

  constructor(filmModel) {
    super();
    this.#filmModel = filmModel;
  }

  init() {
    this.#isLoading = true;
    getMockCommentsPromise()
      .then((loadedComments) => {
        this.#comments = loadedComments;
        this.#isLoading = false;
        this._notify(UpdateType.INIT);
      });
  }

  get comments() {
    return this.#comments;
  }

  get isLoading() {
    return this.#isLoading;
  }

  deleteComment(id) {
    const index = this.#comments.findIndex((comment) => comment.id === id);
    if (index !== -1) {
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1),
      ];
      const film = this.#filmModel.removeFilmComment(id);

      if (film !== null) {
        this._notify(UpdateType.PATCH, film);
      }
    }
  }

  addComment({newComment, film}) {
    const newCommentId = getNewCommentId(this.#comments);
    const addedComment = {
      ...newComment,
      id: newCommentId,
      author: 'vasya',
      date: new Date().toISOString(),
    };

    const currentFilm = this.#filmModel.addFilmComment(addedComment, film.id);

    if (currentFilm !== null) {
      this.#comments = [addedComment, ...this.#comments];
      this._notify(UpdateType.PATCH, currentFilm);
    }
  }
}
