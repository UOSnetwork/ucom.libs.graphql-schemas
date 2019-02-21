class CommonQueries {
  /**
   *
   * @returns {string}
   */
  static getMetadataQuery() {
    return `
      metadata {
        page
        per_page
        has_more
        total_amount
      }
    `;
  }
}

module.exports = CommonQueries;