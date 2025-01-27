import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

// export type Maybe<T> = T | null;
// export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
// export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
// export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
            
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
};

export type AccessToken = {
  __typename?: 'AccessToken';
  access_token?: Maybe<Scalars['String']['output']>;
  expires_in?: Maybe<Scalars['String']['output']>;
  id_token?: Maybe<Scalars['String']['output']>;
};

export type Ingredient = {
  __typename?: 'Ingredient';
  amount: Scalars['String']['output'];
  dilution: Scalars['String']['output'];
  price: Scalars['String']['output'];
  title: Scalars['String']['output'];
  unit: Scalars['String']['output'];
  usedAmount?: Maybe<Scalars['Float']['output']>;
};

export type IngredientInput = {
  amount: Scalars['String']['input'];
  dilution: Scalars['String']['input'];
  price: Scalars['String']['input'];
  title: Scalars['String']['input'];
  unit: Scalars['String']['input'];
  usedAmount?: InputMaybe<Scalars['Float']['input']>;
};

export type IngredientList = {
  __typename?: 'IngredientList';
  author?: Maybe<Scalars['String']['output']>;
  desc?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  identityStars: Scalars['Int']['output'];
  items?: Maybe<Array<Maybe<Ingredient>>>;
  meta?: Maybe<IngredientMeta>;
  published: Scalars['Boolean']['output'];
  stars: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};


export type IngredientListIdentityStarsArgs = {
  identity?: InputMaybe<Scalars['String']['input']>;
};

export type IngredientListHandle = {
  __typename?: 'IngredientListHandle';
  id: Scalars['ID']['output'];
  token: Scalars['ID']['output'];
};

export type IngredientListInput = {
  desc?: InputMaybe<Scalars['String']['input']>;
  items?: InputMaybe<Array<InputMaybe<IngredientInput>>>;
  title: Scalars['String']['input'];
};

