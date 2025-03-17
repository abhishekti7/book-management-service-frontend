import { gql } from "@apollo/client";

export const DELETE_AUTHOR = gql`
    mutation DeleteAuthor($id: ID!) {
        deleteAuthor(id: $id)
    }
`;
