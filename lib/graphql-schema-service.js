const CommonQueries           = require('./queries/common-queries');
const UsersQueries            = require('./queries/users-queries');
const OrgsQueries             = require('./queries/organizations-queries');
const PostsQueries            = require('./queries/posts-queries');
const TagsQueries             = require('./queries/tags-queries');
const BlockchainNodesQueries  = require('./queries/blockchain-nodes-queries');

const Helpers = require('./helpers');

const OVERVIEW_TYPE__TRENDING = 'trending';
const OVERVIEW_TYPE__HOT      = 'hot';
const OVERVIEW_TYPE__FRESH    = 'fresh';
const OVERVIEW_TYPE__TOP      = 'top';

const ENTITY_TYPE__POSTS      = 'posts     ';
const ENTITY_TYPE__TAGS      = 'tags      ';
const ENTITY_TYPE__ORGS      = 'org       ';

const ORDER_BY_CURRENT_RATE_DESC = '-current_rate';
const ORDER_BY_IMPORTANCE_DELTA_DESC = '-importance_delta';
const USERS_ORDERING_FOR_OVERVIEW = ORDER_BY_CURRENT_RATE_DESC;

class GraphQLSchemaService {

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postId
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   */
  static getOnePostOffer(postId, commentsPage = 1, commentsPerPage = 10) {
    return `
      query {
        ${this._getOnePostOfferQuery(postId, commentsPage, commentsPerPage)}
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param airdropFilter
   * example
   * const filter = {
   *   airdrop_id: 1,
   * };
   * @param {number} postId
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   */
  static getOnePostOfferWithUserAirdrop(airdropFilter, postId, commentsPage = 1, commentsPerPage = 10) {
    return `
      query {
        ${this._getOnePostOfferQuery(postId, commentsPage, commentsPerPage)}
        ${this._getOneUserAirdropQuery(airdropFilter)}
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @param filter
   * example
   * const filter = {
   *   airdrop_id: 1,
   * };
   *
   * @returns {string}
   */
  static getOneUserAirdrop(filter) {
    return `
      query {
        ${this._getOneUserAirdropQuery(filter)}
      }
    `;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {string} ordering
   * @param {number} page
   * @param {number} perPage
   */
  static getManyBlockchainNodes(ordering, page, perPage) {
    return BlockchainNodesQueries.getManyBlockchainNodesQuery(ordering, page, perPage);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postTypeId
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getManyOrganizationsForTrendingPostsQuery(postTypeId, page, perPage) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__POSTS,
      post_type_id:   postTypeId,
    };

    return OrgsQueries.getManyOrganizationsQuery(filter, ORDER_BY_IMPORTANCE_DELTA_DESC, page, perPage);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postTypeId
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getManyOrganizationsForHotPostsQuery(postTypeId, page, perPage) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__POSTS,
      post_type_id:   postTypeId,
    };

    return OrgsQueries.getManyOrganizationsQuery(filter, ORDER_BY_CURRENT_RATE_DESC, page, perPage);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postTypeId
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getManyOrganizationsForFreshPostsQuery(postTypeId, page, perPage) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__FRESH,
      entity_name:    ENTITY_TYPE__POSTS,
      post_type_id:   postTypeId,
    };

    return OrgsQueries.getManyOrganizationsQuery(filter, ORDER_BY_CURRENT_RATE_DESC, page, perPage);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postTypeId
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   */
  static getManyOrganizationsForTopPostsQuery(postTypeId, page, perPage) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__TOP,
      entity_name:    ENTITY_TYPE__POSTS,
      post_type_id:   postTypeId,
    };

