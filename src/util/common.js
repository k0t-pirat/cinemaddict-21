import { replace } from '../framework/render';

export const upFirstLetter = (letters) => letters[0].toUpperCase() + letters.slice(1);
export function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

// export const persistViewScroll = (oldView, newView) => {
//   const currentYCoord = oldView.element.scrollTop;
//   console.log('currentYCoord', currentYCoord)
//   newView.element.scrollTo(0, currentYCoord);
// };

export const replaceWithScroll = (newView, oldView) => {
  const currentYCoord = oldView.element.scrollTop;
  replace(newView, oldView);
  newView.element.scrollTo(0, currentYCoord);
};
