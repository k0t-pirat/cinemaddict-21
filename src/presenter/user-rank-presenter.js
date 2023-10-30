import { remove, render } from '../framework/render';
import UserRankView from '../view/user-rank-view';

export default class UserRankPresenter {
  #container = null;
  #filmModel = null;
  #userRankView = null;

  constructor({container, filmModel}) {
    this.#container = container;
    this.#filmModel = filmModel;

    this.#filmModel.handleLoad = () => {
      this.init();
    };
  }

  get watchedFilmsCount() {
    const watchedFilms = this.#filmModel.films.filter((film) => film.userDetails.alreadyWatched);
    return watchedFilms.length;
  }

  init() {
    remove(this.#userRankView);

    this.#userRankView = new UserRankView(this.watchedFilmsCount);

    if (this.watchedFilmsCount !== 0) {
      render(this.#userRankView, this.#container);
    }
  }
}
