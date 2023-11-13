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

  #handleModeChange = null;
  #handleDataChange = null;
  #handleCommentChange = null;
  #commentModel = null;
  #mode = Mode.DEFAULT;

  constructor({ commentModel, filmsContainer, onModeChange, onDataChange, onCommentChange}) {
    this.#commentModel = commentModel;
    this.#filmsContainer = filmsContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
    this.#handleCommentChange = onCommentChange;
    this.#commentModel.addObserver(this.#observeCommentModelPatch);
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

  setAborting(userAction) {
    switch (userAction) {
      case UserAction.EDIT_CARD:
        this.#filmCardView.shake();
        break;
      case UserAction.EDIT_POPUP:
        this.#filmPopupView.shakeControls();
        break;
      case UserAction.ADD:
        this.#filmPopupView.shakeForm();
        break;
      case UserAction.DELETE:
        this.#filmPopupView.shakeComment();
        break;
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
      case UpdateType.PATCH:
        this.init(update);
        this.#filmPopupView.updateComments(this.#commentModel.comments, false);
        break;
      case UpdateType.LOAD:
        this.#filmPopupView.setLoader(this.#commentModel.isDeleting, this.#commentModel.isUploading);
    }
  };

  #observeCommentModelPatch = (updateType, update) => {
    if (updateType === UpdateType.PATCH && update.id === this.#film.id) {
      this.init(update);
    }
  };

  #initCommentModel() {
    this.#commentModel.init(this.#film.id);
    this.#commentModel.addObserver(this.#observeCommentModel);
    this.#commentModel.removeObserver(this.#observeCommentModelPatch);
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
      onFilmStatusClick: this.#handleFilmStatusCardClick,
    });
    this.#filmPopupView = new FilmPopupView({
      film,
      prevState: prevFilmState,
      onCloseButtonClick: () => {
        this.#closePopup();
      },
      onFilmStatusClick: this.#handleFilmStatusPopupClick,
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
    this.#filmPopupView.mount();
    this.#filmPopupView.init();
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.EDITING;
  }

  #closePopup() {
    this.#commentModel.addObserver(this.#observeCommentModelPatch);
    this.#commentModel.removeObserver(this.#observeCommentModel);
    this.#filmPopupView.reset();
    remove(this.#filmPopupView);
    this.#filmPopupView.unmount();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #handleFilmStatusCardClick = (status) => {
    this.#handleFilmStatusClick(status, UserAction.EDIT_CARD);
  };

  #handleFilmStatusPopupClick = (status) => {
    this.#handleFilmStatusClick(status, UserAction.EDIT_POPUP);
  };

  #handleFilmStatusClick = (status, userAction) => {
    const translatedStatus = statusTranslation[status];
    this.#handleDataChange({
      ...this.#film,
      userDetails: {...this.#film.userDetails, [translatedStatus]: !this.#film.userDetails[translatedStatus]},
    }, userAction);
  };

  #handleDeleteCommentClick = (id) => {
    this.#handleCommentChange({commentId: id, film: this.#film}, UserAction.DELETE);
  };

  #handleSubmitComment = (userComment) => {
    this.#handleCommentChange({userComment, film: this.#film}, UserAction.ADD);
  };
}
