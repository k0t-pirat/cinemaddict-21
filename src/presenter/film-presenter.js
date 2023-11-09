import { UpdateType, UserAction } from '../const';
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
  #filmsContainer = null;

  #filmCardView = null;
  #filmPopupView = null;
  #mode = Mode.DEFAULT;
  #handleModeChange = null;
  #handleDataChange = null;
  #handleCommentChange = null;
  #commentModel = null;

  constructor({ commentModel, filmsContainer, onModeChange, onDataChange, onCommentChange}) {
    this.#commentModel = commentModel;
    this.#filmsContainer = filmsContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
    this.#handleCommentChange = onCommentChange;
  }

  init(film) {
    this.#film = film;
    this.#renderFilm(this.#film);
  }

  destroy() {
    this.#closePopup();
    remove(this.#filmCardView);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopup();
    }
  }

  #handleCommentsLoad(comments) {
    this.#filmPopupView.updateComments(comments, this.#commentModel.isLoading);
  }

  #observeCommentModel = (updateType, update) => {
    switch (updateType) {
      case UpdateType.INIT:
        this.#handleCommentsLoad(update);
        break;
      // case UpdateType.PATCH:
      //   this.#films = this.#filteredFilms;
      //   this.#filmPresenters.get(update.id).init(update, this.#commentModel.comments);
      //   break;
    }
  };

  #initCommentModel() {
    this.#commentModel.init(this.#film.id);
    this.#commentModel.addObserver(this.#observeCommentModel);
  }

  #renderFilm(film) {
    const prevFilmCardView = this.#filmCardView;
    const prevFilmPopupView = this.#filmPopupView;
    const prevFilmState = prevFilmPopupView?.getState();

    this.#filmCardView = new FilmCardView({
      film,
      onLinkClick: () => {
        if (this.#mode !== Mode.EDITING) {
          this.#openPopup();
        }
      },
      onFilmStatusClick: this.#handleFilmStatusClick,
    });
    this.#filmPopupView = new FilmPopupView({
      film,
      prevState: prevFilmState,
      onCloseButtonClick: () => {
        this.#closePopup();
      },
      onFilmStatusClick: this.#handleFilmStatusClick,
      onDeleteCommentClick: this.#handleDeleteCommentClick,
      onSubmitComment: this.#handleSubmitComment,
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
    this.#initCommentModel();
    this.#handleModeChange();
    render(this.#filmPopupView, document.body);
    this.#filmPopupView.init();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.EDITING;
  }

  #closePopup() {
    this.#commentModel.removeObserver(this.#observeCommentModel);
    this.#filmPopupView.reset();
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

  #handleDeleteCommentClick = (id) => {
    this.#handleCommentChange({commentId: id, film: this.#film}, UserAction.DELETE);
  };

  #handleSubmitComment = (userComment) => {
    this.#handleCommentChange({userComment, film: this.#film}, UserAction.ADD);
  };
}
