class GraphQLSchemaService {
  /**
   *
   * @returns {string}
   */
  static getAuthorPreviewGql() {
    return `
      User {
        id
        account_name
        first_name
        last_name
        nickname
        avatar_filename
        current_rate
       }
    `;
  }

  /**
   *
   * @returns {string}
   */
  static getPostPreviewFieldsGql() {
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
    
         main_image_filename
         entity_images
    
         comments_count
         current_vote
         current_rate
    
         entity_id_for
         entity_name_for
    
         organization_id
         
         ${this.getAuthorPreviewGql()}
    `;
  }

  /**
   *
   * @param {number} userId
   * @param {number} feedPage
   * @param {number} feedPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   */
  static getUserWallFeedGql(userId, feedPage, feedPerPage, commentsPage, commentsPerPage) {
    return `
query {
  user_wall_feed(user_id: ${userId}, page: ${feedPage}, per_page: ${feedPerPage}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
    data {
     id
     title
     post_type_id
     leading_text
     description
     user_id
     blockchain_id

     created_at
     updated_at

     main_image_filename
     entity_images


     comments_count
     current_vote
     current_rate

     entity_id_for
     entity_name_for

     organization_id
     
     post {
       ${this.getPostPreviewFieldsGql()}
     }

     comments {
      data {
        id
        description
        current_vote

        metadata {
          next_depth_total_amount
        }

        User {
          id
          account_name
          first_name
          last_name
          nickname
          avatar_filename
          current_rate
        }

        blockchain_id
        commentable_id
        created_at
        activity_user_comment
        organization

        depth
        myselfData {
          myselfVote
        }
        organization_id
        parent_id
        path
        updated_at
        user_id
      }
      metadata {
        page
        per_page
        has_more
      }
     }

     myselfData {
      myselfVote
      join
      organization_member
     }

     User {
      id
      account_name
      first_name
      last_name
      nickname
      avatar_filename
      current_rate
     }
   }

    metadata {
      page
      per_page
      has_more
    }
  }
}
    `
  }

}

module.exports = GraphQLSchemaService;
