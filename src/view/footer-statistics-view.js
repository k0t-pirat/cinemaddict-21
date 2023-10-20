import AbstractView from '../framework/view/abstract-view';

const createFooterStatisticsTemplate = (allFilmsCount) => (
  `<p>
    ${allFilmsCount} movies inside
  </p>`
);

export default class FooterStatisticsView extends AbstractView {
  #filmModel = null;

  constructor({filmModel}) {
    super();
    this.#filmModel = filmModel;
  }

  get allFilmsCount() {
    const formatter = new Intl.NumberFormat('ru');
    return formatter.format(this.#filmModel.films.length);
  }

  get template() {
    return createFooterStatisticsTemplate(this.allFilmsCount);
  }
}

