class GraphQLSchemaService {
  // noinspection JSUnusedGlobalSymbols
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
     
     ${this._getOrganizationPreviewQuery()}

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
      ${this._getMetadataQuery()}
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

    ${this._getMetadataQuery()}
  }
}
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postId
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   */
  static getOnePostQueryAsMyself(postId, commentsPage = 1, commentsPerPage = 10) {
    return `
query {
  one_post(id: ${postId}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
     ${this._getAuthorPreviewQueryWithMyselfData()}
     
     ${this._getAllSinglePostFields()}     
     ${this._getCommentsQuery(true)}
     ${this._getPostMyselfDataQuery()}     
  }
}
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postId
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   */
  static getOnePostQueryAsGuest(postId, commentsPage = 1, commentsPerPage = 10) {
    return `
query {
  one_post(id: ${postId}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
     ${this._getAuthorPreviewQuery()}
     
     ${this._getAllSinglePostFields()}     
     ${this._getCommentsQuery(false)}
  }
}
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} feedPage
   * @param {number} feedPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   */
  static getUserNewsFeed(feedPage, feedPerPage, commentsPage, commentsPerPage) {
    return `
query {
  user_news_feed(page: ${feedPage}, per_page: ${feedPerPage}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
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
     ${this._getOrganizationPreviewQuery()}
     
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
        
        ${this._getAuthorPreviewQuery()}

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
      ${this._getMetadataQuery()}
     }

     myselfData {
      myselfVote
      join
      organization_member
     }
     
     ${this._getAuthorPreviewQuery()}
   }

    ${this._getMetadataQuery()}
  }
}
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} commentableId
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getPostCommentsQuery(commentableId, page, perPage) {
    return `
query {
  feed_comments(commentable_id: ${commentableId}, page: ${page}, per_page: ${perPage}) {
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
    ${this._getMetadataQuery()}
  }
}
    `;
  }

  // noinspection JSUnusedGlobalSymbols
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
    ${this._getMetadataQuery()}
  }
}
    `;
  }

  static _getAuthorRelatedMyselfData() {
    return `
      myselfData {
        follow
        myFollower
      }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getCommentMyselfData() {
    return `
      myselfData {
        myselfVote
      }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getCommentsQuery(myselfData) {
    return `
    comments {
      data {
        id
        description
        current_vote

        metadata {
          next_depth_total_amount
        }

        ${this._getAuthorPreviewQuery()}

        blockchain_id
        commentable_id
        created_at
        activity_user_comment
        organization

        depth
        ${myselfData ? this._getCommentMyselfData() : ''}
        organization_id
        parent_id
        path
        updated_at
        user_id
      }
      ${this._getMetadataQuery()}
    }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getMetadataQuery() {
    return `
      metadata {
        page
        per_page
        has_more
        total_amount
      }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getAllSinglePostFields() {
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
       
       entity_tags
  
  
       comments_count
       current_vote
       current_rate
  
       entity_id_for
       entity_name_for
  
       organization_id
       ${this._getOrganizationPreviewQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getOrganizationPreviewQuery() {
    return `
      organization {
        id
        title
        avatar_filename
        nickname
        current_rate
        user_id
      }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getPostMyselfDataQuery() {
    return `
     myselfData {
        myselfVote
        join
        organization_member
     }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getAuthorPreviewQuery() {
    return `
      User {
        ${this._getUserPreviewFields()}
      }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getUserPreviewFields() {
    return `
        id
        account_name
        first_name
        last_name
        nickname
        avatar_filename
        current_rate      
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getAuthorPreviewQueryWithMyselfData() {
    return `
      User {    
        ${this._getUserPreviewFields()}
        I_follow 
        followed_by
        ${this._getAuthorRelatedMyselfData()}
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
         
         ${this._getOrganizationPreviewQuery()}
         
         ${this._getAuthorPreviewQuery()}
    `;
  }
}

module.exports = GraphQLSchemaService;
