import { ApolloClient, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { InMemoryCache } from "@apollo/client-react-streaming";

import Cookies from "js-cookie";

const httpLink = createHttpLink({
    uri:
        `${process.env.NEXT_PUBLIC_API_URL}/graphql` ||
        "http://127.0.0.1:4000/api/v1/graphql",
    credentials: "include",
});

const authLink = setContext((operation, { headers }) => {
    const token = Cookies.get("token");

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
            "x-apollo-operation-name": operation.operationName || "anonymous",
        },
    };
});

export const client = new ApolloClient({
    cache: new InMemoryCache({
        addTypename: false,
        typePolicies: {
            Query: {
                fields: {
                    books: {
                        keyArgs: ["filter"],
                        merge(existing, incoming, { args: { offset = 0 } }) {
                            // Slicing is necessary because the existing data is
                            // immutable, and frozen in development.
                            let merged =
                                existing &&
                                existing.books &&
                                existing.books.length > 0
                                    ? existing.books.slice(0)
                                    : [];
                            if (
                                incoming &&
                                incoming.books &&
                                incoming.books.length > 0
                            ) {
                                merged = [...merged, ...incoming.books];
                            }

                            // remove duplicates
                            const idsArr = [];
                            merged = merged.filter((item) => {
                                if (idsArr.includes(item.id)) {
                                    return false;
                                } else {
                                    idsArr.push(item.id);
                                    return true;
                                }
                            });

                            return {
                                ...incoming,
                                books: merged,
                            };
                        },
                    },
                    authors: {
                        keyArgs: ["filter"],
                        merge(existing, incoming, { args: { offset = 0 } }) {
                            // Slicing is necessary because the existing data is
                            // immutable, and frozen in development.
                            let merged =
                                existing &&
                                existing.authors &&
                                existing.authors.length > 0
                                    ? existing.authors.slice(0)
                                    : [];
                            if (
                                incoming &&
                                incoming.authors &&
                                incoming.authors.length > 0
                            ) {
                                merged = [...merged, ...incoming.authors];
                            }

                            // remove duplicates
                            const idsArr = [];
                            merged = merged.filter((item) => {
                                if (idsArr.includes(item.id)) {
                                    return false;
                                } else {
                                    idsArr.push(item.id);
                                    return true;
                                }
                            });

                            return {
                                ...incoming,
                                authors: merged,
                            };
                        },
                    },
                },
            },
        },
    }),
    link: authLink.concat(httpLink),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
        },
    },
});
