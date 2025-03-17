import { gql } from "@apollo/client";

export const GET_AUTHOR = gql`
    query GetAuthor($id: ID!) {
        author(id: $id) {
            id
            name
            biography
            date_of_birth
            metadata {
                social_media {
                    twitter
                    instagram
                    facebook
                    website
                }
                nationality
                languages
                last_updated
            }
        }
    }
`;
