import { ApolloClient, HttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client-react-streaming";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache({ addTypename: false }),
        link: new HttpLink({
            uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        }),
    });
});
