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
    cache: new InMemoryCache({ addTypename: false }),
    link: authLink.concat(httpLink),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "cache-and-network",
        },
    },
});
