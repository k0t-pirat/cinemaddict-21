import { DateType } from '../const/date';
import AbstractView from '../framework/view/abstract-view';
import {formatDate, formatDuration} from '../util/date';

const MAX_DESCRIPTION_LENGTH = 140;

const formatDescription = (description) => description.length < MAX_DESCRIPTION_LENGTH ? description : `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;
const formatCommentsCount = (count) => count === 1 ? `${count} comment` : `${count} comments`;

const createFilmCardTemplate = (film) => {
  const {comments: filmComments, filmInfo, userDetails} = film;
  const {title, totalRating, release, duration, genres, poster, description} = filmInfo;
  const {alreadyWatched, inWatchlist, isFavorite} = userDetails;

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${formatDate(release.date, DateType.YEAR)}</span>
          <span class="film-card__duration">${formatDuration(duration)}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src=${poster} alt="" class="film-card__poster">
        <p class="film-card__description">${formatDescription(description)}</p>
        <span class="film-card__comments">${formatCommentsCount(filmComments.length)}</span>
      </a>
      <div class="film-card__controls">
        <button class="${`film-card__controls-item film-card__controls-item--add-to-watchlist${inWatchlist ? ' film-card__controls-item--active' : ''}`}" type="button" name="watchlist">Add to watchlist</button>
        <button class="${`film-card__controls-item film-card__controls-item--mark-as-watched${alreadyWatched ? ' film-card__controls-item--active' : ''}`}" type="button" name="watched">Mark as watched</button>
        <button class="${`film-card__controls-item film-card__controls-item--favorite${isFavorite ? ' film-card__controls-item--active' : ''}`}" type="button" name="favorite">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView extends AbstractView {
  #film = null;
  #handleLinkClick = null;
  #handleFilmStatusClick = null;

  constructor({film, onLinkClick, onFilmStatusClick}) {
    super();
    this.#film = film;
    this.#handleLinkClick = onLinkClick;
    this.#handleFilmStatusClick = onFilmStatusClick;

    this.element.querySelector('.film-card__link').addEventListener('click', this.#linkClickHandler);
    this.element.querySelector('.film-card__controls').addEventListener('click', this.#filmStatusClickHandler);
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  #linkClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleLinkClick();
  };

  #filmStatusClickHandler = (evt) => {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    this.#handleFilmStatusClick(evt.target.name);
  };
}

