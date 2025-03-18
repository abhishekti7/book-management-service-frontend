'use client';

import moment from "moment";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";

import { GET_AUTHOR } from "@/graphql-services/getAuthor";

import "./styles.scss";
import { GET_BOOKS } from "@/graphql-services/getBooks";
import BookItem from "@/app/books/components/BookItem";

const AuthorDetails = props => {
    const params = useParams();
    const { loading, error, data } = useQuery(GET_AUTHOR, {
        variables: {
            id: params['author-id']
        }
    });

    const { loading: booksLoading, error: booksError, data: booksData } = useQuery(GET_BOOKS, {
        variables: {
            page: 1,
            limit: 10,
            filter: {
                author_id: params['author-id'],
            },
            sortBy: 'createdAt',
            order: 'DESC'
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
    };

    console.log(booksData)

    return (
        <div className="authordetails__container">
            {getContent()}

            <div className="authordetails__container--books">
                <div className="books-header">
                    Books by the author:
                </div>

                <div className="books-content">
                    {booksLoading ? (
                        <div>Loading books...</div>
                    ) : null}

                    {!booksLoading && !booksData && booksError ? (
                        <div>No books found</div>
                    ) : null}

                    <div className="books-list">
                        {booksData && booksData.books && booksData.books.books ? (
                            booksData.books.books.map(item => {
                                return (
                                    <BookItem
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        description={item.description}
                                        author={item.author ? item.author.name : ''}
                                        published_date={item.published_date}
                                        averageRating={item.metadata ? item.metadata.average_rating : 0}
                                    />
                                );
                            })
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorDetails;