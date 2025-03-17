import { gql } from "@apollo/client";

export const UPDATE_BOOK = gql`
    mutation UpdateBook(
        $id: ID!
        $input: BookUpdateInput!
        $metadata: BookMetadataInput
    ) {
        updateBook(id: $id, input: $input, metadata: $metadata) {
            id
            title
            description
            published_date
            author_id
        }
    }
`;
