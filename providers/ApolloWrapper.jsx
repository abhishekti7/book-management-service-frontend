"use client";

const { client } = require("@/lib/apollo-client");
const { ApolloProvider } = require("@apollo/client");

const ApolloWrapper = ({ children }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
}

export default ApolloWrapper;