import AbstractView from '../framework/view/abstract-view';

const createFilmsWrapperTemplate = () => (
  `<section class="films">
  </section>`
);

export default class FilmsWrapperView extends AbstractView {
  get template() {
    return createFilmsWrapperTemplate();
  }

  get #extraFilmsElements() {
    return this.element.querySelectorAll('.films-list--extra');
  }

  get ratedFilmsElement() {
    return this.#extraFilmsElements[0];
  }

  get commentedFilmsElement() {
    return this.#extraFilmsElements[1];
  }
}

