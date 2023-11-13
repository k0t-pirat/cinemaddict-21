import FooterStatisticsView from './view/footer-statistics-view';
import FilmsWrapperView from './view/films-wrapper-view';
import FilmsListPresenter from './presenter/films-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import UserRankPresenter from './presenter/user-rank-presenter';
import FilmModel from './model/film-model';
import CommentModel from './model/comment-model';
import FilterModel from './model/filter-model';
import FilmsApiService from './films-api-service';
import CommentsApiService from './comments-api-service';
import { RenderPosition, render } from './framework/render';
import { UpdateType } from './const';
import FilmsExtraPresenter from './presenter/films-extra-presenter';

const AUTHORIZATION = 'Basic aaaab';
const END_POINT = 'https://21.objects.pages.academy/cinemaddict';

const headerContainer = document.querySelector('.header');
const mainContainer = document.querySelector('.main');
const footerContainer = document.querySelector('.footer__statistics');


const presenterStore = {
  filmPresenters: new Map(),
  filmRatedPresenters: new Map(),
  filmCommentedPresenters: new Map(),
  resetAllPresenters: () => {
    presenterStore.filmPresenters.forEach((presenter) => presenter.resetView());
    presenterStore.filmRatedPresenters.forEach((presenter) => presenter.resetView());
    presenterStore.filmCommentedPresenters.forEach((presenter) => presenter.resetView());
  },
};

const filterModel = new FilterModel();

const filmModel = new FilmModel({
  filmsApiService: new FilmsApiService(END_POINT, AUTHORIZATION),
});
filmModel.init();

const commentModel = new CommentModel({
  filmModel,
  commentsApiService: new CommentsApiService(END_POINT, AUTHORIZATION),
});

filmModel.addObserver((updateType) => {
  if (updateType === UpdateType.INIT) {
    render(new FooterStatisticsView({filmModel}), footerContainer, RenderPosition.AFTERBEGIN);
  }
});

const userRankPresenter = new UserRankPresenter({container: headerContainer, filmModel});
userRankPresenter.init();

const filterPresenter = new FilterPresenter({filterContainer: mainContainer, filterModel, filmModel});
filterPresenter.init();

const filmsWrapperView = new FilmsWrapperView();
render(filmsWrapperView, mainContainer);

const filmsListPresenter = new FilmsListPresenter({filmsContainer: filmsWrapperView.element, filterModel, filmModel, commentModel, presenterStore});
filmsListPresenter.init();

const filmsExtraPresenter = new FilmsExtraPresenter({filmsContainer: filmsWrapperView.element, filmModel, commentModel, presenterStore});
filmsExtraPresenter.init();
