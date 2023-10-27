import { remove, render } from '../framework/render';
import ShowMoreView from '../view/show-more-view';

const COUNT_STEP = 5;

export default class ShowMorePresenter {
  #showMoreView = null;
  #currentCount = 0;
  #showMoreContainer = null;
  #filmsLength = 0;
  #renderGroup = null;

  constructor({renderGroup, showMoreContainer}) {
    this.#renderGroup = renderGroup;
    this.#showMoreContainer = showMoreContainer;
    this.#showMoreView = new ShowMoreView({
      onClick: this.#handleClick,
    });
  }

  init(filmsLength) {
    this.#filmsLength = filmsLength;
    this.#renderGroup({currentCount: this.#currentCount, nextCount: this.#currentCount + COUNT_STEP});

    if (this.#filmsLength > COUNT_STEP) {
      render(this.#showMoreView, this.#showMoreContainer);
    }
  }

  #remove() {
    if (this.#filmsLength <= this.#currentCount + COUNT_STEP) {
      remove(this.#showMoreView);
    }
  }

  #handleClick = () => {
    this.#currentCount = this.#currentCount + COUNT_STEP;
    this.#renderGroup({currentCount: this.#currentCount, nextCount: this.#currentCount + COUNT_STEP});
    this.#remove();
  };
}
