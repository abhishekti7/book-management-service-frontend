import { gql } from "@apollo/client";

export const GET_AUTHORS = gql`
    query GetAuthors(
        $page: Int
        $limit: Int
        $filter: AuthorFilterInput
        $sortBy: String
        $order: String
    ) {
        authors(
            page: $page
            limit: $limit
            filter: $filter
            sortBy: $sortBy
            order: $order
        ) {
            authors {
                id
                name
                biography
                date_of_birth
            }
            total
            page
            hasMore
        }
    }
`;
