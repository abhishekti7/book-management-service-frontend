import { gql } from "@apollo/client";

export const ADD_BOOK = gql`
    mutation addBook($input: BookInput!, $metadata: BookMetadataInput) {
        createBook(input: $input, metadata: $metadata) {
            id
            title
            description
            published_date
            author_id
            author {
                id
                name
                biography
            }
            metadata {
                book_id
                genres
                tags
                average_rating
                page_count
                last_updated
            }
        }
    }
`;
