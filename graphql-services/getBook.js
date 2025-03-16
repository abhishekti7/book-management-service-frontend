import { gql } from "@apollo/client";

export const GET_BOOK = gql`
    query GetBook($id: ID!) {
        book(id: $id) {
            id
            title
            description
            published_date
            author {
                id
                name
            }
            metadata {
                genres
                tags
                language
                average_rating
                ratings_count
                last_updated
            }
        }
    }
`;
