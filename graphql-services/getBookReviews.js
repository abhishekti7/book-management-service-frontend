import { gql } from "@apollo/client";

export const GET_BOOK_REVIEWS = gql`
    query GetBookReviews($book_id: ID!) {
        bookReviews(book_id: $book_id) {
            id
            book_id
            user_id
            rating
            comment
            created_at
        }
    }
`;
