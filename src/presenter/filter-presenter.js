import { FilterType } from '../const/common';
import { render } from '../framework/render';
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

  constructor({filterContainer, filterModel, filmModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmModel = filmModel;
  }

  get activeFilter() {
    return this.#filterModel.activeFilter;
  }

  get countedFilter() {
    return getFilmFilter(this.#filmModel.films);
  }

  init() {
    render(new FilterView(this.countedFilter, this.activeFilter), this.#filterContainer);
  }
}
