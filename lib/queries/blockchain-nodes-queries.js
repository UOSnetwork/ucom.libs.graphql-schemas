const Helpers = require('../helpers');

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
    const inputString = Helpers.getParamsInputString(params);

    return `
      many_blockchain_nodes(${inputString})
    `;
  }

}

module.exports = BlockchainNodesQueries;
