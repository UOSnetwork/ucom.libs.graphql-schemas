const CommonQueries = require('./common-queries');
const Helpers = require('../helpers');

class TagsQueries {
  static getManyTagsKey() {
    return 'many_tags';
  }

  /**
   * @param {Object} filter
   * @param {string} ordering
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTagsQuery(filter, ordering, page, perPage, isMyself = true) {
    return `
      query {
        ${TagsQueries.getManyTagsQueryFields(filter, ordering, page, perPage, isMyself)}
      }
    `;
  }

  /**
   * @param {Object} filter
   * @param {string} ordering
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTagsQueryFields(filter, ordering, page, perPage, isMyself = true) {
    const stringFilter = Helpers.stringify(filter);

    return `
      many_tags(filters: ${stringFilter}, order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
        ${TagsQueries.getTagsListQuery()}
      }
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getTagsListQuery() {
    return `
      data {
        ${TagsQueries._getOneTagFields()}
      }
      ${CommonQueries.getMetadataQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getOneTagFields() {
    return `
      id
      title
      current_rate
      current_posts_amount
      current_media_posts_amount
      current_direct_posts_amount
      entity_name
      
      created_at
      updated_at
      
      first_entity_id
    `;
  }

}

module.exports = TagsQueries;
