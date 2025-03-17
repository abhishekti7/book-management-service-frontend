import { gql } from "@apollo/client";

export const ADD_AUTHOR = gql`
    mutation AddAuthor($input: AuthorInput!, $metadata: AuthorMetadataInput) {
        createAuthor(input: $input, metadata: $metadata) {
            id
            name
            biography
            date_of_birth
        }
    }
`;
