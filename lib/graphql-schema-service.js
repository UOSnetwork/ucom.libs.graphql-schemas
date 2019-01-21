class GraphQLSchemaService {
  /**
   *
   * @returns {string}
   * @private
   */
  static _getAuthorPreviewQuery() {
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
   * @private
   */
  static _getPostPreviewFieldsQuery() {
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
         
         ${this._getAuthorPreviewQuery()}
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
  static getUserWallFeedQuery(userId, feedPage, feedPerPage, commentsPage, commentsPerPage) {
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
       ${this._getPostPreviewFieldsQuery()}
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

  /**
   *
   * @param {number} commentableId
   * @param {number} parentId
   * @param {number} parentDepth
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getCommentsOnCommentQuery(commentableId, parentId, parentDepth, page, perPage) {
    return `
query {
  comments_on_comment(commentable_id: ${commentableId}, parent_id: ${parentId}, parent_depth: ${parentDepth}, page: ${page}, per_page: ${perPage}) {
    data {
      id
      description
      current_vote
      blockchain_id
      commentable_id
      created_at
      activity_user_comment
      organization
      depth
      organization_id
      parent_id
      path
      updated_at
      user_id

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

      myselfData {
        myselfVote
      }
    }
    metadata {
      page
      per_page
      has_more
    }
  }
}
    `;
  }

}

module.exports = GraphQLSchemaService;
