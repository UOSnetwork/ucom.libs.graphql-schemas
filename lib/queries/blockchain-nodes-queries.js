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
}

module.exports = BlockchainNodesQueries;
