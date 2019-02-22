const CommonQueries = require('./common-queries');
const Helpers = require('../helpers');

class OrganizationsQueries {
  /**
   *
   * @param {Object} filter
   * @param {string} orderBy
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getManyOrganizationsQuery(filter, orderBy, page = 1, perPage = 10) {
    return `
      query {
        ${OrganizationsQueries.getManyOrganizationsQueryFields(filter, orderBy, page, perPage)}
      }
    `
  }

  /**
   *
   * @param {Object} filter
   * @param {string} orderBy
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getManyOrganizationsQueryFields(filter, orderBy, page = 1, perPage = 10) {
    const stringFilter = Helpers.stringify(filter);

    return `
      many_organizations(filters: ${stringFilter}, order_by: "${orderBy}", page: ${page}, per_page: ${perPage}) {
        ${OrganizationsQueries.getOrganizationsListFieldsQuery()}
      }
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getOrganizationPreviewQuery() {
    return `
      organization {
        ${OrganizationsQueries.getOrganizationPreviewFields()}
      }
    `;
  }


  /**
   * @returns {string}
   */
  static getOrganizationsListFieldsQuery() {
    return `
      data {
        ${OrganizationsQueries.getOrganizationPreviewFields()}
      }

      ${CommonQueries.getMetadataQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getOrganizationPreviewFields() {
    return `
        id
        title
        avatar_filename
        nickname
        current_rate
        user_id
        powered_by
        about      
    `;
  }
}

module.exports = OrganizationsQueries;