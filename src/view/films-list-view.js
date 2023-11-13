import AbstractView from '../framework/view/abstract-view';

const createFilmsListTemplate = (title) => (
  `<section class="films-list${title ? ' films-list--extra' : ''}">
    <h2 class="films-list__title${title ? '' : ' visually-hidden'}">${title ? title : 'All movies. Upcoming'}</h2>
    <div class="films-list__container"></div>
    <!-- show more button -->
  </section>`
);

export default class FilmsListView extends AbstractView {
  #title = '';

  constructor(title) {
    super();
    this.#title = title || '';
  }

  get template() {
    return createFilmsListTemplate(this.#title);
  }

  get filmsContainer() {
    return this.element.querySelector('.films-list__container');
  }
}

