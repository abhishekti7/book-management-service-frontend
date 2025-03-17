import { gql } from "@apollo/client";

export const UPDATE_AUTHOR = gql`
    mutation UpdateAuthor(
        $id: ID!
        $input: AuthorUpdateInput!
        $metadata: AuthorMetadataInput
    ) {
        updateAuthor(id: $id, input: $input, metadata: $metadata) {
            id
            name
            biography
            date_of_birth
        }
    }
`;
