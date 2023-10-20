import AbstractView from '../framework/view/abstract-view';

const createFilmsEmptyTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">There are no movies in our database</h2>
  </section>`
);

export default class FilmsEmptyView extends AbstractView {
  get template() {
    return createFilmsEmptyTemplate();
  }
}

