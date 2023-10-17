import { createElement } from '../render';

const createFooterStatisticsTemplate = () => (
  `<p>
    130 291 movies inside
  </p>`
);

export default class FooterStatisticsView {
  getTemplate() {
    return createFooterStatisticsTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

