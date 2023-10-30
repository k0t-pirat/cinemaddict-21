import { remove, render } from '../framework/render';
import FilmsListView from '../view/films-list-view';
import SortView from '../view/sort-view';
import FilmsEmptyView from '../view/films-empty-view';
import FilmsWrapperView from '../view/films-wrapper-view';
import FilmPresenter from './film-presenter';
import ShowMorePresenter from './show-more-presenter';
import { updateItem } from '../util/common';
import { SortType } from '../const';
import { sortFilms } from '../util/sort';
import LoaderView from '../view/loader-view';

export default class FilmsListPresenter {
  #mainContainer = null;
  #filmsWrapperView = null;
  #filmsEmptyView = null;
  #filmsListView = null;
  #filmModel = null;
  #commentModel = null;
  #films = [];
  #allComments = [];
  #showMorePresenter = null;
  #filmPresenters = new Map();
  #sortView = null;
  #activeSortType = SortType.DEFAULT;
  #defaultFilms = [];
  #loaderView = new LoaderView();

  constructor({container, filmModel, commentModel}) {
    this.#mainContainer = container;
    this.#filmsWrapperView = new FilmsWrapperView();
    this.#filmsEmptyView = new FilmsEmptyView();
    this.#filmsListView = new FilmsListView();
    this.#filmModel = filmModel;
    this.#commentModel = commentModel;

    this.#commentModel.callback = () => {
      this.#update();
    };
    this.#filmModel.handleLoad = () => {
      this.#update();
    };
  }

  init() {
    if (this.#filmModel.isLoading && this.#filmModel.isLoading) {
      render(this.#loaderView, this.#mainContainer);
      return;
    }
    this.#films = [...this.#filmModel.films];
    this.#defaultFilms = [...this.#filmModel.films];
    this.#allComments = [...this.#commentModel.comments];

    this.#renderList();
  }

  #update() {
    if (!(this.#filmModel.isLoading && this.#filmModel.isLoading)) {
      remove(this.#loaderView);
      this.#clearList();
      this.init();
    }
  }

  #renderGroup = ({currentCount, nextCount}) => {
    this.#handleModeChange();
    for (const film of this.#films.slice(currentCount, nextCount)) {
      const filmPresenter = new FilmPresenter({
        allComments: this.#allComments,
        filmsContainer: this.#filmsListView.filmsContainer,
        onModeChange: this.#handleModeChange,
        onDataChange: this.#handleFilmChange,
      });
      filmPresenter.init(film);
      this.#filmPresenters.set(film.id, filmPresenter);
    }
  };

  #renderList() {
    this.#sortView = new SortView({onSortClick: this.#handleSortChange, activeSortType: this.#activeSortType});
    this.#showMorePresenter = new ShowMorePresenter({renderGroup: this.#renderGroup, showMoreContainer: this.#filmsListView.element});

    render(this.#sortView, this.#mainContainer);
    render(this.#filmsWrapperView, this.#mainContainer);

    if (this.#films.length === 0) {
      render(this.#filmsEmptyView, this.#filmsWrapperView.element);
      return;
    }

    render(this.#filmsListView, this.#filmsWrapperView.element);
    this.#showMorePresenter.init(this.#films.length);
  }

  #clearList() {
    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
    if (this.#showMorePresenter) {
      this.#showMorePresenter.destroy();
    }

    remove(this.#filmsListView);
    remove(this.#filmsWrapperView);
    remove(this.#sortView);
  }

  #handleModeChange = () => {
    this.#filmPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#defaultFilms = updateItem(this.#defaultFilms, updatedFilm);
    this.#filmPresenters.get(updatedFilm.id).init(updatedFilm);
  };

  #handleSortChange = (sortType) => {
    if (this.#activeSortType === sortType) {
      return;
    }
    this.#activeSortType = sortType;
    const films = [...this.#defaultFilms];
    this.#films = sortFilms[sortType](films);

    this.#clearList();
    this.#renderList();
  };
}
