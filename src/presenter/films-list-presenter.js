import FilmsListView from '../view/films-list-view';
import FilterView from '../view/fitler-view';
import SortView from '../view/sort-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreView from '../view/show-more-view';
import FilmPopupView from '../view/film-popup-view';
import { remove, render } from '../framework/render';
import FilmsEmptyView from '../view/films-empty-view';
import FilmsWrapperView from '../view/films-wrapper-view';

const COUNT_STEP = 5;

export default class FilmsListPresenter {
  #mainContainer = null;
  #filmsWrapperView = null;
  #filmsEmptyView = null;
  #filmsListView = null;
  #showMoreView = null;
  #filmModel = null;
  #films = [];
  #allComments = [];
  #currentCount = 0;

  constructor({container, filmModel}) {
    this.#mainContainer = container;
    this.#filmsWrapperView = new FilmsWrapperView();
    this.#filmsEmptyView = new FilmsEmptyView();
    this.#filmsListView = new FilmsListView();
    this.#showMoreView = new ShowMoreView({
      onClick: () => {
        this.#currentCount = this.#currentCount + COUNT_STEP;
        this.#renderGroup();
      }
    });
    this.#filmModel = filmModel;
  }

  init() {
    this.#films = [...this.#filmModel.films];
    this.#allComments = [...this.#filmModel.comments];

    this.#renderList();
  }

  #renderFilm(film) {
    const escKeydownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closePopup();
      }
    };
    const filmCardView = new FilmCardView({
      film,
      onLinkClick: () => {
        openPopup();
      }
    });
    const filmPopupView = new FilmPopupView({
      film,
      allComments: this.#allComments,
      onCloseButtonClick: () => {
        closePopup();
      }
    });

    render(filmCardView, this.#filmsListView.filmsContainer);

    function openPopup() {
      render(filmPopupView, document.body);
      filmPopupView.init();
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', escKeydownHandler);
    }
    function closePopup() {
      remove(filmPopupView);
      document.body.classList.remove('hide-overflow');
      document.removeEventListener('keydown', escKeydownHandler);
    }
  }

  #renderGroup() {
    for (const film of this.#films.slice(this.#currentCount, this.#currentCount + COUNT_STEP)) {
      this.#renderFilm(film);
    }

    if (this.#films.length <= this.#currentCount + COUNT_STEP) {
      remove(this.#showMoreView);
    }
  }

  #renderList() {
    render(new FilterView(), this.#mainContainer);
    render(new SortView(), this.#mainContainer);
    render(this.#filmsWrapperView, this.#mainContainer);

    if (this.#films.length === 0) {
      render(this.#filmsEmptyView, this.#filmsWrapperView.element);
      return;
    }

    render(this.#filmsListView, this.#filmsWrapperView.element);

    this.#renderGroup();

    if (this.#films.length > COUNT_STEP) {
      render(this.#showMoreView, this.#filmsListView.element);
    }
  }
}
