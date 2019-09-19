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
  static getOnePostOfferFields() {
    return `
      started_at
      finished_at
      post_offer_type_id
      users_team
      offer_data
    `;
  }

  static getPostCommonFields() {
    return `
      id
      title
      post_type_id
      leading_text
      description
      user_id
      blockchain_id
      
      created_at
      updated_at

      entity_images
      json_data
      entity_tags
      comments_count
      views_count
      
      current_vote
      current_rate
      
      entity_id_for
      entity_name_for
      entity_for_card

      organization_id
    `;
  }
}

module.exports = PostsQueries;
