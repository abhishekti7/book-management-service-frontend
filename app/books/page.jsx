'use client';
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import BookItem from "./components/BookItem";
import { GET_BOOKS } from "@/graphql-services/getBooks";

import "./styles.scss";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/auth-context";

const Books = props => {
    const router = useRouter();

    const { user, isAuthenticated } = useAuth();

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
                <div className="header-left">
                    <div className="title">Books</div>
                    <div className="subtitle">Browse through this extensive collection of books</div>
                </div>
                <div className="header-right">
                    {isAuthenticated && user && user.userType == 1 ? (
                        <Button
                            classes="btn-add-book"
                            label="Add new book"
                            icon={<Plus />}
                            onClick={() => {
                                router.push('/books/post?action=add')
                            }}
                        />
                    ) : null}
                </div>
            </div>

            <div className="bookslist__container--content">
                <div className="content-list">
                    {data && data.books && data.books.books ? data.books.books.map(bookItem => {
                        return (
                            <BookItem
                                key={bookItem.id}
                                id={bookItem.id}
                                title={bookItem.title}
                                description={bookItem.description}
                                author={bookItem.author && bookItem.author.name ? bookItem.author.name : null}
                                published_date={bookItem.published_date}
                                averageRating={bookItem.average_rating}
                            />
                        )
                    }) : null}
                </div>
            </div>

        </div>
    )
};

export default Books;