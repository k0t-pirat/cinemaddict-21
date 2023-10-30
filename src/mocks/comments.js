import { getRandomBool, getRandomDate, getRandomElement, getRandomInt } from './utils';

const authors = [
  'Ilya O\'Reilly',
  'Tim Macoveev',
  'John Doe',
  'dragonslayer3000',
  'Valera',
];
const messages = [
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Interesting setting and a good cast',
  'Booooooooooring',
  'Very very old. Meh',
  'Almost two hours? Seriously?',
];
const emotions = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const getDateDaysAgo = (num) => {
  const d = new Date();
  d.setDate(d.getDate() - num);

  return d;
};

const getMockDate = () => {
  const value = getRandomInt(2);

  switch (value) {
    case 0:
      return new Date();
    case 1:
      return getDateDaysAgo(2);
    case 2:
      return getRandomDate('2019-05-11T16:12:32.554Z');
  }
};

const getFilmCommentsTemplate = () => {
  let startId = 0;

  return () => {
    const comments = [];
    const count = getRandomBool() ? getRandomInt(3) : getRandomInt(15);
    let i = startId;

    for (i; i < count + startId; i++) {
      comments.push({
        id: i + 1,
        author: getRandomElement(authors),
        comment: getRandomElement(messages),
        date: getMockDate(),
        // date: getRandomBool() ? getRandomDate(getDateDaysAgo(2)) : getRandomDate('2019-05-11T16:12:32.554Z'),
        emotion: getRandomElement(emotions),
      });
    }

    startId = i;
    comments.sort((a,b) => b.date.getTime() - a.date.getTime());
    return comments;
  };
};

const getFilmComments = getFilmCommentsTemplate();

export {getFilmComments};
