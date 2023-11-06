import { getMockCommentsPromise } from '../mocks';
import Obervable from '../framework/observable';
import { UpdateType } from '../const';

const getNewCommentId = (allComments) => {
  const ids = allComments.map((comment) => comment.id);
  const maxId = Math.max(...ids);
  const nextId = Number.isFinite(maxId) ? maxId + 1 : 1;

  return nextId;
};

const getNewComment = (userComment, allComments) => {
  const newCommentId = getNewCommentId(allComments);
  return {
    ...userComment,
    id: newCommentId,
    author: 'vasya',
    date: new Date().toISOString(),
  };
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

  deleteComment({commentId, film}) {
    const commentIndex = this.#comments.findIndex((comment) => comment.id === commentId);
    const updatedFilm = this.#filmModel.removeFilmComment(commentId, film);

    if (updatedFilm !== null) {
      this.#comments = [
        ...this.#comments.slice(0, commentIndex),
        ...this.#comments.slice(commentIndex + 1),
      ];
      this._notify(UpdateType.PATCH, updatedFilm);
    }
  }

  addComment({userComment, film}) {
    const newComment = getNewComment(userComment, this.#comments);
    const updatedFilm = this.#filmModel.addFilmComment(newComment, film);

    if (updatedFilm !== null) {
      this.#comments = [newComment, ...this.#comments];
      this._notify(UpdateType.PATCH, updatedFilm);
    }
  }
}
