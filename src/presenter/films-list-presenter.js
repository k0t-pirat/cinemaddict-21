import { RenderPosition, remove, render } from '../framework/render';
import FilmsListView from '../view/films-list-view';
import SortView from '../view/sort-view';
import FilmsEmptyView from '../view/films-empty-view';
import FilmPresenter from './film-presenter';
import ShowMorePresenter from './show-more-presenter';
import { SortType, UpdateType, UserAction } from '../const';
import { sortFilms } from '../util/sort';
import LoaderView from '../view/loader-view';
import { filterFilms } from '../util/common';
import { FilterType } from '../const/common';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class FilmsListPresenter {
  #filmsContainer = null;
  #filmsEmptyView = new FilmsEmptyView(FilterType.ALL);
  #filmsListView = new FilmsListView();
  #filterModel = null;
  #filmModel = null;
  #commentModel = null;
  #films = [];

  #showMorePresenter = null;
  #filmPresenters = new Map();
  #resetAllPresenters = null;
  #checkIfPresenterEditing = null;

  #sortView = null;
  #activeSortType = SortType.DEFAULT;
  #loaderView = new LoaderView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({filmsContainer, filterModel, filmModel, commentModel, presenterStore}) {
    this.#filmsContainer = filmsContainer;
    this.#filterModel = filterModel;
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;
    this.#filmPresenters = presenterStore.filmPresenters;
    this.#resetAllPresenters = presenterStore.resetAllPresenters;
    this.#checkIfPresenterEditing = presenterStore.checkIfPresenterEditing;
  }

  init() {
    this.#renderAll();
    this.#filmModel.addObserver((updateType, update) => {
      switch (updateType) {
        case UpdateType.INIT:
          this.#handleDataLoad();
          break;
        case UpdateType.PATCH:
          if (this.#filteredFilms.some((film) => film.id === update.id) === this.#films.some((film) => film.id === update.id)) {
            this.#films = this.#filteredFilms;
            this.#filmPresenters.get(update.id)?.init(update);
          } else {
            this.#films = this.#filteredFilms;
            this.#clearList(this.#filteredFilms.some((film) => film.id === update.id) ? update.id : null);
            this.#renderList();
          }
          break;
      }
    });
    this.#filterModel.addObserver(() => {
      this.#activeSortType = SortType.DEFAULT;
      this.#handleDataLoad();
    });
  }

  get #modelFilms() {
    //TODO change to default
    // return [...this.#filmModel.films].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
    return [...this.#filmModel.films];
  }

  get #filteredFilms() {
    return filterFilms[this.#filterModel.activeFilter](this.#modelFilms);
  }

  #renderGroup = ({currentCount, nextCount}) => {
    // this.#handleModeChange();
    for (const film of this.#films.slice(currentCount, nextCount)) {
      const filmPresenter = new FilmPresenter({
        commentModel: this.#commentModel,
        filmsContainer: this.#filmsListView.filmsContainer,
        onModeChange: this.#handleModeChange,
        onDataChange: this.#handleFilmChange,
        onCommentChange: this.#handleCommentChange,
        checkIfPresenterEditing: this.#checkIfPresenterEditing,
      });
      filmPresenter.init(film);
      this.#filmPresenters.set(film.id, filmPresenter);
    }
  };

  #renderList() {
    if (this.#films.length === 0) {
      this.#filmsEmptyView = new FilmsEmptyView(this.#filterModel.activeFilter);
      render(this.#filmsEmptyView, this.#filmsContainer, RenderPosition.AFTERBEGIN);
      return;
    }
    this.#sortView = new SortView({onSortClick: this.#handleSortChange, activeSortType: this.#activeSortType});
    this.#showMorePresenter = new ShowMorePresenter({renderGroup: this.#renderGroup, showMoreContainer: this.#filmsListView.element});

    render(this.#sortView, this.#filmsContainer, RenderPosition.BEFOREBEGIN);

    render(this.#filmsListView, this.#filmsContainer, RenderPosition.AFTERBEGIN);
    this.#showMorePresenter.init(this.#films.length);
  }

  #clearList(presenterId) {
    if (presenterId) {
      this.#filmPresenters.get(presenterId)?.destroy();
      this.#filmPresenters.delete(presenterId);
    } else {
      this.#filmPresenters.forEach((presenter) => presenter.destroy());
      this.#filmPresenters.clear();
    }

    if (this.#showMorePresenter) {
      this.#showMorePresenter.destroy();
      this.#showMorePresenter = null;
    }

    remove(this.#filmsEmptyView);
    remove(this.#filmsListView);
    remove(this.#sortView);
  }

  #renderAll() {
    if (this.#filmModel.isLoading) {
      render(this.#loaderView, this.#filmsContainer);
      return;
    }
    this.#films = this.#filteredFilms;

    this.#renderList();
  }

  #handleDataLoad() {
    if (!this.#filmModel.isLoading) {
      remove(this.#loaderView);
      this.#clearList();
      this.#renderAll();
    }
  }

  #handleModeChange = () => {
    // this.#filmPresenters.forEach((presenter) => presenter.resetView());
    this.#resetAllPresenters();
  };

  #handleFilmChange = async (updatedFilm, userAction) => {
    this.#uiBlocker.block();
    try {
      await this.#filmModel.updateFilm(updatedFilm);
    } catch (err) {
      this.#filmPresenters.get(updatedFilm.id).setAborting(userAction);
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
      this.#filmPresenters.get(payload.film.id).setAborting(userAction);
    }
    this.#uiBlocker.unblock();
  };

  #handleSortChange = (sortType) => {
    this.#activeSortType = sortType;
    this.#films = sortFilms[sortType](this.#filteredFilms);

    this.#clearList();
    this.#renderList();
  };
}
