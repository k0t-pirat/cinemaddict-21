import { FilterType } from '../const/common';
import AbstractView from '../framework/view/abstract-view';
import {upFirstLetter} from '../util/common';


const createFilterTemplate = (countedFilter, activeFilter) => (
  `<nav class="main-navigation">
  ${Object.entries(countedFilter).map(([filterType, filterCount]) => (
    `<a href="#${filterType}" class="main-navigation__item${filterType === activeFilter ? ' main-navigation__item--active' : ''}">
      ${upFirstLetter(filterType)} ${filterType === FilterType.ALL ? 'movies' : `<span class="main-navigation__item-count">${filterCount}</span>`}
    </a>`
  )).join('')}
  </nav>`
);

export default class FilterView extends AbstractView {
  #countedFilter = null;
  #activeFilter = '';
  #handleClick = null;

  constructor(countedFilter, activeFilter, onClick) {
    super();
    this.#countedFilter = countedFilter;
    this.#activeFilter = activeFilter;
    this.#handleClick = onClick;

    this.element.addEventListener('click', this.#clickHandler.bind(this));
  }

  get template() {
    return createFilterTemplate(this.#countedFilter, this.#activeFilter);
  }

  #clickHandler(evt) {
    const linkNode = evt.target && evt.target.closest('a');

    if (linkNode) {
      evt.preventDefault();
      const filter = linkNode.hash.slice(1);
      this.#handleClick(filter);
    }
  }
}

