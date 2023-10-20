import AbstractView from '../framework/view/abstract-view';

const createShowMoreTemplate = () => (
  `<button class="films-list__show-more">
    Show more
  </button>`
);

export default class ShowMoreView extends AbstractView {
  #handleClick = null;

  constructor({onClick}) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createShowMoreTemplate();
  }

  #clickHandler = () => {
    this.#handleClick();
  };
}

