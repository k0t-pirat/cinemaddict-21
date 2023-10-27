import { remove, render, replace } from '../framework/render';
import { replaceWithScroll } from '../util/common';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};
const statusTranslation = {
  watchlist: 'inWatchlist',
  watched: 'alreadyWatched',
  favorite: 'isFavorite',
};

export default class FilmPresenter {
  #film = null;
  #allComments = [];
  #filmsContainer = null;

  #filmCardView = null;
  #filmPopupView = null;
  #mode = Mode.DEFAULT;
  #handleModeChange = null;
  #handleDataChange = null;

  constructor({ allComments, filmsContainer, onModeChange, onDataChange}) {
    // this.#film = film;
    this.#allComments = allComments;
    this.#filmsContainer = filmsContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
  }

  init(film) {
    this.#film = film;
    this.#renderFilm(this.#film);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  }

  #renderFilm(film) {
    const prevFilmCardView = this.#filmCardView;
    const prevFilmPopupView = this.#filmPopupView;

    this.#filmCardView = new FilmCardView({
      film,
      onLinkClick: () => {
        this.#openPopup();
      },
      onFilmStatusClick: this.#handleFilmStatusClick,
    });
    this.#filmPopupView = new FilmPopupView({
      film,
      allComments: this.#allComments,
      onCloseButtonClick: () => {
        this.#closePopup();
      },
      onFilmStatusClick: this.#handleFilmStatusClick,
    });

    if (prevFilmCardView === null || prevFilmPopupView === null) {
      render(this.#filmCardView, this.#filmsContainer);
      return;
    }

    replace(this.#filmCardView, prevFilmCardView);

    if (this.#mode === Mode.EDITING) {
      replaceWithScroll(this.#filmPopupView, prevFilmPopupView);
      this.#filmPopupView.init();
    }
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closePopup();
    }
  };

  #openPopup() {
    this.#handleModeChange();
    render(this.#filmPopupView, document.body);
    this.#filmPopupView.init();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.EDITING;
  }

  #closePopup() {
    remove(this.#filmPopupView);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleFilmStatusClick = (status) => {
    const translatedStatus = statusTranslation[status];
    this.#handleDataChange({
      ...this.#film,
      userDetails: {...this.#film.userDetails, [translatedStatus]: !this.#film.userDetails[translatedStatus]},
    });
  };
}
