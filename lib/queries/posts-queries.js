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

  /**
   *
   * @returns {string}
   */
  static getGithubAirdropPostFields() {
    return `
      started_at
      finished_at
      post_offer_type_id
      users_team
      offer_data
    `;
  }
}

module.exports = PostsQueries;