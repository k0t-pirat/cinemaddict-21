export const sortFilms = {
  default: (films) => [...films],
  date: (films) => [...films].sort((a, b) => new Date(b.filmInfo.release.date).getTime() - new Date(a.filmInfo.release.date).getTime()),
  rating: (films) => [...films].sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating),
  comments: (films) => [...films].sort((a, b) => b.comments.length - a.comments.length),
};
