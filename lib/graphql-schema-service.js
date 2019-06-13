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
   * @deprecated
   * @see getOneUserQuery
   * @param {Object} filter = {
   *   user_id: number
   * }
   * @param {boolean} isMyself
   */
  static getOneUser(filter, isMyself = true) {
    const filterString = Helpers.stringify(filter);

    return `
      query {
        one_user(filters: ${filterString})
      }
    `;
  }

  /**
   * @deprecated
   * @see getOneUserQueryPart
   * @param {Object} params = {
   *   filters: {
   *     user_id: number
   *     user_identity: string, // please provide as string even if it is a number (ID)
   *   }
   * }
   * @returns {string}
   */
  static getOneUserQuery(params) {
    return `
      query {
        ${GraphQLSchemaService.getOneUserQueryPart(params)}
      }
    `
  }

  /**
   *
   * @param {Object} params = {
   *   filters: {
   *     user_id: number, // or provide user_identity
   *     user_identity: string, // please provide as string even if it is a number (ID)
   *   }
   * }
   * @returns {string}
   */
  static getOneUserQueryPart(params) {
    const filterString = Helpers.stringify(params.filters);

    return `
      one_user(filters: ${filterString})
    `;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {Object} params = {
   *   filters: {
   *     user_id: number
   *     user_identity: string, // please provide as string even if it is a number (ID)
   *   }
   *   order_by: string,
   *   page: string,
   *   per_page: string,
   * }
   * @returns {string}
   */
  static getOneUserTrustedByQueryPart(params) {
    const filterString = Helpers.stringify(params.filters);

    return `
      one_user_trusted_by(filters: ${filterString}, order_by: "${params.order_by}", page: ${params.page}, per_page: ${params.per_page}) {
        ${UsersQueries.getUsersListFieldsQuery()}
      }
    `;
  }



  /**
   *
   * @param {Object} params = {
   *   filters: {
   *     user_id: number
   *     user_identity: string, // please provide as string even if it is a number (ID)
   *   }
   *   order_by: string,
   *   page: string,
   *   per_page: string,
   * }
   * @returns {string}
   */
  static getOneUserReferralsQueryPart(params) {
    const filterString = Helpers.stringify(params.filters);

    return `
      one_user_referrals(filters: ${filterString}, order_by: "${params.order_by}", page: ${params.page}, per_page: ${params.per_page}) {
        ${UsersQueries.getUsersListFieldsQuery()}
      }
    `;
  }

  /**
   *
   * @param {Object} params = {
   *   filters: {
   *     user_id: number
   *     user_identity: string, // please provide as string even if it is a number (ID)
   *   }
   *   order_by: string,
   *   page: string,
   *   per_page: string,
   * }
   * @returns {string}
   */
  static getOneUserFollowsOrganizationsQueryPart(params) {
    const inputString = Helpers.getParamsInputString(params);

    return `
      one_user_follows_organizations(${inputString}) {
        ${OrgsQueries.getOrganizationsListFieldsQuery()}
      }
    `;
  }

  // noinspection JSUnusedGlobalSymbols
  static getQueryMadeFromParts(parts) {
    return `
      query {
        ${parts.join("\n")}
      }
    `;
  }


  // noinspection JSUnusedGlobalSymbols
  static getQueryMadeFromPartsWithAliases(aliasToPart) {
    const queryParts = [];

    for (const alias in aliasToPart) {
      if (!aliasToPart.hasOwnProperty(alias)) {
        continue;
      }

      Helpers.checkIsString(aliasToPart[alias], 'query_part');

      queryParts.push(`${alias}: ${aliasToPart[alias]}`);
    }

    return this.getQueryMadeFromParts(queryParts);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param filter:
   * airdrops: {
   *   id: 1, // airdrop_id
   * }
   * @param {string} orderBy
   * @param {number} page
   * @param {number} perPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getManyUsers(filter, orderBy, page, perPage, isMyself = true) {
    const filterString = Helpers.stringify(filter);

    const airdropExtraFields = ['score', 'external_login'];

    return `
      query {      
        many_users(filters: ${filterString}, order_by: "${orderBy}", page: ${page}, per_page: ${perPage}) {
          ${UsersQueries.getUsersListFieldsQuery(isMyself, airdropExtraFields)}
        }
      }
    `;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {number} postId
   * @param {Object} usersTeamQuery
   * @param {Object} commentsQuery: {
   *   page: number,
   *   per_page: number,
   * }
   * @param {Object} usersTeamQuery: {
   *   page: number,
   *   per_page: number,
   *   order_by: string
   *   filters: {
   *     airdrops: {
   *       id: 1,
   *     }
   *   }
   * @returns {string}
   */
  static getOnePostOffer(postId, commentsQuery, usersTeamQuery) {
    return `
      query {
        ${this._getOnePostOfferQuery(postId, commentsQuery, usersTeamQuery)}
      }
    `
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   *
   * @param {Object} airdropFilter: {
   *   airdrop_id: 1,
   * }
   * @param {number} postId
   * @param {Object} commentsQuery: {
   *   page: number,
   *   per_page: number,
   * }
   * @param {Object} usersTeamQuery: {
   *   page: number,
   *   per_page: number,
   *   order_by: string
   *   filters: {
   *     airdrops: {
   *       id: 1,
   *     }
   *   }
   * }
   * @returns {string}
   */
  static getOnePostOfferWithUserAirdrop(airdropFilter, postId, commentsQuery, usersTeamQuery) {
    return `
      query {
        ${this._getOnePostOfferQuery(postId, commentsQuery, usersTeamQuery)}
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
   * @param filters
   * @deprecated
   * @see getManyBlockchainNodesQueryPart
   */
  static getManyBlockchainNodes(ordering, page, perPage, filters = {}) {
    console.warn('Method is deprecated. See getManyBlockchainNodesQueryPart and use getQueryMadeFromParts');

    const params = {
      page,
      filters,
      order_by: ordering,
      per_page: perPage,
    };

    const parts = [
      GraphQLSchemaService.getManyBlockchainNodesQueryPart(params),
    ];

    return GraphQLSchemaService.getQueryMadeFromParts(parts);
  }

  /**
   *
   * @param params = {
   *   filters: {
   *      myself_votes_only: boolean,
   *      blockchain_nodes_type: number,
   *      user_id: number, // used for myself_votes_only = true request
   *      title_like: string,
   *   }
   *   order_by: string,
   *   page: number,
   *   per_page: number
   * }
   * @returns {string}
   */
  static getManyBlockchainNodesQueryPart(params) {
    return BlockchainNodesQueries.getManyBlockchainNodesQueryPart(params);
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
   * @deprecated
   * @see getUserWallFeedQueryPart
   * @param {number} userId
   * @param {number} feedPage
   * @param {number} feedPerPage
   * @param {number} commentsPage
   * @param {number} commentsPerPage
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getUserWallFeedQuery(userId, feedPage, feedPerPage, commentsPage, commentsPerPage, isMyself = true) {
    const params = {
      filters: {
        user_id: userId,
      },
      page: feedPage,
      per_page: feedPerPage,
      comments: {
        page: commentsPage,
        per_page: commentsPerPage,
      },
    };

    return `
      query {
        ${GraphQLSchemaService.getUserWallFeedQueryPart(params, isMyself)}
      }
    `
  }

  /**
   *
   * @param {Object} params = {
   *   filters: {
   *     user_id: number, // or provide user_identity
   *     user_identity: string, // please provide as string even if it is a number
   *   },
   *   page: number,
   *   per_page: number,
   *   comments: {
   *     page: number,
   *     per_page: number,
   *   }
   * }
   * @param {boolean} isMyself
   * @returns {string}
   */
  static getUserWallFeedQueryPart(params, isMyself = true) {
    const filterString = Helpers.stringify(params.filters);

    return `
      user_wall_feed(filters: ${filterString}, page: ${params.page}, per_page: ${params.per_page}, comments_query: {page: ${params.comments.page}, per_page: ${params.comments.per_page}}) {
        ${GraphQLSchemaService._getPostsListFieldsQuery(isMyself)}
      }
    `;
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
   * @param {Object} commentsQuery
   * @param {Object} usersTeamQuery
   * @returns {string}
   * @private
   */
  static _getOnePostOfferQuery(postId, commentsQuery, usersTeamQuery) {
    const commentsQueryString = Helpers.stringify(commentsQuery);
    const usersTeamQueryString = Helpers.stringify(usersTeamQuery);

    return `
      one_post_offer(id: ${postId}, comments_query: ${commentsQueryString}, users_team_query: ${usersTeamQueryString}) {
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
   * @param {Object} params = {
   *   filters: {
   *     post_type_ids: number[]
   *     entity_names_from: string[]
   *     entity_names_for: string[]
   *   }
   *   order_by: string,
   *   page: number,
   *   per_page: number,
   * }
   * @param {Object} include {
   *     comments: {
   *       page: number,
   *       per_page: number,
   *     }
   * }
   *
   * @returns {string}
   */
  static getPostsFeedQueryPart(params, include) {
    let inputString = Helpers.getParamsInputString(params);
    const key = 'posts_feed';
    const fields = GraphQLSchemaService._getPostsListFieldsQuery(true);

    if (include && include.comments) {
      const commentsInputString = Helpers.getParamsInputString(include.comments);

      inputString += `, include: { comments: {${commentsInputString}}}`;
    }

    return Helpers.getQueryPart(key, inputString, fields);
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

  /**
   *
   * @param {Object} params = {
   *   filters: {
   *     overview_type: string, // only 'trending' is supported now
   *   }
   *   order_by:  string, // for trending consider to pass -scaled_social_rate_delta
   *   page:      number,
   *   per_page:  number,
   * }
   * @param isMyself {boolean}
   * @returns {string}
   */
  static getManyUsersQueryPart(params, isMyself = true) {
    const inputString = Helpers.getParamsInputString(params);
    const key = UsersQueries.getManyUsersKey();

    const extraFields = [
      'posts_total_amount_delta',
      'scaled_importance_delta',

      'staked_balance',
      'validity',
      'importance',
      'scaled_importance',

      'stake_rate',
      'scaled_stake_rate',

      'social_rate',
      'scaled_social_rate',

      'transfer_rate',
      'scaled_transfer_rate',

      'previous_cumulative_emission',
      'current_emission',
      'current_cumulative_emission',
    ];

    const fields = UsersQueries.getUsersListFieldsQuery(isMyself, extraFields);

    return Helpers.getQueryPart(key, inputString, fields);
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
        entity_images
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
