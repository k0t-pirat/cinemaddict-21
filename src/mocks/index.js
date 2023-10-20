import { getFilms, getComments } from './films';

const FILMS_COUNT = 12;

const shouldUpdateMocks = () => {
  const mockFilmsJSON = localStorage.getItem('cinemaaddict-films');
  const mockCommentsJSON = localStorage.getItem('cinemaaddict-comments');
  const wasFilmsLengthChanged = !(mockFilmsJSON && JSON.parse(mockFilmsJSON).length === FILMS_COUNT);

  return !mockCommentsJSON || wasFilmsLengthChanged;
};

if (shouldUpdateMocks()) {
  localStorage.setItem('cinemaaddict-films', JSON.stringify(getFilms(FILMS_COUNT)));
  localStorage.setItem('cinemaaddict-comments', JSON.stringify(getComments()));
}

export const getMockFilms = () => JSON.parse(localStorage.getItem('cinemaaddict-films'));
export const getMockComments = () => JSON.parse(localStorage.getItem('cinemaaddict-comments'));
