import { getFilms, getComments } from './films';

const FILMS_COUNT = 5;

if (!localStorage.getItem('cinemaaddict-films')) {
  localStorage.setItem('cinemaaddict-films', JSON.stringify(getFilms(FILMS_COUNT)));
}
if (!localStorage.getItem('cinemaaddict-comments')) {
  localStorage.setItem('cinemaaddict-comments', JSON.stringify(getComments()));
}

export const getMockFilms = () => JSON.parse(localStorage.getItem('cinemaaddict-films'));
export const getMockComments = () => JSON.parse(localStorage.getItem('cinemaaddict-comments'));
