import { DateType } from '../const';
import AbstractView from '../framework/view/abstract-view';
import { formatDate, formatDuration } from '../util/date';

const EMOJIES = ['smile', 'sleeping', 'puke', 'angry'];

const getFilmComments = (commentIds, allComments) => {
  const filmComments = allComments.filter((comment) => commentIds.includes(comment.id));
  return filmComments;
};

const createCommentsMarkup = (filmComments) =>
  filmComments.map((comment) => {
    const {emotion, comment: text, author, date} = comment;

    return (
      `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${formatDate(date, DateType.DATE_TIME)}</span>
            <button class="film-details__comment-delete">Delete</button>
          </p>
        </div>
      </li>`
    );
  }).join('');

const createEmojiesMarkup = (emojies) =>
  emojies.map((emoji) => (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
  )).join('');

const createFilmPopupTemplate = (film, allComments) => {
  const {filmInfo, userDetails} = film;
  const {poster, ageRating, title, altTitle, totalRating, director, writers, actors, release, duration, genres, description} = filmInfo;
  const {alreadyWatched, inWatchlist, isFavorite} = userDetails;
  const filmComments = getFilmComments(film.comments, allComments);

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
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmComments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsMarkup(filmComments)}
            </ul>

            <form class="film-details__new-comment" action="" method="get">
              <div class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${createEmojiesMarkup(EMOJIES)}
              </div>
            </form>
          </section>
        </div>
      </div>
    </section>`
  );
};

export default class FilmPopupView extends AbstractView {
  #film = null;
  #allComments = [];
  #handleCloseButtonClick = null;

  constructor({film, allComments, onCloseButtonClick}) {
    super();
    this.#film = film;
    this.#allComments = allComments;
    this.#handleCloseButtonClick = onCloseButtonClick;
  }

  init() {
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  get template() {
    return createFilmPopupTemplate(this.#film, this.#allComments);
  }

  #closeButtonClickHandler = () => {
    this.#handleCloseButtonClick();
  };
}

