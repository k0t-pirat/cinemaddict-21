import { SortType, UpdateType, UserAction } from '../const';
import { remove, render } from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { sortFilms } from '../util/sort';
import FilmsListView from '../view/films-list-view';
import FilmPresenter from './film-presenter';

const EXTRA_FILMS_COUNT = 2;
const ExtraTitle = {
  RATED: 'Top rated',
  COMMENTED: 'Most commented',
};
const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const getRatedFilms = (films) => {
  const ratedFilms = sortFilms[SortType.RATING](films);
  return ratedFilms.slice(0, EXTRA_FILMS_COUNT);
};
const getCommentedFilms = (films) => {
  const commentedFilms = sortFilms[SortType.COMMENTS](films);
  return commentedFilms.slice(0, EXTRA_FILMS_COUNT);
};

const compareCommentedFilms = (oldCommentedFilms, newCommentedFilms) => {
  const oldIdsString = oldCommentedFilms.map((film) => film.id).join('/');
  const newIdsString = newCommentedFilms.map((film) => film.id).join('/');

  return oldIdsString === newIdsString;
};

const checkIfNoComments = (commentedFilms) => {
  let allCommentsLength = 0;
  commentedFilms.forEach((film) => {
    allCommentsLength += film.comments.length;
  });

  return allCommentsLength === 0;
};
const checkIfNoRating = (ratedFilms) => {
  let allRatingSum = 0;
  ratedFilms.forEach((film) => {
    allRatingSum += film.filmInfo.totalRating;
  });

  return allRatingSum === 0;
};

export default class FilmsExtraPresenter {
  #filmsContainer = null;
  #filmsRatedView = new FilmsListView(ExtraTitle.RATED);
  #filmsCommentedView = new FilmsListView(ExtraTitle.COMMENTED);
  #filmModel = null;
  #commentModel = null;
  #ratedFilms = [];
  #commentedFilms = [];
  #resetAllPresenters = null;

  #filmRatedPresenters = new Map();
  #filmCommentedPresenters = new Map();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({filmsContainer, filmModel, commentModel, presenterStore}) {
    this.#filmsContainer = filmsContainer;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#filmRatedPresenters = presenterStore.filmRatedPresenters;
    this.#filmCommentedPresenters = presenterStore.filmCommentedPresenters;
    this.#resetAllPresenters = presenterStore.resetAllPresenters;
  }

  init() {
    this.#filmModel.addObserver((updateType, update) => {
      switch (updateType) {
        case UpdateType.INIT:
          this.#renderLists();
          break;
        case UpdateType.PATCH:
          this.#filmRatedPresenters.get(update.id)?.init(update);
          this.#filmCommentedPresenters.get(update.id)?.init(update);
          break;
      }
    });
    this.#commentModel.addObserver((updateType) => {
      if (updateType === UpdateType.PATCH) {
        const commentedFilms = getCommentedFilms(this.#filmModel.films);
        const areCommentedFilmsEqual = compareCommentedFilms(this.#commentedFilms, commentedFilms);
        if (!areCommentedFilmsEqual) {
          this.#commentedFilms = commentedFilms;
          this.#rerenderCommentedList();
        }
      }
    });
  }

  #handleModeChange = () => {
    // this.#filmRatedPresenters.forEach((presenter) => presenter.resetView());
    // this.#filmCommentedPresenters.forEach((presenter) => presenter.resetView());
    this.#resetAllPresenters();
  };

  #handleFilmChange = async (updatedFilm, userAction) => {
    this.#uiBlocker.block();
    try {
      await this.#filmModel.updateFilm(updatedFilm);
    } catch (err) {
      this.#filmRatedPresenters.get(updatedFilm.id).setAborting(userAction);
    }
    this.#uiBlocker.unblock();
  };

  #handleCommentChange = async (payload, userAction) => {
    this.#uiBlocker.block();
    try {
      if (userAction === UserAction.DELETE) {
        await this.#commentModel.deleteComment(payload);
      } else if (userAction === UserAction.ADD) {
        await this.#commentModel.addComment(payload);
      }
    } catch {
      this.#filmRatedPresenters.get(payload.film.id).setAborting(userAction);
    }
    this.#uiBlocker.unblock();
  };

  #rerenderCommentedList() {
    this.#filmCommentedPresenters.forEach((presenter) => presenter.destroy());
    this.#filmCommentedPresenters.clear();
    remove(this.#filmsCommentedView);
    this.#renderCommentedFilms();
  }

  #renderLists() {
    const {films} = this.#filmModel;
    this.#ratedFilms = getRatedFilms(films);
    this.#commentedFilms = getCommentedFilms(films);

    this.#renderRatedFilms();
    this.#renderCommentedFilms();
  }

  #renderRatedFilms() {
    if (checkIfNoRating(this.#ratedFilms)) {
      return;
    }
    render(this.#filmsRatedView, this.#filmsContainer);

    for (const film of this.#ratedFilms) {
      const filmPresenter = new FilmPresenter({
        commentModel: this.#commentModel,
        filmsContainer: this.#filmsRatedView.filmsContainer,
        onModeChange: this.#handleModeChange,
        onDataChange: this.#handleFilmChange,
        onCommentChange: this.#handleCommentChange,
      });
      filmPresenter.init(film);
      this.#filmRatedPresenters.set(film.id, filmPresenter);
    }
  }

  #renderCommentedFilms() {
    if (checkIfNoComments(this.#commentedFilms)) {
      return;
    }
    render(this.#filmsCommentedView, this.#filmsContainer);
    for (const film of this.#commentedFilms) {
      const filmPresenter = new FilmPresenter({
        commentModel: this.#commentModel,
        filmsContainer: this.#filmsCommentedView.filmsContainer,
        onModeChange: this.#handleModeChange,
        onDataChange: this.#handleFilmChange,
        onCommentChange: this.#handleCommentChange,
      });
      filmPresenter.init(film);
      this.#filmCommentedPresenters.set(film.id, filmPresenter);
    }
  }
}

