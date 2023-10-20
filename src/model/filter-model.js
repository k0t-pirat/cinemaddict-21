import { FilterType } from '../const/common';


export default class FilterModel {
  #activeFilter = FilterType.ALL;

  get activeFilter() {
    return this.#activeFilter;
  }
}
