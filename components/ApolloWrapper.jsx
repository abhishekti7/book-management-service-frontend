"use client";

import { ApolloNextAppProvider, InMemoryCache } from "@apollo/experimental-nextjs-app-support";
import { HttpLink, ApolloLink } from "@apollo/client";
import {
    NextSSRApolloClient,
    SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";

function makeClient() {
    const httpLink = new HttpLink({
        uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    });

    return new NextSSRApolloClient({
        cache: new InMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                    new SSRMultipartLink({ stripDefer: true }),
                    httpLink,
                ])
                : httpLink,
    });
}

export function ApolloWrapper({ children }) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}
