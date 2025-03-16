import { gql } from "@apollo/client";

export const GET_BOOKS = gql`
    query GetBooks(
        $page: Int
        $limit: Int
        $filter: BookFilterInput
        $sortBy: String
        $order: String
    ) {
        books(
            page: $page
            limit: $limit
            filter: $filter
            sortBy: $sortBy
            order: $order
        ) {
            books {
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
                    language
                    average_rating
                }
            }
            total
            page
            hasMore
        }
    }
`;
