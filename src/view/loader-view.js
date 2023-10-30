import AbstractView from '../framework/view/abstract-view';

const createLoaderTemplate = () => (
  `<p>
    Loading...
  </p>`
);

export default class LoaderView extends AbstractView {
  get template() {
    return createLoaderTemplate();
  }
}
