import { getFilmComments } from './comments';
import { getRandomBool, getRandomDate, getRandomElement, getRandomElements, getRandomFloat, getRandomInt } from './utils';

const titles = [
  'A Little Pony Without The Carpet',
  'The Great Flamarion',
];
const altTitles = [
  'Laziness Who Sold Themselves',
  'Original: The Great Flamarion',
];
const posters = [
  './images/posters/made-for-each-other.png',
  './images/posters/the-great-flamarion.jpg',
];
const ageRatings = [0,3,7,12,16,18];
const directors = [
  'Anthony Mann',
  'Tom Ford',
];
const writers = [
  'Anne Wigton',
  'Heinz Herald',
  'Richard Weil',
  'Takeshi Kitano',
];
const actors = [
  'Erich von Stroheim',
  'Mary Beth Hughes',
  'Dan Duryea',
  'Morgan Freeman',
];
const countries = [
  'USA',
  'France',
  'China',
  'Japan',
  'Brazil',
];
const genres = [
  'Drama',
  'Film-Noir',
  'Mystery',
  'Comedy',
];
const descriptions = [
  'The film opens following a murder at a cabaret in Mexico City in 1936, and then presents the events leading up to it in flashback. The Great Flamarion (Erich von Stroheim) is an arrogant, friendless, and misogynous marksman who displays his trick gunshot act in the vaudeville circuit. His show features a beautiful assistant, Connie (Mary Beth Hughes) and her drunken husband Al (Dan Duryea), Flamarion\'s other assistant. Flamarion falls in love with Connie, the movie\'s femme fatale, and is soon manipulated by her into killing her no good husband during one of their acts.',
  'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.',
];

const allComments = [];

const getFilms = (count = 5) => {
  const films = [];

  for (let i = 0; i < count; i++) {
    const filmId = i + 1;
    const filmComments = getFilmComments();
    allComments.push(...filmComments);

    films.push({
      id: filmId,
      comments: filmComments.map((comment) => comment.id),
      filmInfo: {
        title: getRandomElement(titles),
        altTitle: getRandomElement(altTitles),
        totalRating: getRandomFloat(10),
        poster: getRandomElement(posters),
        ageRating: getRandomElement(ageRatings),
        director: getRandomElement(directors),
        writers: getRandomElements(writers),
        actors: getRandomElements(actors),
        release: {
          date: getRandomDate('1945-03-05T00:00:00.000Z'),
          releaseCountry: getRandomElement(countries),
        },
        duration: getRandomBool() ? getRandomInt(100) : getRandomInt(300),
        genres: getRandomElements(genres).slice(0,3),
        description: getRandomElement(descriptions),
      },
      userDetails: {
        inWatchlist: getRandomBool(),
        alreadyWatched: getRandomBool(),
        watchingDate: getRandomDate('2019-04-12T16:12:32.554Z'),
        isFavorite: getRandomBool(),
      }
    });
  }

  return films;
};

const getComments = () => allComments;

export {getFilms, getComments};
