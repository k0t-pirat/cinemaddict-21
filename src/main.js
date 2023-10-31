import FooterStatisticsView from './view/footer-statistics-view';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmModel from './model/film-model';
import { RenderPosition, render } from './framework/render';
import FilterPresenter from './presenter/filter-presenter';
import FilterModel from './model/filter-model';
import UserRankPresenter from './presenter/user-rank-presenter';
import CommentModel from './model/comment-model';
import { UpdateType } from './const';

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerContainer = document.querySelector('.footer__statistics');

const filterModel = new FilterModel();

const filmModel = new FilmModel();
filmModel.init();

const commentModel = new CommentModel();
commentModel.init();

filmModel.addObserver((updateType) => {
  if (updateType === UpdateType.INIT) {
    render(new FooterStatisticsView({filmModel}), footerContainer, RenderPosition.AFTERBEGIN);
  }
});

const userRankPresenter = new UserRankPresenter({container: headerContainer, filmModel});
userRankPresenter.init();

const filterPresenter = new FilterPresenter({filterContainer: mainContainer, filterModel, filmModel});
filterPresenter.init();

const filmsListPresenter = new FilmsListPresenter({container: mainContainer, filterModel, filmModel, commentModel});
filmsListPresenter.init();
