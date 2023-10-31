import AbstractView from '../framework/view/abstract-view';

const createLoaderTemplate = () => (
  `<section class="films-list">
    <h2 class="films-list__title">...Loading</h2>
  </section>`
);

export default class LoaderView extends AbstractView {
  get template() {
    return createLoaderTemplate();
  }
}
