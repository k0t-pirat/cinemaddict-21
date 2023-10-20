import AbstractView from '../framework/view/abstract-view';

const FilmsCount = {
  NOVICE: 10,
  FAN: 20,
};

const getUserRank = (watchedFilmsCount) => {
  switch(true) {
    case watchedFilmsCount <= FilmsCount.NOVICE:
      return 'Novice';
    case watchedFilmsCount > FilmsCount.NOVICE && watchedFilmsCount <= FilmsCount.FAN:
      return 'Fan';
    case watchedFilmsCount > FilmsCount.FAN:
      return 'Movie buff';
  }
};

const createUserRankTemplate = (watchedFilmsCount) => (
  `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(watchedFilmsCount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

export default class UserRankView extends AbstractView {
  #watchedFilmsCount = 0;

  constructor(watchedFilmsCount) {
    super();
    this.#watchedFilmsCount = watchedFilmsCount;
  }

  get template() {
    return createUserRankTemplate(this.#watchedFilmsCount);
  }
}

