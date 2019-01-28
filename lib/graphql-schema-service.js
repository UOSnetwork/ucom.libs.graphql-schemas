class GraphQLSchemaService {
  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} userId
   * @param {number} feedPage
   * @param {number} feedPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getUserWallFeedQuery(userId, feedPage, feedPerPage, commentsPage, commentsPerPage, isMyself = true) {
    return `
      query {
        user_wall_feed(user_id: ${userId}, page: ${feedPage}, per_page: ${feedPerPage}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
          ${GraphQLSchemaService._getPostsListFieldsQuery(isMyself)}
        }
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} organizationId
   * @param {number} feedPage
   * @param {number} feedPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getOrganizationWallFeedQuery(organizationId, feedPage, feedPerPage, commentsPage, commentsPerPage, isMyself = true) {
    return `
      query {
        org_wall_feed(organization_id: ${organizationId}, page: ${feedPage}, per_page: ${feedPerPage}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
          ${GraphQLSchemaService._getPostsListFieldsQuery(isMyself)}
        }
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number|string} tagIdentity - tag title
   * @param {number} feedPage
   * @param {number} feedPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getTagWallFeedQuery(tagIdentity, feedPage, feedPerPage, commentsPage, commentsPerPage, isMyself = true) {
    return `
      query {
        tag_wall_feed(tag_identity: "${tagIdentity}", page: ${feedPage}, per_page: ${feedPerPage}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
          ${GraphQLSchemaService._getPostsListFieldsQuery(isMyself)}
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
           ${GraphQLSchemaService._getAuthorPreviewQueryWithMyselfData()}
           
           ${GraphQLSchemaService._getAllSinglePostFields()}     
           ${GraphQLSchemaService._getCommentsQuery(true)}
           ${GraphQLSchemaService._getPostMyselfDataQuery()}     
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
           ${GraphQLSchemaService._getAuthorPreviewQuery()}
           
           ${GraphQLSchemaService._getAllSinglePostFields()}     
           ${GraphQLSchemaService._getCommentsQuery(false)}
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
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getUserNewsFeed(feedPage, feedPerPage, commentsPage, commentsPerPage, isMyself = true) {
    return `
      query {
        user_news_feed(page: ${feedPage}, per_page: ${feedPerPage}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
          ${GraphQLSchemaService._getPostsListFieldsQuery(isMyself)}
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
   * @param {boolean} isMyselfData
   * @returns {string}
   */
  static getPostCommentsQuery(commentableId, page, perPage, isMyselfData = true) {
    return `
      query {
        feed_comments(commentable_id: ${commentableId}, page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService._getCommentsListFields(isMyselfData)}
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
   * @param {boolean} isMyselfData
   * @returns {string}
   */
  static getCommentsOnCommentQuery(commentableId, parentId, parentDepth, page, perPage, isMyselfData = true) {
    return `
      query {
        comments_on_comment(commentable_id: ${commentableId}, parent_id: ${parentId}, parent_depth: ${parentDepth}, page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService._getCommentsListFields(isMyselfData)}
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
        ${GraphQLSchemaService._getCommentsListFields(myselfData)}
      }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getCommentsListFields(myselfData) {
    return `
      data {
        id
        description
        current_vote

        metadata {
          next_depth_total_amount
        }

        ${GraphQLSchemaService._getAuthorPreviewQuery()}

        blockchain_id
        commentable_id
        created_at
        activity_user_comment
        ${GraphQLSchemaService._getOrganizationPreviewQuery()}

        depth
        ${myselfData ? GraphQLSchemaService._getCommentMyselfData() : ''}
        organization_id
        parent_id
        path
        updated_at
        user_id
      }
      ${GraphQLSchemaService._getMetadataQuery()}
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
       ${GraphQLSchemaService._getOrganizationPreviewQuery()}
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
        ${GraphQLSchemaService._getUserPreviewFields()}
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
        I_follow 
        followed_by
        ${GraphQLSchemaService._getUserPreviewFields()}
        ${GraphQLSchemaService._getAuthorRelatedMyselfData()}
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
  
       comments_count
       current_vote
       current_rate
  
       entity_id_for
       entity_name_for
  
       organization_id
       
       entity_images
       entity_tags

       ${GraphQLSchemaService._getOrganizationPreviewQuery()}
       
       ${GraphQLSchemaService._getAuthorPreviewQuery()}
    `;
  }

  /**
   *
   * @param {boolean} isMyself
   * @returns {string}
   * @private
   */
  static _getPostsListFieldsQuery(isMyself) {
    return `
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
       entity_tags
  
       entity_id_for
       entity_name_for
  
       organization_id
       ${GraphQLSchemaService._getOrganizationPreviewQuery()}
       
       post {
         ${GraphQLSchemaService._getPostPreviewFieldsQuery()}
       }
  
      ${GraphQLSchemaService._getCommentsQuery(isMyself)}
  
       myselfData {
        myselfVote
        join
        organization_member
       }
       
       ${GraphQLSchemaService._getAuthorPreviewQuery()}
     }
  
      ${GraphQLSchemaService._getMetadataQuery()}
    `;
  }
}

module.exports = GraphQLSchemaService;
