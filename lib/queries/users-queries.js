const Helpers = require('../helpers');
const CommonQueries = require('./common-queries');

const PROPS_FIELDS = [
  'posts_total_amount_delta',
  'scaled_importance_delta',
  'scaled_social_rate_delta',

  'staked_balance',
  'validity',
  'importance',
  'scaled_importance',

  'stake_rate',
  'scaled_stake_rate',

  'social_rate',
  'scaled_social_rate',

  'transfer_rate',
  'scaled_transfer_rate',

  'previous_cumulative_emission',
  'current_emission',
  'current_cumulative_emission',
];


class UsersQueries {
  static getPropsFields() {
    return PROPS_FIELDS;
  }

  static getManyUsersKey() {
    return 'many_users';
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
  static getManyUsersQueryFields(filter, orderBy, page = 1, perPage = 10, isMyself = true) {
    const filterString = Helpers.stringify(filter);

    return `
      many_users(filters: ${filterString}, order_by: "${orderBy}", page: ${page}, per_page: ${perPage}) {
        ${UsersQueries.getUsersListFieldsWithPropsQuery(isMyself)}
      }
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getUsersListFieldsQuery(isMyself = true, extraFields = []) {
    const extraFieldsWithProps = [
      ...extraFields,
      ...PROPS_FIELDS,
    ];

    return `
      data {
        ${UsersQueries.getAuthorPreviewFieldsWithMyselfData(isMyself, [...new Set(extraFieldsWithProps)])}
      }
      ${CommonQueries.getMetadataQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getUsersListFieldsWithPropsQuery(isMyself = true) {
    return `
      data {
        ${UsersQueries.getAuthorPreviewFieldsWithMyselfData(isMyself, PROPS_FIELDS)}
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
      ${extraFieldsString}
      
      ${UsersQueries.getUserPreviewFields()}
      
      ${isMyself ? UsersQueries.getAuthorRelatedMyselfData() : ''}
      ${isMyself ? UsersQueries._getIFollowFollowedByFields() : ''}
    `;
  }

  static _getIFollowFollowedByFields() {
    return `
      I_follow 
      followed_by
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
        entity_images
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
  static getAuthorPreviewQueryWithMyselfData(isMyself = true) {
    return `
      User {
        ${UsersQueries.getAuthorPreviewFieldsWithMyselfData(isMyself, PROPS_FIELDS)}    
      }
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getAuthorPreviewQuery(isMyself = true) {
    return `
      User {
        ${UsersQueries.getAuthorPreviewFieldsWithMyselfData(isMyself, PROPS_FIELDS)}
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
