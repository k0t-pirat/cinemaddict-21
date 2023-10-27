import { remove, render } from '../framework/render';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';

export default class FilmPresenter {
  #film = null;
  #allComments = [];
  #filmsContainer = null;

  constructor({film, allComments, filmsContainer}) {
    this.#film = film;
    this.#allComments = allComments;
    this.#filmsContainer = filmsContainer;
  }

  init() {
    this.#renderFilm(this.#film);
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

    render(filmCardView, this.#filmsContainer);

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
}
