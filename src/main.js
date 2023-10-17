import UserRankView from './view/user-rank-view';
import FooterStatisticsView from './view/footer-statistics-view';
import FilmsListPresenter from './presenter/films-list-presenter';
import { RenderPosition, render } from './render';

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerContainer = document.querySelector('.footer__statistics');

const userRankView = new UserRankView();
const footerStatisticsView = new FooterStatisticsView();

render(userRankView, headerContainer, RenderPosition.BEFOREEND);
render(footerStatisticsView, footerContainer, RenderPosition.AFTERBEGIN);

const filmsListPresenter = new FilmsListPresenter({container: mainContainer});
filmsListPresenter.init();
