const OVERVIEW_TYPE__TRENDING = 'trending';
const OVERVIEW_TYPE__HOT      = 'hot';

class Helpers {
  /**
   *
   * @param {Object} obj_from_json
   * @returns {string}
   */
  static stringify(obj_from_json){
    if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
      // not an object, stringify using native function
      return JSON.stringify(obj_from_json);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    let props = Object
      .keys(obj_from_json)
      .map(key => `${key}:${Helpers.stringify(obj_from_json[key])}`)
      .join(",");
    return `{${props}}`;
  }

  /**
   *
   * @returns {{ordering: string, stringFilter: string}}
   */
  static getFilterAndOrderingForHot(extraFilters = {}) {
    const ordering = '-activity_index_delta';

    const objectFilters = {
      overview_type: OVERVIEW_TYPE__HOT,
      ...extraFilters,
    };

    const stringFilter = Helpers.stringify(objectFilters);

    return { stringFilter, ordering }
  }


  /**
   *
   * @param extraFilters
   * @returns {{ordering: string, stringFilter: string}}
   */
  static getFilterAndOrderingForTrending(extraFilters = {}) {
    const ordering = '-importance_delta';

    const objectFilters = {
      overview_type: OVERVIEW_TYPE__TRENDING,
      ...extraFilters,
    };

    const stringFilter = Helpers.stringify(objectFilters);

    return { stringFilter, ordering }
  }


}

module.exports = Helpers;