    return OrgsQueries.getManyOrganizationsQuery(filter, ORDER_BY_CURRENT_RATE_DESC, page, perPage);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTagsForTrendingPostsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__POSTS,
    };

    return TagsQueries.getManyTagsQuery(filter, ORDER_BY_CURRENT_RATE_DESC, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTagsForHotPostsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__POSTS,
    };

    return TagsQueries.getManyTagsQuery(filter, ORDER_BY_CURRENT_RATE_DESC, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTagsForFreshPostsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__FRESH,
      entity_name:    ENTITY_TYPE__POSTS,
    };

    return TagsQueries.getManyTagsQuery(filter, ORDER_BY_CURRENT_RATE_DESC, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyTagsForTopPostsQuery(page, perPage, isMyself = true) {
    const filter = {
      overview_type:  OVERVIEW_TYPE__TOP,
      entity_name:    ENTITY_TYPE__POSTS,
    };

    return TagsQueries.getManyTagsQuery(filter, ORDER_BY_CURRENT_RATE_DESC, page, perPage, isMyself);
  }

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
    const stringFilter = Helpers.stringify(postFiltering);

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
    const { filter, ordering } = Helpers.getFilterAndOrderingForTrending({
      post_type_id: postTypeId,
    });

    const usersFilter = {
      entity_name:    ENTITY_TYPE__POSTS,
      overview_type:  OVERVIEW_TYPE__TRENDING,
      post_type_id:   postTypeId,
    };

    return this._getManyPostsQuery(filter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself);
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
    const { filter, ordering } = Helpers.getFilterAndOrderingForHot({
      post_type_id: postTypeId,
    });

    const usersFilter = {
      entity_name:    ENTITY_TYPE__POSTS,
      overview_type:  OVERVIEW_TYPE__HOT,
      post_type_id:   postTypeId
    };

    return this._getManyPostsQuery(filter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself);
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
      post_type_id:   postTypeId
    };

    return this._getManyPostsQuery(filter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself);
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
      post_type_id:   postTypeId
    };

    return this._getManyPostsQuery(filter, ordering, usersFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself);
  }

  /**
   *
   * @param filter
   * @returns {string}
   * @private
   */
  static _getOneUserAirdropQuery(filter) {
    const stringFilter = Helpers.stringify(filter);

    return `
      one_user_airdrop(filters: ${stringFilter})
    `;
  }

  /**
   *
   * @param {number} postId
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   * @private
   */
  static _getOnePostOfferQuery(postId, commentsPage = 1, commentsPerPage = 10) {
    return `
      one_post_offer(id: ${postId}, comments_query: {page: ${commentsPage}, per_page: ${commentsPerPage}}) {
         ${UsersQueries.getAuthorPreviewQueryWithMyselfData()}
         
         ${GraphQLSchemaService._getAllSinglePostFields()}     
         ${PostsQueries.getOnePostOfferFields()}
         
         
         ${GraphQLSchemaService._getCommentsQuery(true)}
         ${PostsQueries.getPostMyselfDataQuery()}     
      }
    `
  }

  /**
   * @param {Object} filter
   * @param {string} ordering
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @param {Object} togetherWith
   * @returns {string}
   */
  static _getManyOrganizationsPageQuery(
    filter,
    ordering,
    page = 1,
    perPage = 10,
    isMyself = true,
    togetherWith = {}
  ) {

    return `
      query {
        ${OrgsQueries.getManyOrganizationsQueryFields(filter, ordering, page, perPage)}
      }
    `;
  }

  /**
   * @param {Object} filter
   * @param {string} ordering
   * @param {Object} relatedFilter
   * @param {number} postPage
   * @param {number} postPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static _getManyPostsQuery(filter, ordering, relatedFilter, postPage, postPerPage, commentsPage, commentsPerPage, isMyself = true) {
    const commentsQuery = this._getCommentsInputQuery(commentsPage, commentsPerPage);

    const relatedEntityPage     = 1;
    const relatedEntityPerPage  = 10;

    const relatedEntityOrder = ORDER_BY_IMPORTANCE_DELTA_DESC;

    return `
      query {
        ${GraphQLSchemaService._getManyPostsQueryFields(filter, ordering, postPage, postPerPage, commentsQuery, isMyself)}
        ${UsersQueries.getManyUsersQueryFields(relatedFilter, relatedEntityOrder, relatedEntityPage, relatedEntityPerPage, isMyself)}
        ${OrgsQueries.getManyOrganizationsQueryFields(relatedFilter, relatedEntityOrder, relatedEntityPage, relatedEntityPerPage)}
        ${TagsQueries.getManyTagsQueryFields(relatedFilter, relatedEntityOrder, relatedEntityPage, relatedEntityPerPage, isMyself)}
      }
    `
  }

  /**
   *
   * @param {Object} filter
   * @param {string} ordering
   * @param {number} postPage
   * @param {number} postPerPage
   * @param {string} commentsQuery
   * @param {boolean} isMyself
   * @returns {string}
   * @private
   */
  static _getManyPostsQueryFields(filter, ordering, postPage, postPerPage, commentsQuery, isMyself = true) {
    const stringFilter = Helpers.stringify(filter);

    return `
      many_posts(filters: ${stringFilter}, order_by: "${ordering}", page: ${postPage}, per_page: ${postPerPage}, comments_query: ${commentsQuery}) {
        ${GraphQLSchemaService._getPostsListFieldsQuery(isMyself)}
      }
    `;
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
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

    return UsersQueries.getManyUsersQuery(filter, USERS_ORDERING_FOR_OVERVIEW, page, perPage, isMyself);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {string} ordering
   * @param {number} page
   * @param {number} perPage
   * @returns {string}
   * @deprecated
   */
  static getOrganizationsQuery(ordering, page, perPage) {
    return `
      query {
        organizations(order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${OrgsQueries.getOrganizationsListFieldsQuery()}
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
    const {filter, ordering} = Helpers.getFilterAndOrderingForTrending();

    const stringFilter = Helpers.stringify(filter);

    return `
      query {
        organizations(filters: ${stringFilter}, order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService.getOrganizationsListFieldsQuery()}
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
  static getHotOrganizationsQuery(page, perPage) {
    const { filter, ordering } = Helpers.getFilterAndOrderingForHot();

    const stringFilter = Helpers.stringify(filter);

    return `
      query {
        organizations(filters: ${stringFilter}, order_by: "${ordering}", page: ${page}, per_page: ${perPage}) {
          ${GraphQLSchemaService.getOrganizationsListFieldsQuery()}
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
          ${TagsQueries.getTagsListQuery()}
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
    const {filter, ordering} = Helpers.getFilterAndOrderingForTrending();

    const usersFilter = {
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__TAGS,
    };

    return this._getManyTagsQuery(filter, ordering, usersFilter, page, perPage, isMyself);
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
    const { filter, ordering } = Helpers.getFilterAndOrderingForHot();

    const usersFilter = {
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__TAGS,
    };

    return this._getManyTagsQuery(filter, ordering, usersFilter, page, perPage, isMyself);
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

    const filter = {};

    return this._getManyTagsQuery(filter, ordering, usersFilter, page, perPage, isMyself);
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

    const filter = {};

    return this._getManyTagsQuery(filter, ordering, usersFilter, page, perPage, isMyself);
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
    const { filter, ordering } = Helpers.getFilterAndOrderingForTrending();

    const usersFilter = {
      overview_type:  OVERVIEW_TYPE__TRENDING,
      entity_name:    ENTITY_TYPE__ORGS,
    };

    const togetherWith = {
      users: {
        filter: usersFilter,
      },
    };

    return this._getManyOrganizationsPageQuery(filter, ordering, page, perPage, isMyself, togetherWith);
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
    const { filter, ordering } = Helpers.getFilterAndOrderingForHot();

    const usersFilter = {
      overview_type:  OVERVIEW_TYPE__HOT,
      entity_name:    ENTITY_TYPE__ORGS,
    };

    const togetherWith = {
      users: {
        filter: usersFilter,
      },
    };

    return this._getManyOrganizationsPageQuery(filter, ordering, page, perPage, isMyself, togetherWith);
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

    const filter = {};

    const togetherWith = {
      users: {
        filter: usersFilter,
      },
    };

    return this._getManyOrganizationsPageQuery(filter, ordering, page, perPage, isMyself, togetherWith);
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

    const filter = {};

    const togetherWith = {
      users: {
        filter: usersFilter,
      },
    };

    return this._getManyOrganizationsPageQuery(filter, ordering, page, perPage, isMyself, togetherWith);
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
           ${UsersQueries.getAuthorPreviewQueryWithMyselfData()}
           
           ${GraphQLSchemaService._getAllSinglePostFields()}     
           ${GraphQLSchemaService._getCommentsQuery(true)}
           ${PostsQueries.getPostMyselfDataQuery()}     
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
           ${UsersQueries.getAuthorPreviewQuery()}
           
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
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @returns {string}
   * @private
   */
  static _getCommentsInputQuery(commentsPage, commentsPerPage) {
    return `{page: ${commentsPage}, per_page: ${commentsPerPage}}`;
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

        ${UsersQueries.getAuthorPreviewQuery()}

        blockchain_id
        commentable_id
        created_at
        activity_user_comment
        ${OrgsQueries.getOrganizationPreviewQuery()}

        depth
        ${myselfData ? GraphQLSchemaService._getCommentMyselfData() : ''}
        organization_id
        parent_id
        path
        updated_at
        user_id
      }
      ${CommonQueries.getMetadataQuery()}
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
       
       ${GraphQLSchemaService._getPostInPostPreviewQuery()}
       ${OrgsQueries.getOrganizationPreviewQuery()}
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

       ${OrgsQueries.getOrganizationPreviewQuery()}
       
       ${UsersQueries.getAuthorPreviewQuery()}
    `;
  }

  /**
   *
   * @returns {string}
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
       ${OrgsQueries.getOrganizationPreviewQuery()}

       ${GraphQLSchemaService._getPostInPostPreviewQuery()}
         
       ${GraphQLSchemaService._getCommentsQuery(isMyself)}
       
       ${isMyself ? PostsQueries.getPostMyselfDataQuery() : ''}
       
       ${UsersQueries.getAuthorPreviewQuery()}
     }
  
      ${CommonQueries.getMetadataQuery()}
    `;
  }

  /**
   * @param {Object} filter
   * @param {string} ordering
   * @param {Object} usersFilter
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static _getManyTagsQuery(filter, ordering, usersFilter, page, perPage, isMyself = true) {
    return `
      query {
        ${TagsQueries.getManyTagsQueryFields(filter, ordering, page, perPage, isMyself)}
      }
    `;
  }
}

module.exports = GraphQLSchemaService;
