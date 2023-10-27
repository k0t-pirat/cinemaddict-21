import { render } from '../framework/render';
import FilmsListView from '../view/films-list-view';
import SortView from '../view/sort-view';
import FilmsEmptyView from '../view/films-empty-view';
import FilmsWrapperView from '../view/films-wrapper-view';
import FilmPresenter from './film-presenter';
import ShowMorePresenter from './show-more-presenter';


export default class FilmsListPresenter {
  #mainContainer = null;
  #filmsWrapperView = null;
  #filmsEmptyView = null;
  #filmsListView = null;
  #filmModel = null;
  #films = [];
  #allComments = [];
  #showMorePresenter = null;

  constructor({container, filmModel}) {
    this.#mainContainer = container;
    this.#filmsWrapperView = new FilmsWrapperView();
    this.#filmsEmptyView = new FilmsEmptyView();
    this.#filmsListView = new FilmsListView();
    this.#filmModel = filmModel;
    this.#showMorePresenter = new ShowMorePresenter({renderGroup: this.#renderGroup, showMoreContainer: this.#filmsListView.element});
  }

  init() {
    this.#films = [...this.#filmModel.films];
    this.#allComments = [...this.#filmModel.comments];

    this.#renderList();
  }

  #renderGroup = ({currentCount, nextCount}) => {
    for (const film of this.#films.slice(currentCount, nextCount)) {
      const filmPresenter = new FilmPresenter({film, allComments: this.#allComments, filmsContainer: this.#filmsListView.filmsContainer});
      filmPresenter.init();
    }
  };

  #renderList() {
    render(new SortView(), this.#mainContainer);
    render(this.#filmsWrapperView, this.#mainContainer);

    if (this.#films.length === 0) {
      render(this.#filmsEmptyView, this.#filmsWrapperView.element);
      return;
    }

    render(this.#filmsListView, this.#filmsWrapperView.element);

    this.#showMorePresenter.init(this.#films.length);
  }
}
