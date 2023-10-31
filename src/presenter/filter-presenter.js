import { FilterType } from '../const/common';
import { RenderPosition, remove, render } from '../framework/render';
import FilterView from '../view/fitler-view';

const getFilmFilter = (films) => {
  const filtersByFilms = films.map((film) => film.userDetails);
  const filmFilter = {
    [FilterType.ALL]: 0,
    [FilterType.WATCHLIST]: filtersByFilms.filter((fbf) => fbf.inWatchlist).length,
    [FilterType.HISTORY]: filtersByFilms.filter((fbf) => fbf.alreadyWatched).length,
    [FilterType.FAVORITES]: filtersByFilms.filter((fbf) => fbf.isFavorite).length,
  };

  return filmFilter;
};

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmModel = null;
  #filterView = null;

  constructor({filterContainer, filterModel, filmModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmModel = filmModel;
  }

  get countedFilter() {
    return getFilmFilter(this.#filmModel.films);
  }

  init() {
    this.#render();

    this.#filmModel.addObserver(() => {
      this.#render();
    });
    this.#filterModel.addObserver(() => {
      this.#render();
    });
  }

  #render() {
    remove(this.#filterView);
    this.#filterView = new FilterView(this.countedFilter, this.#filterModel.activeFilter, this.#handleFilterClick.bind(this));
    render(this.#filterView, this.#filterContainer, RenderPosition.AFTERBEGIN);
  }

  #handleFilterClick(filter) {
    if (this.#filterModel.activeFilter !== filter) {
      this.#filterModel.activeFilter = filter;
    }
  }
}
