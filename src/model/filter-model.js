import { FilterType } from '../const/common';
import Observable from '../framework/observable';


export default class FilterModel extends Observable {
  #activeFilter = FilterType.ALL;

  get activeFilter() {
    return this.#activeFilter;
  }

  set activeFilter(fitler) {
    this.#activeFilter = fitler;
    this._notify();
  }
}
