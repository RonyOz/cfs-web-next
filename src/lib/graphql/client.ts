import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { TOKEN_KEY } from '@/config/constants';
import { GraphQLError } from 'graphql';

// Default GraphQL endpoint (Render deployment)
const FALLBACK_GRAPHQL_URL = 'https://cfs-api.onrender.com/graphql';

// GraphQL endpoint - prefer explicit env, then derive from REST API URL, finally fallback remote
const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '/graphql')
    : undefined) ||
  FALLBACK_GRAPHQL_URL;

// HTTP Link
const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
});

// Auth Link - Adds JWT token to every request
const authLink = setContext((_, { headers }) => {
    // Get token from localStorage (client-side only)
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Error Link - Handle GraphQL and network errors
const errorLink = onError((errorResponse: any) => {
    const { graphQLErrors, networkError } = errorResponse;

    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, extensions }: any) => {
            const code = extensions?.code;

            console.error(`[GraphQL error]: Message: ${message}, Code: ${code}`);

            // Handle specific error codes
            switch (code) {
                case 'UNAUTHENTICATED':
                    // Clear token and redirect to login
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem(TOKEN_KEY);
                        if (!window.location.pathname.includes('/login')) {
                            window.location.href = '/login?error=session_expired';
                        }
                    }
                    break;

                case 'FORBIDDEN':
                    console.error('Forbidden - insufficient permissions');
                    if (typeof window !== 'undefined') {
                        alert('No tienes permisos para realizar esta acción');
                    }
                    break;

                case 'NOT_FOUND':
                    console.error('Resource not found');
                    break;

                case 'BAD_REQUEST':
                    console.error('Validation error:', message);
                    break;

                default:
                    console.error('GraphQL Error:', message);
            }
        });
    }

    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
        if (typeof window !== 'undefined') {
            alert('Error de conexión. Por favor, intenta más tarde.');
        }
    }
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    products: {
                        keyArgs: false,
                        merge(existing = [], incoming) {
                            return incoming;
                        },
                    },
                    users: {
                        keyArgs: false,
                        merge(existing = [], incoming) {
                            return incoming;
                        },
                    },
                },
            },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

export default apolloClient;
