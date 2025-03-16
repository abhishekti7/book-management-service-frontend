'use client';
import { useState } from "react";
import { useQuery } from "@apollo/client";

import BookItem from "./components/BookItem";
import { GET_BOOKS } from "@/graphql-services/getBooks";

import "./styles.scss";

const Books = props => {
    const [params, setParams] = useState({
        page: 1,
        filter: {},
        sortBy: 'createdAt',
        order: 'DESC'
    });

    const { loading, err, data } = useQuery(GET_BOOKS, {
        variables: {
            page: params.page,
            limit: 10,
            filter: params.filter,
            sortBy: params.sortBy,
            order: params.order,
        }
    });

    return (
        <div className="bookslist__container">
            <div className="bookslist__container--header">
                <div className="title">Books</div>
                <div className="subtitle">Browse through this extensive collection of books</div>
            </div>

            <div className="bookslist__container--content">
                <div className="content-list">
                    {data && data.books && data.books.books ? data.books.books.map(bookItem => {
                        return (
                            <BookItem
                                title={bookItem.title}
                                description={bookItem.description}
                                author={bookItem.author && bookItem.author.name ? bookItem.author.name : null}
                                published_date={bookItem.published_date}
                            />
                        )
                    }) : null}
                </div>
            </div>

        </div>
    )
};

export default Books;