export type IngredientListMetaInput = {
  author?: InputMaybe<Scalars['String']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  identity: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type IngredientMeta = {
  __typename?: 'IngredientMeta';
  identity: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  approveList?: Maybe<Success>;
  identify?: Maybe<WebGptToken>;
  publishList?: Maybe<IngredientListHandle>;
  refreshToken?: Maybe<WebGptToken>;
  starList: Scalars['Int']['output'];
  swapToken?: Maybe<WebGptToken>;
};


export type MutationApproveListArgs = {
  listId: Scalars['String']['input'];
};


export type MutationIdentifyArgs = {
  provider?: InputMaybe<Providers>;
  providerToken: OAuthCode;
};


export type MutationPublishListArgs = {
  list?: InputMaybe<IngredientListInput>;
  meta?: InputMaybe<IngredientListMetaInput>;
};


export type MutationRefreshTokenArgs = {
  previousAccessToken?: InputMaybe<WebGptTokenInput>;
};


export type MutationStarListArgs = {
  identity: Scalars['String']['input'];
  listId: Scalars['String']['input'];
};


export type MutationSwapTokenArgs = {
  provider?: InputMaybe<Providers>;
  providerToken: OAuthCode;
  webGPTToken?: InputMaybe<WebGptTokenInput>;
};

export type OAuthCode = {
  code: Scalars['String']['input'];
};

export enum Providers {
  Google = 'GOOGLE',
  Reddit = 'REDDIT'
}

export type Query = {
  __typename?: 'Query';
  getStars: Scalars['Int']['output'];
  listFormulas?: Maybe<Array<Maybe<IngredientList>>>;
  retrieve?: Maybe<Scalars['String']['output']>;
  searchFormulas?: Maybe<SearchFormulaResult>;
};


export type QueryGetStarsArgs = {
  identity?: InputMaybe<Scalars['String']['input']>;
  listId: Scalars['String']['input'];
};


export type QueryRetrieveArgs = {
  token?: InputMaybe<WebGptTokenInput>;
};


export type QuerySearchFormulasArgs = {
  q?: InputMaybe<Scalars['String']['input']>;
};

export type SearchFormulaResult = {
  __typename?: 'SearchFormulaResult';
  items?: Maybe<Array<Maybe<IngredientList>>>;
  q: Scalars['String']['output'];
};

export type Success = {
  __typename?: 'Success';
  status: Scalars['String']['output'];
};

export type WebGptToken = {
  __typename?: 'WebGPTToken';
  GOOGLE?: Maybe<AccessToken>;
  REDDIT?: Maybe<AccessToken>;
  exp: Scalars['String']['output'];
  signed: Scalars['String']['output'];
};

export type WebGptTokenInput = {
  access_token: Scalars['String']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AccessToken: ResolverTypeWrapper<AccessToken>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Ingredient: ResolverTypeWrapper<Ingredient>;
  IngredientInput: IngredientInput;
  IngredientList: ResolverTypeWrapper<IngredientList>;
  IngredientListHandle: ResolverTypeWrapper<IngredientListHandle>;
  IngredientListInput: IngredientListInput;
  IngredientListMetaInput: IngredientListMetaInput;
  IngredientMeta: ResolverTypeWrapper<IngredientMeta>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  OAuthCode: OAuthCode;
  Providers: Providers;
  Query: ResolverTypeWrapper<{}>;
  SearchFormulaResult: ResolverTypeWrapper<SearchFormulaResult>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Success: ResolverTypeWrapper<Success>;
  WebGPTToken: ResolverTypeWrapper<WebGptToken>;
  WebGPTTokenInput: WebGptTokenInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccessToken: AccessToken;
  Boolean: Scalars['Boolean']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Ingredient: Ingredient;
  IngredientInput: IngredientInput;
  IngredientList: IngredientList;
  IngredientListHandle: IngredientListHandle;
  IngredientListInput: IngredientListInput;
  IngredientListMetaInput: IngredientListMetaInput;
  IngredientMeta: IngredientMeta;
  Int: Scalars['Int']['output'];
  JSON: Scalars['JSON']['output'];
  Mutation: {};
  OAuthCode: OAuthCode;
  Query: {};
  SearchFormulaResult: SearchFormulaResult;
  String: Scalars['String']['output'];
  Success: Success;
  WebGPTToken: WebGptToken;
  WebGPTTokenInput: WebGptTokenInput;
};

export type AccessTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccessToken'] = ResolversParentTypes['AccessToken']> = {
  access_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expires_in?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientResolvers<ContextType = any, ParentType extends ResolversParentTypes['Ingredient'] = ResolversParentTypes['Ingredient']> = {
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dilution?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usedAmount?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientListResolvers<ContextType = any, ParentType extends ResolversParentTypes['IngredientList'] = ResolversParentTypes['IngredientList']> = {
  author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  desc?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  identityStars?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<IngredientListIdentityStarsArgs>>;
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['Ingredient']>>>, ParentType, ContextType>;
  meta?: Resolver<Maybe<ResolversTypes['IngredientMeta']>, ParentType, ContextType>;
  published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  stars?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientListHandleResolvers<ContextType = any, ParentType extends ResolversParentTypes['IngredientListHandle'] = ResolversParentTypes['IngredientListHandle']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IngredientMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['IngredientMeta'] = ResolversParentTypes['IngredientMeta']> = {
  identity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  approveList?: Resolver<Maybe<ResolversTypes['Success']>, ParentType, ContextType, RequireFields<MutationApproveListArgs, 'listId'>>;
  identify?: Resolver<Maybe<ResolversTypes['WebGPTToken']>, ParentType, ContextType, RequireFields<MutationIdentifyArgs, 'providerToken'>>;
  publishList?: Resolver<Maybe<ResolversTypes['IngredientListHandle']>, ParentType, ContextType, Partial<MutationPublishListArgs>>;
  refreshToken?: Resolver<Maybe<ResolversTypes['WebGPTToken']>, ParentType, ContextType, Partial<MutationRefreshTokenArgs>>;
  starList?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationStarListArgs, 'identity' | 'listId'>>;
  swapToken?: Resolver<Maybe<ResolversTypes['WebGPTToken']>, ParentType, ContextType, RequireFields<MutationSwapTokenArgs, 'providerToken'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getStars?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<QueryGetStarsArgs, 'listId'>>;
  listFormulas?: Resolver<Maybe<Array<Maybe<ResolversTypes['IngredientList']>>>, ParentType, ContextType>;
  retrieve?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<QueryRetrieveArgs>>;
  searchFormulas?: Resolver<Maybe<ResolversTypes['SearchFormulaResult']>, ParentType, ContextType, Partial<QuerySearchFormulasArgs>>;
};

export type SearchFormulaResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchFormulaResult'] = ResolversParentTypes['SearchFormulaResult']> = {
  items?: Resolver<Maybe<Array<Maybe<ResolversTypes['IngredientList']>>>, ParentType, ContextType>;
  q?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['Success'] = ResolversParentTypes['Success']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WebGptTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['WebGPTToken'] = ResolversParentTypes['WebGPTToken']> = {
  GOOGLE?: Resolver<Maybe<ResolversTypes['AccessToken']>, ParentType, ContextType>;
  REDDIT?: Resolver<Maybe<ResolversTypes['AccessToken']>, ParentType, ContextType>;
  exp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signed?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AccessToken?: AccessTokenResolvers<ContextType>;
  Ingredient?: IngredientResolvers<ContextType>;
  IngredientList?: IngredientListResolvers<ContextType>;
  IngredientListHandle?: IngredientListHandleResolvers<ContextType>;
  IngredientMeta?: IngredientMetaResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchFormulaResult?: SearchFormulaResultResolvers<ContextType>;
  Success?: SuccessResolvers<ContextType>;
  WebGPTToken?: WebGptTokenResolvers<ContextType>;
};


export type ApproveListMutationVariables = Exact<{
  listId: Scalars['String']['input'];
}>;


export type ApproveListMutation = { __typename?: 'Mutation', approveList?: { __typename?: 'Success', status: string } | null };

export type GetStarsQueryVariables = Exact<{
  listId: Scalars['String']['input'];
  identity?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetStarsQuery = { __typename?: 'Query', getStars: number };

export type IdentifyMutationVariables = Exact<{
  provider: Providers;
  providerToken: OAuthCode;
}>;


export type IdentifyMutation = { __typename?: 'Mutation', identify?: { __typename?: 'WebGPTToken', exp: string, signed: string, GOOGLE?: { __typename?: 'AccessToken', id_token?: string | null } | null } | null };

export type ListFormulasQueryVariables = Exact<{
  identity?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListFormulasQuery = { __typename?: 'Query', listFormulas?: Array<{ __typename?: 'IngredientList', title: string, desc?: string | null, author?: string | null, stars: number, published: boolean, identityStars: number, remoteId: string, items?: Array<{ __typename?: 'Ingredient', title: string, amount: string, usedAmount?: number | null, dilution: string, unit: string, price: string } | null> | null } | null> | null };

export type PublishListMutationVariables = Exact<{
  list?: InputMaybe<IngredientListInput>;
  meta?: InputMaybe<IngredientListMetaInput>;
}>;


export type PublishListMutation = { __typename?: 'Mutation', publishList?: { __typename?: 'IngredientListHandle', token: string, remoteId: string } | null };

export type SearchFormulasQueryVariables = Exact<{
  q: Scalars['String']['input'];
}>;


export type SearchFormulasQuery = { __typename?: 'Query', searchFormulas?: { __typename?: 'SearchFormulaResult', q: string, items?: Array<{ __typename?: 'IngredientList', title: string, author?: string | null, published: boolean, remoteId: string, items?: Array<{ __typename?: 'Ingredient', title: string, amount: string, usedAmount?: number | null, dilution: string, unit: string, price: string } | null> | null } | null> | null } | null };

export type StarListMutationVariables = Exact<{
  listId: Scalars['String']['input'];
  identity: Scalars['String']['input'];
}>;


export type StarListMutation = { __typename?: 'Mutation', starList: number };

export type SwapTokenMutationVariables = Exact<{
  provider: Providers;
  providerToken: OAuthCode;
}>;


export type SwapTokenMutation = { __typename?: 'Mutation', swapToken?: { __typename?: 'WebGPTToken', signed: string } | null };


export const ApproveListDocument = gql`
    mutation approveList($listId: String!) {
  approveList(listId: $listId) {
    status
  }
}
    `;
export type ApproveListMutationFn = Apollo.MutationFunction<ApproveListMutation, ApproveListMutationVariables>;

/**
 * __useApproveListMutation__
 *
 * To run a mutation, you first call `useApproveListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveListMutation, { data, loading, error }] = useApproveListMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *   },
 * });
 */
export function useApproveListMutation(baseOptions?: Apollo.MutationHookOptions<ApproveListMutation, ApproveListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveListMutation, ApproveListMutationVariables>(ApproveListDocument, options);
      }
export type ApproveListMutationHookResult = ReturnType<typeof useApproveListMutation>;
export type ApproveListMutationResult = Apollo.MutationResult<ApproveListMutation>;
export type ApproveListMutationOptions = Apollo.BaseMutationOptions<ApproveListMutation, ApproveListMutationVariables>;
export const GetStarsDocument = gql`
    query GetStars($listId: String!, $identity: String) {
  getStars(listId: $listId, identity: $identity)
}
    `;

/**
 * __useGetStarsQuery__
 *
 * To run a query within a React component, call `useGetStarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStarsQuery({
 *   variables: {
 *      listId: // value for 'listId'
 *      identity: // value for 'identity'
 *   },
 * });
 */
export function useGetStarsQuery(baseOptions: Apollo.QueryHookOptions<GetStarsQuery, GetStarsQueryVariables> & ({ variables: GetStarsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStarsQuery, GetStarsQueryVariables>(GetStarsDocument, options);
      }
export function useGetStarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStarsQuery, GetStarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStarsQuery, GetStarsQueryVariables>(GetStarsDocument, options);
        }
export function useGetStarsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetStarsQuery, GetStarsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetStarsQuery, GetStarsQueryVariables>(GetStarsDocument, options);
        }
export type GetStarsQueryHookResult = ReturnType<typeof useGetStarsQuery>;
export type GetStarsLazyQueryHookResult = ReturnType<typeof useGetStarsLazyQuery>;
export type GetStarsSuspenseQueryHookResult = ReturnType<typeof useGetStarsSuspenseQuery>;
export type GetStarsQueryResult = Apollo.QueryResult<GetStarsQuery, GetStarsQueryVariables>;
export const IdentifyDocument = gql`
    mutation Identify($provider: Providers!, $providerToken: OAuthCode!) {
  identify(provider: $provider, providerToken: $providerToken) {
    exp
    signed
    GOOGLE {
      id_token
    }
  }
}
    `;
export type IdentifyMutationFn = Apollo.MutationFunction<IdentifyMutation, IdentifyMutationVariables>;

/**
 * __useIdentifyMutation__
 *
 * To run a mutation, you first call `useIdentifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIdentifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [identifyMutation, { data, loading, error }] = useIdentifyMutation({
 *   variables: {
 *      provider: // value for 'provider'
 *      providerToken: // value for 'providerToken'
 *   },
 * });
 */
export function useIdentifyMutation(baseOptions?: Apollo.MutationHookOptions<IdentifyMutation, IdentifyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<IdentifyMutation, IdentifyMutationVariables>(IdentifyDocument, options);
      }
export type IdentifyMutationHookResult = ReturnType<typeof useIdentifyMutation>;
export type IdentifyMutationResult = Apollo.MutationResult<IdentifyMutation>;
export type IdentifyMutationOptions = Apollo.BaseMutationOptions<IdentifyMutation, IdentifyMutationVariables>;
export const ListFormulasDocument = gql`
    query ListFormulas($identity: String) {
  listFormulas {
    remoteId: id
    title
    desc
    author
    stars
    published
    identityStars(identity: $identity)
    items {
      title
      amount
      usedAmount
      dilution
      unit
      price
    }
  }
}
    `;

/**
 * __useListFormulasQuery__
 *
 * To run a query within a React component, call `useListFormulasQuery` and pass it any options that fit your needs.
 * When your component renders, `useListFormulasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListFormulasQuery({
 *   variables: {
 *      identity: // value for 'identity'
 *   },
 * });
 */
export function useListFormulasQuery(baseOptions?: Apollo.QueryHookOptions<ListFormulasQuery, ListFormulasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListFormulasQuery, ListFormulasQueryVariables>(ListFormulasDocument, options);
      }
export function useListFormulasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListFormulasQuery, ListFormulasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListFormulasQuery, ListFormulasQueryVariables>(ListFormulasDocument, options);
        }
export function useListFormulasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListFormulasQuery, ListFormulasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListFormulasQuery, ListFormulasQueryVariables>(ListFormulasDocument, options);
        }
export type ListFormulasQueryHookResult = ReturnType<typeof useListFormulasQuery>;
export type ListFormulasLazyQueryHookResult = ReturnType<typeof useListFormulasLazyQuery>;
export type ListFormulasSuspenseQueryHookResult = ReturnType<typeof useListFormulasSuspenseQuery>;
export type ListFormulasQueryResult = Apollo.QueryResult<ListFormulasQuery, ListFormulasQueryVariables>;
export const PublishListDocument = gql`
    mutation PublishList($list: IngredientListInput, $meta: IngredientListMetaInput) {
  publishList(list: $list, meta: $meta) {
    remoteId: id
    token
  }
}
    `;
export type PublishListMutationFn = Apollo.MutationFunction<PublishListMutation, PublishListMutationVariables>;

/**
 * __usePublishListMutation__
 *
 * To run a mutation, you first call `usePublishListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePublishListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [publishListMutation, { data, loading, error }] = usePublishListMutation({
 *   variables: {
 *      list: // value for 'list'
 *      meta: // value for 'meta'
 *   },
 * });
 */
export function usePublishListMutation(baseOptions?: Apollo.MutationHookOptions<PublishListMutation, PublishListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PublishListMutation, PublishListMutationVariables>(PublishListDocument, options);
      }
export type PublishListMutationHookResult = ReturnType<typeof usePublishListMutation>;
export type PublishListMutationResult = Apollo.MutationResult<PublishListMutation>;
export type PublishListMutationOptions = Apollo.BaseMutationOptions<PublishListMutation, PublishListMutationVariables>;
export const SearchFormulasDocument = gql`
    query SearchFormulas($q: String!) {
  searchFormulas(q: $q) {
    q
    items {
      remoteId: id
      title
      author
      published
      items {
        title
        amount
        usedAmount
        dilution
        unit
        price
      }
    }
  }
}
    `;

/**
 * __useSearchFormulasQuery__
 *
 * To run a query within a React component, call `useSearchFormulasQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchFormulasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchFormulasQuery({
 *   variables: {
 *      q: // value for 'q'
 *   },
 * });
 */
export function useSearchFormulasQuery(baseOptions: Apollo.QueryHookOptions<SearchFormulasQuery, SearchFormulasQueryVariables> & ({ variables: SearchFormulasQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchFormulasQuery, SearchFormulasQueryVariables>(SearchFormulasDocument, options);
      }
export function useSearchFormulasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchFormulasQuery, SearchFormulasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchFormulasQuery, SearchFormulasQueryVariables>(SearchFormulasDocument, options);
        }
export function useSearchFormulasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchFormulasQuery, SearchFormulasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchFormulasQuery, SearchFormulasQueryVariables>(SearchFormulasDocument, options);
        }
export type SearchFormulasQueryHookResult = ReturnType<typeof useSearchFormulasQuery>;
export type SearchFormulasLazyQueryHookResult = ReturnType<typeof useSearchFormulasLazyQuery>;
export type SearchFormulasSuspenseQueryHookResult = ReturnType<typeof useSearchFormulasSuspenseQuery>;
export type SearchFormulasQueryResult = Apollo.QueryResult<SearchFormulasQuery, SearchFormulasQueryVariables>;
export const StarListDocument = gql`
    mutation StarList($listId: String!, $identity: String!) {
  starList(listId: $listId, identity: $identity)
}
    `;
export type StarListMutationFn = Apollo.MutationFunction<StarListMutation, StarListMutationVariables>;

/**
 * __useStarListMutation__
 *
 * To run a mutation, you first call `useStarListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStarListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [starListMutation, { data, loading, error }] = useStarListMutation({
 *   variables: {
 *      listId: // value for 'listId'
 *      identity: // value for 'identity'
 *   },
 * });
 */
export function useStarListMutation(baseOptions?: Apollo.MutationHookOptions<StarListMutation, StarListMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StarListMutation, StarListMutationVariables>(StarListDocument, options);
      }
export type StarListMutationHookResult = ReturnType<typeof useStarListMutation>;
export type StarListMutationResult = Apollo.MutationResult<StarListMutation>;
export type StarListMutationOptions = Apollo.BaseMutationOptions<StarListMutation, StarListMutationVariables>;
export const SwapTokenDocument = gql`
    mutation swapToken($provider: Providers!, $providerToken: OAuthCode!) {
  swapToken(provider: $provider, providerToken: $providerToken) {
    signed
  }
}
    `;
export type SwapTokenMutationFn = Apollo.MutationFunction<SwapTokenMutation, SwapTokenMutationVariables>;

/**
 * __useSwapTokenMutation__
 *
 * To run a mutation, you first call `useSwapTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSwapTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [swapTokenMutation, { data, loading, error }] = useSwapTokenMutation({
 *   variables: {
 *      provider: // value for 'provider'
 *      providerToken: // value for 'providerToken'
 *   },
 * });
 */
export function useSwapTokenMutation(baseOptions?: Apollo.MutationHookOptions<SwapTokenMutation, SwapTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SwapTokenMutation, SwapTokenMutationVariables>(SwapTokenDocument, options);
      }
export type SwapTokenMutationHookResult = ReturnType<typeof useSwapTokenMutation>;
export type SwapTokenMutationResult = Apollo.MutationResult<SwapTokenMutation>;
export type SwapTokenMutationOptions = Apollo.BaseMutationOptions<SwapTokenMutation, SwapTokenMutationVariables>;