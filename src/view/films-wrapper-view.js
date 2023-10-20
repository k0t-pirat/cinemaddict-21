import AbstractView from '../framework/view/abstract-view';

const createFilmsWrapperTemplate = () => (
  `<section class="films">
    <!--
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>
  -->
  </section>`
);

export default class FilmsWrapperView extends AbstractView {
  get template() {
    return createFilmsWrapperTemplate();
  }

  get filmsListElement() {
    return this.element.querySelector('.films-list');
  }
}

