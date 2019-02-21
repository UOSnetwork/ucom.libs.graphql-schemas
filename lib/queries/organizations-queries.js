const CommonQueries = require('./common-queries');

class OrganizationsQueries {
  static getManyOrganizationsQueryFields(stringFilter, orderBy, page = 1, perPage = 10) {
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