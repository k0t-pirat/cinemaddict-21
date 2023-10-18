import FilmsListView from '../view/films-list-view';
import FilterView from '../view/fitler-view';
import SortView from '../view/sort-view';
import FilmCardView from '../view/film-card-view';
import ShowMoreView from '../view/show-more-view';
import FilmPopupView from '../view/film-popup-view';
import { render } from '../render';

export default class FilmsListPresenter {
  constructor({container}) {
    this.bodyContainer = document.body;
    this.mainContainer = container;
    this.filmsListView = new FilmsListView();
    this.filmsListContainer = this.filmsListView.getFilmsContainer();
    this.showMoreContainer = this.filmsListView.getShowMoreContainer();
  }

  init({filmModel}) {
    this.filmModel = filmModel;
    this.films = [...filmModel.getFilms()];
    this.allComments = [...filmModel.getComments()];

    render(new FilterView(), this.mainContainer);
    render(new SortView(), this.mainContainer);
    render(this.filmsListView, this.mainContainer);

    for (const film of this.films) {
      render(new FilmCardView(film), this.filmsListContainer);
    }

    render(new ShowMoreView(), this.showMoreContainer);
    render(new FilmPopupView(this.films[0], this.allComments), this.bodyContainer);
  }
}
