import { gql } from "@apollo/client";

export const ADD_REVIEW = gql`
    mutation AddBookReview($input: ReviewInput!) {
        createBookReview(input: $input) {
            id
            book_id
            user_id
            rating
            comment
            created_at
        }
    }
`;
