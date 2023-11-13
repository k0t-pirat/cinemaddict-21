import { SortType } from '../const';
import AbstractView from '../framework/view/abstract-view';

const ACTIVE_SORT_TYPES_COUNT = 3;

const createSortTemplate = (activeSortType) => (
  `<ul class="sort">
  ${Object.values(SortType).slice(0, ACTIVE_SORT_TYPES_COUNT).map((sortType) => (
    `<li>
      <a href="#" data-sort-type="${sortType}" class="sort__button${sortType === activeSortType ? ' sort__button--active' : ''}">
        Sort by ${sortType}
      </a>
    </li>`
  )).join('')}
  </ul>`
);

export default class SortView extends AbstractView {
  #activeSortType = SortType.DEFAULT;
  #handleSortClick = null;

  constructor({activeSortType, onSortClick} = {}) {
    super();
    this.#handleSortClick = onSortClick;
    this.#activeSortType = activeSortType;

    this.element.addEventListener('click', this.#sortClickHandler);
  }

  get template() {
    return createSortTemplate(this.#activeSortType);
  }

  #sortClickHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    const {sortType} = evt.target.dataset;

    if (this.#activeSortType !== sortType) {
      this.#handleSortClick(evt.target.dataset.sortType);
    }
  };
}

