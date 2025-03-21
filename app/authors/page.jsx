'use client';

import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { PlusIcon, Search, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

import { GET_AUTHORS } from "@/graphql-services/getAuthors";
import Button from "@/components/Button";
import AuthorItem from "./components/AuthorItem";
import FormDropdown from "@/components/FormDropdown";
import InputBox from "@/components/InputBox";

import "./styles.scss";

const Authors = () => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const [searchInput, setSearchInput] = useState('');
    const [selectedYear, setSelectedYear] = useState(-1);

    const isFetchMoreLoading = useRef(false);

    const [params, setParams] = useState({
        page: 1,
        filter: {},
        sortBy: 'id',
        order: 'ASC',
    });

    const { loading, err, data, refetch, fetchMore } = useQuery(GET_AUTHORS, {
        variables: {
            page: params.page,
            limit: 10,
            filter: params.filter,
            sortBy: params.sortBy,
            order: params.order,
        },
        onCompleted: () => {
            console.log('completed');
            isFetchMoreLoading.current = false;
        }
    });

    useEffect(() => {
        if (data) {
            refetch();
        }
    }, [])

    const handleOnScroll = useCallback(() => {
        const innerHeight = window.innerHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.scrollingElement.scrollHeight;

        if (data && data.authors && !data.authors.hasMore) {
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
                }
            });

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

    const handleOnClearSearch = () => {
        setSearchInput('');
        setSelectedYear(-1);
        setParams({
            page: 1,
            filter: {},
            sortBy: 'id',
            order: 'ASC'
        });

        refetch({
            page: 1,
            limit: 10,
            filter: {},
            sortBy: 'id',
            order: 'ASC'
        })
    }

    const handleOnSearch = () => {
        if (!searchInput) {
            return;
        }

        setParams(prevObj => {
            return {
                ...prevObj,
                page: 1,
                filter: {
                    search: searchInput,
                }
            }
        });

        // refetch the query with the new search query
        refetch({
            page: 1,
            limit: 10,
            filter: {
                search: searchInput,
            },
            sortBy: params.sortBy,
            order: params.order,
        });
    };

    const handleOnYearChange = (value) => {
        setSelectedYear(value);

        const filter = {
            page: 1,
            limit: 10,
            filter: {
                ...params.filter,
                born_on: value,
            },
            sortBy: params.sortBy,
            order: params.order,
        }

        setParams(filter);

        // refetch the query with the new search query
        refetch(filter);
    };

    const getYearOptions = () => {
        const options = [{ id: -1, value: 'Select year' }];

        for (let i = moment().year(); i >= 1950; i--) {
            options.push({
                id: i,
                value: i,
            });
        }

        return options;
    }

    return (
        <div className="authorlist__container">
            <div className="authorlist__container--header">
                <div className="header-left">
                    <div className="title">Authors</div>
                    <div className="subtitle">List of all the authors</div>
                </div>
                <div className="header-right">
                    {isAuthenticated && user && user.userType == 1 ? (
                        <Button
                            classes="btn-add"
                            label="Add new author"
                            icon={<PlusIcon />}
                            onClick={() => {
                                router.push('/authors/post?action=add')
                            }}
                            mode="light"
                        />
                    ) : null}
                </div>
            </div>

            <div className="authorlist__container--filter">
                <div className="filter-search">
                    <InputBox
                        placeholder="Search on name and biography"
                        value={searchInput}
                        onChange={(text) => {
                            setSearchInput(text);
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
                    <FormDropdown
                        label="Fitler by year of birth"
                        value={selectedYear}
                        options={getYearOptions()}
                        onChange={handleOnYearChange}
                    />
                </div>
            </div>

            {data && data.authors ? (
                <div className="authorlist__container--total">{data.authors.total} author{data.authors.total > 1 ? 's' : ''} found</div>
            ) : null}

            <div className="authorlist__container--content">
                <div className="content-list">
                    {data && data.authors && data.authors.authors ? (
                        data.authors.authors.map(item => {
                            return (
                                <AuthorItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    biography={item.biography}
                                    dateOfBirth={item.date_of_birth}
                                />
                            )
                        })
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Authors;
