'use client';
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

import { GET_AUTHORS } from "@/graphql-services/getAuthors";
import Button from "@/components/Button";
import AuthorItem from "./components/AuthorItem";

import "./styles.scss";

const Authors = props => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const isFetchMoreLoading = useRef(false);

    const [params, setParams] = useState({
        page: 1,
        filter: {},
        sortBy: 'createdAt',
        order: 'DESC',
    });

    const { loading, err, data, fetchMore } = useQuery(GET_AUTHORS, {
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

            {data && data.authors ? (
                <div className="authorlist__container--total">{data.authors.total} author{data.authors.total > 0 ? 's' : ''} found</div>
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
