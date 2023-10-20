import UserRankView from './view/user-rank-view';
import FooterStatisticsView from './view/footer-statistics-view';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilmModel from './model/film-model';
import { RenderPosition, render } from './framework/render';

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerContainer = document.querySelector('.footer__statistics');

const userRankView = new UserRankView();
const footerStatisticsView = new FooterStatisticsView();

render(userRankView, headerContainer, RenderPosition.BEFOREEND);
render(footerStatisticsView, footerContainer, RenderPosition.AFTERBEGIN);

const filmModel = new FilmModel();
filmModel.init();

const filmsListPresenter = new FilmsListPresenter({container: mainContainer, filmModel});
filmsListPresenter.init();
