const CommonQueries = require('./common-queries');

class TagsQueries {
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