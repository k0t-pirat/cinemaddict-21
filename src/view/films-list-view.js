import AbstractView from '../framework/view/abstract-view';

const createFilmsListTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>
    <!-- show more button -->
  </section>`
);

export default class FilmsListView extends AbstractView {
  get template() {
    return createFilmsListTemplate();
  }

  get filmsContainer() {
    return this.element.querySelector('.films-list__container');
  }
}

