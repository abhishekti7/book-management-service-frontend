'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import BookItem from "./components/BookItem";
import { GET_BOOKS } from "@/graphql-services/getBooks";

import "./styles.scss";

const Books = props => {
    const router = useRouter();

    const isFetchMoreLoading = useRef(false);

    const { user, isAuthenticated } = useAuth();
    const [filterData, setFilterData] = useState({
        search: ''
    });

    const [params, setParams] = useState({
        page: 1,
        sortBy: 'createdAt',
        order: 'DESC'
    });

    const { loading, err, data, fetchMore } = useQuery(GET_BOOKS, {
        variables: {
            page: params.page,
            limit: 10,
            sortBy: params.sortBy,
            order: params.order,
        },
        onCompleted: () => {
            isFetchMoreLoading.current = false;
        }
    });

    const handleOnSearch = () => {
        // setParams(prevObj => {
        //     return {
        //         ...prevObj,
        //         page: 1,
        //     }
        // })
        // refetch({
        //     page: 1,
        // })
    };

    const handleOnScroll = useCallback(() => {
        const innerHeight = window.innerHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;

        if (data && data.books && !data.books.hasMore) {
            return;
        }

        if (!isFetchMoreLoading.current && (innerHeight + scrollTop + 100) >= scrollHeight) {
            isFetchMoreLoading.current = true;
            fetchMore({
                variables: {
                    page: params.page + 1,
                    limit: 10,
                    sortBy: params.sortBy,
                    order: params.order,
                },
                updateQuery(previousData) {
                    return previousData;
                },
            });

            // update control state
            setParams(prevObj => {
                return {
                    ...prevObj,
                    page: prevObj.page + 1,
                }
            });
        }
    }, [isFetchMoreLoading, data]);

    useEffect(() => {
        window.addEventListener('scroll', handleOnScroll);

        return () => {
            window.removeEventListener('scroll', handleOnScroll);
        }
    }, [isFetchMoreLoading, data]);

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

            <div className="bookslist__container--filter">
                <div className="filter-search">
                    <InputBox
                        placeholder="Search on title and description"
                        value={filterData.search}
                        onChange={(text) => {
                            setFilterData(prevObj => {
                                return {
                                    ...prevObj,
                                    search: text,
                                }
                            })
                        }}
                    />
                    <Button
                        label="Search"
                        icon={<Search />}
                        isLoading={loading}
                        onClick={handleOnSearch}
                    />
                </div>
            </div>

            {data && data.books ? (
                <div className="bookslist__container--total">{data.books.total} book{data.books.total > 0 ? 's' : ''} found</div>
            ) : null}

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
                                averageRating={bookItem.metadata ? bookItem.metadata.average_rating : 0}
                            />
                        )
                    }) : null}
                </div>
            </div>

        </div>
    )
};

export default Books;