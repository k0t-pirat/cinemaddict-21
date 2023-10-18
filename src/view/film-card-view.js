import { DateType } from '../const';
import { createElement } from '../render';
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
        <button class="${`film-card__controls-item film-card__controls-item--add-to-watchlist${alreadyWatched ? ' film-card__controls-item--active' : ''}`}" type="button">Add to watchlist</button>
        <button class="${`film-card__controls-item film-card__controls-item--mark-as-watched${inWatchlist ? ' film-card__controls-item--active' : ''}`}" type="button">Mark as watched</button>
        <button class="${`film-card__controls-item film-card__controls-item--favorite${isFavorite ? ' film-card__controls-item--active' : ''}`}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class FilmCardView {
  constructor(film) {
    this.film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this.film);
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

