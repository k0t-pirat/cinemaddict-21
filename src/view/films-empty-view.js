import { FilterType } from '../const/common';
import AbstractView from '../framework/view/abstract-view';

const createFilmsEmptyTemplate = (text) => (
  `<section class="films-list">
    <h2 class="films-list__title">${text}</h2>
  </section>`
);

const getTextByFilter = (filter) => {
  switch (true) {
    case filter === FilterType.FAVORITES:
      return 'There are no favorite movies now';
    case filter === FilterType.HISTORY:
      return 'There are no watched movies now';
    case filter === FilterType.WATCHLIST:
      return 'There are no movies to watch now';
    default:
      return 'There are no movies in our database';
  }
};

export default class FilmsEmptyView extends AbstractView {
  #innerText = '';

  constructor(filter) {
    super();
    this.#innerText = getTextByFilter(filter);
  }

  get template() {
    return createFilmsEmptyTemplate(this.#innerText);
  }
}

