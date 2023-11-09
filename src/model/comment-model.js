// import { getMockCommentsPromise } from '../mocks';
import Obervable from '../framework/observable';
import { UpdateType } from '../const';

// const getNewCommentId = (allComments) => {
//   const ids = allComments.map((comment) => comment.id);
//   const maxId = Math.max(...ids);
//   const nextId = Number.isFinite(maxId) ? maxId + 1 : 1;

//   return nextId;
// };

// const getNewComment = (userComment, allComments) => {
//   const newCommentId = getNewCommentId(allComments);
//   return {
//     ...userComment,
//     id: newCommentId,
//     author: 'vasya',
//     date: new Date().toISOString(),
//   };
// };

export default class CommentModel extends Obervable {
  #comments = [];
  #isLoading = false;
  #filmModel = null;
  #commentsApiService = null;
  #filmId = null;

  constructor({filmModel, commentsApiService}) {
    super();
    this.#filmModel = filmModel;
    this.#commentsApiService = commentsApiService;
  }

  async init(filmId) {
    this.#filmId = filmId;
    this.#isLoading = true;
    try {
      const comments = await this.#commentsApiService.getCommentsByFilmId(filmId);
      this.#comments = comments;
    } catch {
      this.#comments = [];
    } finally {
      this.#isLoading = false;
      this._notify(UpdateType.INIT, this.#comments);
    }
  }

  get comments() {
    return this.#comments;
  }

  get isLoading() {
    return this.#isLoading;
  }

  deleteComment() {
    return null;
  }

  addComment() {
    return null;
  }

  // deleteComment({commentId, film}) {
  //   const commentIndex = this.#comments.findIndex((comment) => comment.id === commentId);
  //   const updatedFilm = this.#filmModel.removeFilmComment(commentId, film);

  //   if (updatedFilm !== null) {
  //     this.#comments = [
  //       ...this.#comments.slice(0, commentIndex),
  //       ...this.#comments.slice(commentIndex + 1),
  //     ];
  //     this._notify(UpdateType.PATCH, updatedFilm);
  //   }
  // }

  // addComment({userComment, film}) {
  //   const newComment = getNewComment(userComment, this.#comments);
  //   const updatedFilm = this.#filmModel.addFilmComment(newComment, film);

  //   if (updatedFilm !== null) {
  //     this.#comments = [newComment, ...this.#comments];
  //     this._notify(UpdateType.PATCH, updatedFilm);
  //   }
  // }
}
