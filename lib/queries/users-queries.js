const Helpers = require('../helpers');
const CommonQueries = require('./common-queries');

class UsersQueries {
  /**
   *
   * @param {Object} filter
   * @param {string} orderBy
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersQueryFields(filter, orderBy, page = 1, perPage = 10, isMyself = true) {
    const filterString = Helpers.stringify(filter);

    return `
      many_users(filters: ${filterString}, order_by: "${orderBy}", page: ${page}, per_page: ${perPage}) {
        ${UsersQueries.getUsersListFieldsQuery(isMyself)}
      }
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getUsersListFieldsQuery(isMyself = true, extraFields = []) {
    return `
      data {
        ${UsersQueries.getAuthorPreviewFieldsWithMyselfData(isMyself, extraFields)}
      }
      ${CommonQueries.getMetadataQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static getAuthorPreviewFieldsWithMyselfData(isMyself = true, extraFields = []) {
    const extraFieldsString = extraFields.join("\n");

    return `
      I_follow 
      followed_by
      
      ${extraFieldsString}
      
      ${UsersQueries.getUserPreviewFields()}
      
      ${isMyself ? UsersQueries.getAuthorRelatedMyselfData() : ''}
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static getUserPreviewFields() {
    return `
        id
        account_name
        first_name
        last_name
        nickname
        avatar_filename
        current_rate      
    `;
  }

  static getAuthorRelatedMyselfData() {
    return `
      myselfData {
        follow
        myFollower
      }
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getAuthorPreviewQueryWithMyselfData() {
    return `
      User {
        ${UsersQueries.getAuthorPreviewFieldsWithMyselfData()}    
      }
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getAuthorPreviewQuery() {
    return `
      User {
        ${UsersQueries.getUserPreviewFields()}
      }
    `;
  }

  /**
   *
   * @param {Object} filter
   * @param {string} orderBy
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersQuery(filter, orderBy, page, perPage, isMyself = true) {
    return `
      query {
        ${UsersQueries.getManyUsersQueryFields(filter, orderBy, page, perPage, isMyself)}
      }
    `
  }
}

module.exports = UsersQueries;