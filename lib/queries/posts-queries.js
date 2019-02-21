class PostsQueries {
  /**
   *
   * @returns {string}
   */
  static getPostMyselfDataQuery() {
    return `
       myselfData {
          myselfVote
          join
          organization_member
          repost_available
       }
    `;
  }
}

module.exports = PostsQueries;