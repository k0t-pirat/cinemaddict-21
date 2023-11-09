import he from 'he';
import { DateType } from '../const/date';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { formatDate, formatDuration } from '../util/date';

const EMOJIES = ['smile', 'sleeping', 'puke', 'angry'];

const defaultState = {
  currentEmoji: '',
  text: '',
  comments: [],
  areCommentsLoading: true,
};

const createCommentsMarkup = (filmComments) =>
  filmComments.map((comment) => {
    const {emotion, comment: text, author, date, id} = comment;

    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${he.encode(text)}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${he.encode(author)}</span>
            <span class="film-details__comment-day">${formatDate(date, DateType.USER)}</span>
            <button class="film-details__comment-delete" data-id=${id}>Delete</button>
          </p>
        </div>
      </li>`
    );
  }).join('');

const createEmojiesMarkup = (emojies, currentEmoji) =>
  emojies.map((emoji) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio"
      id="emoji-${emoji}" value="${emoji}"${currentEmoji === emoji ? ' checked' : ''}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  )).join('');

const createFilmPopupTemplate = (film, state) => {
  const {filmInfo, userDetails} = film;
  const {poster, ageRating, title, altTitle, totalRating, director, writers, actors, release, duration, genres, description} = filmInfo;
  const {alreadyWatched, inWatchlist, isFavorite} = userDetails;
  const {currentEmoji, text, comments, areCommentsLoading} = state;

  return (
    `<section class="film-details">
      <div class="film-details__inner">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">${altTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatDate(release.date, DateType.FULL)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Duration</td>
                  <td class="film-details__cell">${formatDuration(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${release.releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('')}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="${`film-details__control-button film-details__control-button--watchlist${inWatchlist ? ' film-details__control-button--active' : ''}`}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="${`film-details__control-button film-details__control-button--watched${alreadyWatched ? ' film-details__control-button--active' : ''}`}" id="watched" name="watched">Already watched</button>
            <button type="button" class="${`film-details__control-button film-details__control-button--favorite${isFavorite ? ' film-details__control-button--active' : ''}`}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">

    ${areCommentsLoading ?
      '<h3 class="film-details__comments-title">Comments loading...</h3>'
      :
      `<h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
      <ul class="film-details__comments-list">
        ${createCommentsMarkup(comments)}
      </ul>`
    }    

            <form class="film-details__new-comment" action="" method="get">
              <div class="film-details__add-emoji-label">
                ${currentEmoji ? `<img src="images/emoji/${currentEmoji}.png" width="55" height="55" alt="emoji-${currentEmoji}">` : ''}
              </div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${text}</textarea>
              </label>

              <div class="film-details__emoji-list">
                ${createEmojiesMarkup(EMOJIES, currentEmoji)}
              </div>
            </form>
          </section>
        </div>
      </div>
    </section>`
  );
};

export default class FilmPopupView extends AbstractStatefulView {
  #film = null;
  #handleCloseButtonClick = null;
  #handleFilmStatusClick = null;
  #handleDeleteCommentClick = null;
  #handleSubmitComment = null;

  constructor({film, prevState, onCloseButtonClick, onFilmStatusClick, onDeleteCommentClick, onSubmitComment}) {
    super();
    this.#film = film;
    this.#handleCloseButtonClick = onCloseButtonClick;
    this.#handleFilmStatusClick = onFilmStatusClick;
    this.#handleDeleteCommentClick = onDeleteCommentClick;
    this.#handleSubmitComment = onSubmitComment;

    this._setState(prevState || defaultState);
  }

  get template() {
    return createFilmPopupTemplate(this.#film, this._state);
  }

  init() {
    this._restoreHandlers();
  }

  reset() {
    this._setState(defaultState);
  }

  getState() {
    return this._state;
  }

  updateComments(comments, areCommentsLoading) {
    const prevScroll = this.element.scrollTop;
    this.updateElement({
      comments,
      areCommentsLoading,
      currentEmoji: '',
      text: '',
    });
    this.element.scrollTo(0, prevScroll);
  }

  _restoreHandlers() {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
    this.element.querySelector('.film-details__controls').addEventListener('click', this.#filmStatusClickHandler);
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiChangeHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentTextChangeHandler);
    this.element.querySelector('.film-details__comments-list')?.addEventListener('click', this.#commentDeleteClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#submitCommentHandler);
  }

  #closeButtonClickHandler = () => {
    this.#handleCloseButtonClick();
  };

  #filmStatusClickHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    this.#handleFilmStatusClick(evt.target.name);
  };

  #emojiChangeHandler = (evt) => {
    const prevScroll = this.element.scrollTop;
    this.updateElement({
      currentEmoji: evt.target.value,
    });
    this.element.scrollTo(0, prevScroll);
  };

  #commentTextChangeHandler = (evt) => {
    const prevScroll = this.element.scrollTop;
    this._setState({
      text: evt.target.value,
    });
    this.element.scrollTo(0, prevScroll);
  };

  #commentDeleteClickHandler = (evt) => {
    if (evt.target.dataset.id) {
      this.#handleDeleteCommentClick(evt.target.dataset.id);
    }
  };

  #submitCommentHandler = (evt) => {
    if (evt.key === 'Enter' && evt.ctrlKey) {
      const userComment = {comment: this._state.text, emotion: this._state.currentEmoji};
      if (userComment.emotion && userComment.comment) {
        this.#handleSubmitComment(userComment);
      }
    }
  };
}

