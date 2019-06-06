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
   * @returns {{ordering: string, filter: Object}}
   */
  static getFilterAndOrderingForHot(extraFilters = {}) {
    const ordering = '-activity_index_delta';

    const filter = {
      overview_type: OVERVIEW_TYPE__HOT,
      ...extraFilters,
    };

    return { filter, ordering }
  }

  /**
   *
   * @param extraFilters
   * @returns {{ordering: string, filter: Object}}
   */
  static getFilterAndOrderingForTrending(extraFilters = {}) {
    const ordering = '-importance_delta';

    const filter = {
      overview_type: OVERVIEW_TYPE__TRENDING,
      ...extraFilters,
    };

    return { filter, ordering }
  }

  /**
   *
   * @param params = {
   *   filters:   Object,
   *   order_by:  string,
   *   page:      number,
   *   per_page:  number,
   * }
   *
   * @returns {string}
   */
  static getParamsInputString(params) {
    Helpers.checkIsObject(params, 'params');

    const allowedFields = [
      'filters',
      'order_by',
      'page',
      'per_page'
    ];

    Helpers.checkAllowedFieldsForObject(params, allowedFields);

    const parts = [];

    if (typeof params.filters !== 'undefined') {
      parts.push(Helpers.getFiltersInputString(params.filters));
    }

    if (typeof params.order_by !== 'undefined') {
      parts.push(Helpers.getOrderByInputString(params.order_by));
    }

    if (typeof params.page !== 'undefined') {
      parts.push(Helpers.getPageInputString(params.page));
    }

    if (typeof params.per_page !== 'undefined') {
      parts.push(Helpers.getPerPageInputString(params.per_page));
    }

    return `${parts.join(', ')}`;
  }

  /**
   *
   * @param {Object} filters
   * @returns {string}
   * @private
   */
  static getFiltersInputString(filters) {
    Helpers.checkIsObject(filters, 'filters');

    const stringFilters = Helpers.stringify(filters);

    return `filters: ${stringFilters}`;
  }

  /**
   *
   * @param {string} orderBy
   * @returns {string}
   * @private
   */
  static getOrderByInputString(orderBy) {
    Helpers.checkIsString(orderBy, 'order_by');

    return `order_by: "${orderBy}"`;
  }

  /**
   *
   * @param {number} page
   * @returns {string}
   * @private
   */
  static getPageInputString(page) {
    Helpers.checkIsPositiveNonZeroInteger(page, 'page');

    return `page: ${page}`;
  }

  /**
   *
   * @param {number} perPage
   * @returns {string}
   * @private
   */
  static getPerPageInputString(perPage) {
    Helpers.checkIsPositiveNonZeroInteger(perPage, 'per_page');

    return `per_page: ${perPage}`;
  }

  /**
   *
   * @param {Object} value
   * @param {string} fieldName
   */
  static checkIsObject(value, fieldName) {
    if (typeof value !== 'object') {
      throw new TypeError(`${fieldName} should be an object`);
    }

    if (Array.isArray(value)) {
      throw new TypeError(`${fieldName} should be an object, not an array`);
    }
  }

  /**
   *
   * @param {string} value
   * @param {string} fieldName
   */
  static checkIsString(value, fieldName) {
    if (typeof value !== 'string') {
      throw new TypeError(`${fieldName} should be a string`);
    }

    if (value.length === 0) {
      throw new TypeError(`${fieldName} string length is 0 - it is not allowed`);
    }
  }

  /**
   *
   * @param {number} value
   * @param {string} fieldName
   * @returns {void}
   * @private
   */
  static checkIsPositiveNonZeroInteger(value, fieldName) {
    if (typeof value !== 'number') {
      throw new TypeError(`${fieldName} param should be a number`);
    }

    if (!Number.isFinite(value)) {
      throw new TypeError(`${fieldName} param must be a finite number`);
    }

    if (value <= 0) {
      throw new TypeError(`${fieldName} param should be greater than 0`);
    }

    if (!Number.isInteger(value)) {
      throw new TypeError(`${fieldName} param should be a integer`);
    }
  }

  /**
   *
   * @param {Object} object
   * @param {string[]} allowedFields
   * @private
   */
  static checkAllowedFieldsForObject(object, allowedFields) {
    const paramsKeys = Object.keys(object);

    for (const field of paramsKeys) {
      if (!allowedFields.includes(field)) {
        throw new TypeError(`Field ${field} is not allowed. Allowed fields are: ${allowedFields.join(', ')}`)
      }
    }
  }
  static getQueryPart(key, inputString, fields) {
    return `
      ${key}(${inputString}) {
        ${fields}
      }
    `;
  }

}

module.exports = Helpers;
