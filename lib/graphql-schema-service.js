const OVERVIEW_TYPE__TRENDING = 'trending';
const OVERVIEW_TYPE__HOT      = 'hot';
const OVERVIEW_TYPE__FRESH    = 'fresh';
const OVERVIEW_TYPE__TOP      = 'top';

const ENTITY_TYPE__POSTS      = 'posts     ';
const ENTITY_TYPE__TAGS      = 'tags      ';
const ENTITY_TYPE__ORGS      = 'org       ';

const USERS_ORDERING_FOR_OVERVIEW = '-current_rate';

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
   * @deprecated
   * @see getManyTrendingPostsQuery|getManyHotPostsQuery
   * @param {Object} postFiltering
   * @param {string} postOrdering
   * @param {number} postPage
   * @param {number} postPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getPostsQuery(postFiltering, postOrdering, postPage, postPerPage, commentsPage, commentsPerPage, isMyself = true) {
    const commentsQuery = this._getCommentsInputQuery(commentsPage, commentsPerPage);
    // remove all quites around keys
    const stringFilter = GraphQLSchemaService._stringify(postFiltering);
    return `
      query {
        posts(filters: ${stringFilter}, order_by: "${postOrdering}", page: ${postPage}, per_page: ${postPerPage}, comments_query: ${commentsQuery}) {
          ${GraphQLSchemaService._getPostsListFieldsQuery(isMyself)}
        }
      }
    `
  }

  /**
   * @param {number} postTypeId
   * @param {number} postPage
   * @param {number} postPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTrendingPostsQuery(postTypeId, postPage, postPerPage, commentsPage, commentsPerPage, isMyself = true) {
    const { stringFilter, ordering } = this._getFilterAndOrderingForTrending({
      post_type_id: postTypeId,
    });

    const usersFilter = {
      entity_name:    ENTITY_TYPE__POSTS,
      overview_type:  OVERVIEW_TYPE__TRENDING,
    };

    return this._getManyPostsQuery(stringFilter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself);
  }

  /**
   * @param {number} postTypeId
   * @param {number} postPage
   * @param {number} postPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyHotPostsQuery(postTypeId, postPage, postPerPage, commentsPage, commentsPerPage, isMyself = true) {
    const { stringFilter, ordering } = this._getFilterAndOrderingForHot({
      post_type_id: postTypeId,
    });

    const usersFilter = {
      entity_name:    ENTITY_TYPE__POSTS,
      overview_type:  OVERVIEW_TYPE__HOT,
    };

    return this._getManyPostsQuery(stringFilter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} postTypeId
   * @param {number} postPage
   * @param {number} postPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyFreshPostsQuery(postTypeId, postPage, postPerPage, commentsPage, commentsPerPage, isMyself = true) {
    const filter = {
      post_type_id: postTypeId,
    };

    const ordering = '-id';

    const usersFilter = {
      entity_name:    ENTITY_TYPE__POSTS,
      overview_type:  OVERVIEW_TYPE__FRESH,
    };

    const stringFilter = this._stringify(filter);

    return this._getManyPostsQuery(stringFilter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param {number} postTypeId
   * @param {number} postPage
   * @param {number} postPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTopPostsQuery(postTypeId, postPage, postPerPage, commentsPage, commentsPerPage, isMyself = true) {
    const filter = {
      post_type_id: postTypeId,
    };

    const ordering = '-current_rate';

    const usersFilter = {
      entity_name:    ENTITY_TYPE__POSTS,
      overview_type:  OVERVIEW_TYPE__TOP,
    };

    const stringFilter = this._stringify(filter);

    return this._getManyPostsQuery(stringFilter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself);
  }

  /**
   * @param {string} stringFilter
   * @param {string} ordering
   * @param {Object} usersFilter
   * @param {number} postPage
   * @param {number} postPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static _getManyPostsQuery(stringFilter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself = true) {
    const commentsQuery = this._getCommentsInputQuery(commentsPage, commentsPerPage);

    const usersPage     = 1;
    const usersPerPage  = 10;

    return `
      query {
        many_posts(filters: ${stringFilter}, order_by: "${ordering}", page: ${postPage}, per_page: ${postPerPage}, comments_query: ${commentsQuery}) {
          ${GraphQLSchemaService._getPostsListFieldsQuery(isMyself)}
        }
        ${GraphQLSchemaService._getManyUsersQueryFields(usersFilter, USERS_ORDERING_FOR_OVERVIEW, usersPage, usersPerPage, isMyself)}
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postTypeId
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForTrendingPostsQuery(postTypeId, page, perPage, isMyself = true) {
    const filter = {
      post_type_id:   postTypeId,
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__POSTS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postTypeId
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForHotPostsQuery(postTypeId, page, perPage, isMyself = true) {
    const filter = {
      post_type_id:   postTypeId,
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__POSTS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postTypeId
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForFreshPostsQuery(postTypeId, page, perPage, isMyself = true) {
    const filter = {
      post_type_id:   postTypeId,
      overview_type:  OVERVIEW_TYPE__FRESH,
      entity_name:    ENTITY_TYPE__POSTS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postTypeId
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForTopPostsQuery(postTypeId, page, perPage, isMyself = true) {
    const filter = {
      post_type_id:   postTypeId,
      overview_type:  OVERVIEW_TYPE__TOP,
      entity_name:    ENTITY_TYPE__POSTS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForTrendingTagsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__TAGS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForHotTagsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__TAGS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForFreshTagsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__FRESH,
      entity_name:    ENTITY_TYPE__TAGS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForTopTagsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__TOP,
      entity_name:    ENTITY_TYPE__TAGS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForTrendingOrganizationsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__ORGS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForHotOrganizationsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__ORGS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForFreshOrganizationsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__FRESH,
      entity_name:    ENTITY_TYPE__ORGS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsersForTopOrganizationsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__TOP,
      entity_name:    ENTITY_TYPE__ORGS,
    };

    return this._getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {string} ordering
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getOrganizationsQuery(ordering, page, perPage) {
    return `
      query {
        organizations(order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService._getOrganizationsListFieldsQuery()}
        }
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getTrendingOrganizationsQuery(page, perPage) {
    const {stringFilter, ordering} = this._getFilterAndOrderingForTrending();

    return `
      query {
        organizations(filters: ${stringFilter}, order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService._getOrganizationsListFieldsQuery()}
        }
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getHotOrganizationsQuery(page, perPage) {
    const {stringFilter, ordering} = this._getFilterAndOrderingForHot();

    return `
      query {
        organizations(filters: ${stringFilter}, order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService._getOrganizationsListFieldsQuery()}
        }
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @deprecated
   * @param {string} ordering
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getManyTagsQuery(ordering, page, perPage) {
    return `
      query {
        many_tags(order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService._getTagsListQuery()}
        }
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTrendingTagsQuery(page, perPage, isMyself = true) {
    const {stringFilter, ordering} = this._getFilterAndOrderingForTrending();

    const usersFilter = {
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__TAGS,
    };

    return this._getManyTagsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyHotTagsQuery(page, perPage, isMyself = true) {
    const { stringFilter, ordering } = this._getFilterAndOrderingForHot();

    const usersFilter = {
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__TAGS,
    };

    return this._getManyTagsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyFreshTagsQuery(page, perPage, isMyself = true) {
    const ordering = '-id';

    const usersFilter = {
      entity_name:    ENTITY_TYPE__TAGS,
      overview_type:  OVERVIEW_TYPE__FRESH,
    };

    const stringFilter = this._stringify({});

    return this._getManyTagsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTopTagsQuery(page, perPage, isMyself = true) {
    const ordering = '-current_rate';

    const usersFilter = {
      entity_name:    ENTITY_TYPE__TAGS,
      overview_type:  OVERVIEW_TYPE__TOP,
    };

    const stringFilter = this._stringify({});

    return this._getManyTagsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself);
  }

  /**
   * @param {string} stringFilter
   * @param {string} ordering
   * @param {Object} usersFilter
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static _getManyTagsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself = true) {
    const usersPage     = 1;
    const usersPerPage  = 10;

    return `
      query {
        many_tags(filters: ${stringFilter}, order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService._getTagsListQuery()}
        }
        ${GraphQLSchemaService._getManyUsersQueryFields(usersFilter, USERS_ORDERING_FOR_OVERVIEW, usersPage, usersPerPage, isMyself)}
      }
    `;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTrendingOrganizationsQuery(page, perPage, isMyself = true) {
    const {stringFilter, ordering} = this._getFilterAndOrderingForTrending();

    const usersFilter = {
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__ORGS,
    };

    return this._getManyOrganizationsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyHotOrganizationsQuery(page, perPage, isMyself = true) {
    const { stringFilter, ordering } = this._getFilterAndOrderingForHot();

    const usersFilter = {
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__ORGS,
    };

    return this._getManyOrganizationsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyFreshOrganizationsQuery(page, perPage, isMyself = true) {
    const ordering = '-id';

    const usersFilter = {
      entity_name:    ENTITY_TYPE__ORGS,
      overview_type:  OVERVIEW_TYPE__FRESH,
    };

    const stringFilter = this._stringify({});

    return this._getManyOrganizationsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTopOrganizationsQuery(page, perPage, isMyself = true) {
    const ordering = '-current_rate';

    const usersFilter = {
      entity_name:    ENTITY_TYPE__ORGS,
      overview_type:  OVERVIEW_TYPE__TOP,
    };

    const stringFilter = this._stringify({});

    return this._getManyOrganizationsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself);
  }

  /**
   * @param {string} stringFilter
   * @param {string} ordering
   * @param {Object} usersFilter
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   * @private
   */
  static _getManyOrganizationsQuery(stringFilter, ordering, usersFilter, page, perPage, isMyself = true) {
    const usersPage     = 1;
    const usersPerPage  = 10;

    return `
      query {
        many_organizations(filters: ${stringFilter}, order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService._getOrganizationsListFieldsQuery()}
        }
        ${GraphQLSchemaService._getManyUsersQueryFields(usersFilter, USERS_ORDERING_FOR_OVERVIEW, usersPage, usersPerPage, isMyself)}
      }
    `;
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

  /**
   *
   * @param {Object} filter
   * @param {string} orderBy
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static _getManyUsersQuery(filter, orderBy, page, perPage, isMyself = true) {
    return `
      query {
        ${this._getManyUsersQueryFields(filter, orderBy, page, perPage, isMyself)}
      }
    `
  }

  /**
   *
   * @param {Object} filter
   * @param {string} orderBy
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   * @private
   */
  static _getManyUsersQueryFields(filter, orderBy, page, perPage, isMyself) {
    const filterString = this._stringify(filter);

    return `
      many_users(filters: ${filterString}, order_by: "${orderBy}", page: ${page}, per_page: ${perPage}) {
        ${GraphQLSchemaService._getUsersListFieldsQuery(isMyself)}
      }
    `;
  }

  /**
   *
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   * @private
   */
  static _getCommentsInputQuery(commentsPage, commentsPerPage) {
    return `{page: ${commentsPage}, per_page: ${commentsPerPage}}`;
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
       entity_for_card
  
       organization_id
       
       ${this._getPostInPostPreviewQuery()}
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
        ${this._getOrganizationPreviewFields()}
      }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getOrganizationPreviewFields() {
    return `
        id
        title
        avatar_filename
        nickname
        current_rate
        user_id
        powered_by
        about      
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
          repost_available
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
        ${this._getAuthorPreviewFieldsWithMyselfData()}    
      }
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getAuthorPreviewFieldsWithMyselfData(isMyself = true) {
    return `
      I_follow 
      followed_by
      ${GraphQLSchemaService._getUserPreviewFields()}
      
      ${isMyself ? GraphQLSchemaService._getAuthorRelatedMyselfData() : ''}
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
       entity_for_card
  
       organization_id
       
       entity_images
       entity_tags

       ${GraphQLSchemaService._getOrganizationPreviewQuery()}
       
       ${GraphQLSchemaService._getAuthorPreviewQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getUsersListFieldsQuery(isMyself = true) {
    return `
      data {
        ${GraphQLSchemaService._getAuthorPreviewFieldsWithMyselfData(isMyself)}
      }
      ${GraphQLSchemaService._getMetadataQuery()}
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
       entity_for_card
  
       organization_id
       ${GraphQLSchemaService._getOrganizationPreviewQuery()}

       ${GraphQLSchemaService._getPostInPostPreviewQuery()}
         
       ${GraphQLSchemaService._getCommentsQuery(isMyself)}
       
       ${isMyself ? GraphQLSchemaService._getPostMyselfDataQuery() : ''}
       
       ${GraphQLSchemaService._getAuthorPreviewQuery()}
     }
  
      ${GraphQLSchemaService._getMetadataQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getTagsListQuery() {
    return `
      data {
        ${GraphQLSchemaService._getOneTagFields()}
      }
      ${GraphQLSchemaService._getMetadataQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getOneTagFields() {
    return `
      id
      title
      current_rate
      current_posts_amount
      current_media_posts_amount
      current_direct_posts_amount
      entity_name
      
      created_at
      updated_at
      
      first_entity_id
    `;
  }

  /**
   * @returns {string}
   * @private
   */
  static _getOrganizationsListFieldsQuery() {
    return `
      data {
        ${this._getOrganizationPreviewFields()}
      }

      ${GraphQLSchemaService._getMetadataQuery()}
    `;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  static _getPostInPostPreviewQuery() {
    return `
       post {
         ${GraphQLSchemaService._getPostPreviewFieldsQuery()}
       }
    `;
  }

  /**
   *
   * @param {Object} obj_from_json
   * @returns {string}
   * @private
   */
  static _stringify(obj_from_json){
    if(typeof obj_from_json !== "object" || Array.isArray(obj_from_json)){
      // not an object, stringify using native function
      return JSON.stringify(obj_from_json);
    }
    // Implements recursive object serialization according to JSON spec
    // but without quotes around the keys.
    let props = Object
      .keys(obj_from_json)
      .map(key => `${key}:${GraphQLSchemaService._stringify(obj_from_json[key])}`)
      .join(",");
    return `{${props}}`;
  }

  /**
   *
   * @param extraFilters
   * @returns {{ordering: string, stringFilter: string}}
   * @private
   */
  static _getFilterAndOrderingForTrending(extraFilters = {}) {
    const ordering = '-importance_delta';

    const objectFilters = {
      overview_type: OVERVIEW_TYPE__TRENDING,
      ...extraFilters,
    };

    const stringFilter = GraphQLSchemaService._stringify(objectFilters);

    return { stringFilter, ordering }
  }

  /**
   *
   * @returns {{ordering: string, stringFilter: string}}
   * @private
   */
  static _getFilterAndOrderingForHot(extraFilters = {}) {
    const ordering = '-activity_index_delta';

    const objectFilters = {
      overview_type: OVERVIEW_TYPE__HOT,
      ...extraFilters,
    };

    const stringFilter = GraphQLSchemaService._stringify(objectFilters);

    return { stringFilter, ordering }
  }
}

module.exports = GraphQLSchemaService;
