'use client';

import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { Plus, Search, XIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

import Button from "@/components/Button";
import InputBox from "@/components/InputBox";
import BookItem from "./components/BookItem";
import FormSearchDropdown from "@/components/FormSearchDropdown";
import FormDropdown from "@/components/FormDropdown";

import { GET_BOOKS } from "@/graphql-services/getBooks";
import { GET_AUTHORS } from "@/graphql-services/getAuthors";

import "./styles.scss";

const Books = () => {
    const router = useRouter();

    const isFetchMoreLoading = useRef(false);

    const { user, isAuthenticated } = useAuth();

    const [filters, setFilters] = useState({
        searchInput: '',
        authorSearchInput: '',
        authorList: [],
        authorSelected: null,
        publishedYear: -1,
    });

    const authorTimer = useRef(null);

    const [params, setParams] = useState({
        page: 1,
        sortBy: 'createdAt',
        order: 'DESC',
        filter: {}
    });

    const [getAuthors, { loading: getAuthorsLoading }] = useLazyQuery(GET_AUTHORS);

    const { loading, err, data, refetch, fetchMore } = useQuery(GET_BOOKS, {
        variables: {
            page: params.page,
            limit: 10,
            filter: params.filter,
            sortBy: params.sortBy,
            order: params.order,
        },
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            console.log('complete');
            isFetchMoreLoading.current = false;
        }
    });

    const setFilterController = (key, value) => {
        setFilters(prevObj => {
            const newObj = { ...prevObj };
            newObj[key] = value;
            return newObj;
        });
    };


    // clear search input query, we will refetch the first page using default filters
    const handleOnClearSearch = () => {
        setFilters({
            searchInput: '',
            authorSearchInput: '',
            authorList: [],
            authorSelected: null,
            publishedYear: -1,
        });

        setParams({
            page: 1,
            filter: {},
            sortBy: 'createdAt',
            order: 'DESC'
        });

        refetch({
            page: 1,
            limit: 10,
            filter: {},
            sortBy: 'createdAt',
            order: 'DESC'
        })
    }

    // when search button is clicked
    const handleOnSearch = () => {
        if (!filters.searchInput) {
            return;
        }

        setParams(prevObj => {
            return {
                ...prevObj,
                page: 1,
                filter: {
                    search: filters.searchInput,
                }
            }
        });

        // refetch the query with the new search query
        refetch({
            page: 1,
            limit: 10,
            filter: {
                search: filters.searchInput,
            },
            sortBy: params.sortBy,
            order: params.order,
        });
    };

    // when search input is changed in the author filter input field
    const handleOnAuthorSearchChange = (text) => {
        setFilterController('authorSearchInput', text);
    };

    // when author filter is cleared
    const handleOnAuthorClear = () => {
        setFilterController('authorSelected', null);

        const existingFilter = { ...params.filter };

        if (existingFilter.author_id) {
            delete existingFilter.author_id;
        }

        const filter = {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            order: 'DESC',
            filter: existingFilter
        };

        refetch(filter);
        setParams(filter);
    };

    // when an author is selected from the dropdown list of author filter
    const handleOnAuthorSelected = (id, name) => {
        setFilterController('authorSelected', {
            id: id,
            name: name
        });

        const filter = {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            order: 'DESC',
            filter: {
                ...params.filter,
                author_id: id,
            }
        };

        refetch(filter);
        setParams(filter);
    };

    // fetch list of authors based on search input
    const fetchAuthorOptions = async () => {
        try {
            const data = await getAuthors({
                variables: {
                    page: 1,
                    limit: 10,
                    filter: {
                        name: filters.authorSearchInput,
                    },
                    sortBy: 'createdAt',
                    orderBy: 'desc'
                }
            });
            setFilterController('authorList', data.data.authors.authors);
        } catch (error) {
            console.log(error);
            setFilterController('authorList', []);
        }
    }

    // this effect acts as a debouncer, sqaushes concurrent fetch requests
    // and sends out a single request once every 500ms after
    // the search input changes
    useEffect(() => {
        if (!filters.authorSearchInput) return;

        if (authorTimer.current) return;

        const timerId = setTimeout(() => {
            fetchAuthorOptions();

            // clear the timer and reset state
            clearTimeout(authorTimer.current);
            authorTimer.current = null;
        }, 500);

        authorTimer.current = timerId;
    }, [filters.authorSearchInput]);

    // handles scroll event on the window
    // when user reaches the required scroll length, we fetch the next page
    const handleOnScroll = useCallback(() => {
        const innerHeight = window.innerHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;

        if (data && data.books && !data.books.hasMore) {
            return;
        }

        // check if next page is already not loading
        if (!isFetchMoreLoading.current && (innerHeight + scrollTop + 100) >= scrollHeight) {
            isFetchMoreLoading.current = true;
            fetchMore({
                variables: {
                    page: params.page + 1,
                    limit: 10,
                    sortBy: params.sortBy,
                    order: params.order,
                },
                updateQuery(previousData, { fetchMoreResult }) {
                    // just return the previous data because
                    // we have already merged the incoming data in 
                    // the apollo client config using typePolicies
                    console.log(previousData);
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

    // add an event listener for scroll on window
    useEffect(() => {
        window.addEventListener('scroll', handleOnScroll);

        return () => {
            window.removeEventListener('scroll', handleOnScroll);
        }
    }, [isFetchMoreLoading, data]);

    const handleOnYearChange = (value) => {
        setFilterController('publishedYear', value);

        const existingFilter = {
            ...params.filter,
        };

        if (value == -1) {
            delete existingFilter.published_on;
        } else {
            existingFilter['published_on'] = value;
        }

        const filter = {
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            order: 'DESC',
            filter: existingFilter
        };

        refetch(filter);
        setParams(filter);
    };

    const getYearOptions = () => {
        const options = [];

        for (let i = moment().year(); i >= 1950; i--) {
            options.push({
                id: i,
                value: i,
            });
        };

        return [{ id: -1, value: 'Select year' }, ...options];
    }

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
                        value={filters.searchInput}
                        onChange={(text) => {
                            setFilterController('searchInput', text)
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleOnSearch();
                            }
                        }}
                    />
                    <Button
                        label="Search"
                        icon={<Search />}
                        isLoading={loading}
                        onClick={handleOnSearch}
                    />
                    <Button
                        label="Clear"
                        icon={<XIcon />}
                        mode="dark"
                        isLoading={loading}
                        onClick={handleOnClearSearch}
                    />
                </div>

                <div className="filter-options">
                    <div className="options-author">
                        <FormSearchDropdown
                            label="Filter by author"
                            placeholder="Type to search"
                            options={filters.authorList}
                            selected={filters.authorSelected}
                            onItemSelected={handleOnAuthorSelected}
                            onChange={handleOnAuthorSearchChange}
                            onClear={handleOnAuthorClear}
                        />
                    </div>

                    <div className="options-year">
                        <FormDropdown
                            label="Filter by year of publication"
                            value={filters.publishedYear}
                            options={getYearOptions()}
                            onChange={handleOnYearChange}
                        />
                    </div>
                </div>
            </div>

            {data && data.books ? (
                <div className="bookslist__container--total">{data.books.total} book{data.books.total > 0 ? 's' : ''} found</div>
            ) : null}

            <div className="bookslist__container--content">
                <div className="content-list">
                    {loading && !data ? (
                        <div className="content-loader">Loading...</div>
                    ) : null}
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
                {loading && data ? (
                    <div className="bottom-content-loader">Loading next page...</div>
                ) : null}
            </div>

        </div>
    )
};

export default Books;