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
                            const merged = [];
                            const incomingMap = {};

                            if (
                                incoming &&
                                incoming.books &&
                                incoming.books.length > 0
                            ) {
                                incoming.books.map((item) => {
                                    incomingMap[item.id] = { ...item };
                                });
                            }

                            if (
                                existing &&
                                existing.books &&
                                existing.books.length > 0
                            ) {
                                existing.books.map((item) => {
                                    if (incomingMap[item.id]) {
                                        merged.push({
                                            ...incomingMap[item.id],
                                        });

                                        delete incomingMap[item.id];
                                    } else {
                                        merged.push(item);
                                    }
                                });
                            }

                            Object.keys(incomingMap).map((key) => {
                                merged.push(incomingMap[key]);
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
                            const merged = [];
                            const incomingMap = {};

                            if (
                                incoming &&
                                incoming.authors &&
                                incoming.authors.length > 0
                            ) {
                                incoming.authors.map((item) => {
                                    incomingMap[item.id] = { ...item };
                                });
                            }

                            if (
                                existing &&
                                existing.authors &&
                                existing.authors.length > 0
                            ) {
                                existing.authors.map((item) => {
                                    if (incomingMap[item.id]) {
                                        merged.push({
                                            ...incomingMap[item.id],
                                        });

                                        delete incomingMap[item.id];
                                    } else {
                                        merged.push(item);
                                    }
                                });
                            }

                            Object.keys(incomingMap).map((key) => {
                                merged.push(incomingMap[key]);
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
