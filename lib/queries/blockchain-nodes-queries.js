class BlockchainNodesQueries {
  /**
   *
   * @param {string} ordering
   * @param {number} page
   * @param {number} perPage
   */
  static getManyBlockchainNodesQuery(ordering, page, perPage) {
    return `
      query {
        many_blockchain_nodes(order_by: "${ordering}", page: ${page}, per_page: ${perPage})
      }
    `;
  }

  /**
   *
   * @param params = {
   *   order_by: string,
   *   page: number,
   *   per_page: number
   * }
   * @returns {string}
   */
  static getManyBlockchainNodesQueryPart(params) {
    return `
      many_blockchain_nodes(order_by: "${params.order_by}", page: ${params.page}, per_page: ${params.per_page})
    `;
  }
}

module.exports = BlockchainNodesQueries;
