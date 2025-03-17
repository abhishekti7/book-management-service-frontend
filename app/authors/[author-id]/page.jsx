'use client';

import moment from "moment";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";

import { GET_AUTHOR } from "@/graphql-services/getAuthor";

import "./styles.scss";

const AuthorDetails = props => {
    const params = useParams();
    const { loading, error, data } = useQuery(GET_AUTHOR, {
        variables: {
            id: params['author-id']
        }
    });

    const getContent = () => {
        if (loading) {
            return (
                <div>Loading...</div>
            )
        } else if (!loading && error && !data) {
            return (
                <div>Author not found!</div>
            )
        } else {
            return (
                <>
                    <div className="authordetails__container--header">
                        <div className="header-title">{data.author.name}</div>
                        {data.author.date_of_birth ? (
                            <div className="header-subtitle">
                                Born on {moment(data.author.date_of_birth).format('DD MMMM YYYY')}
                            </div>
                        ) : null}
                    </div>
                    <div className="authordetails__container--content">
                        <div className="content-biography">{data.author.biography}</div>
                    </div>
                </>
            )
        }
    }

    return (
        <div className="authordetails__container">
            {getContent()}
        </div>
    );
};

export default AuthorDetails;