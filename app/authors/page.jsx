'use client';
import { useState } from "react";
import { useQuery } from "@apollo/client";

import { useAuth } from "@/contexts/auth-context";

import { GET_AUTHORS } from "@/graphql-services/getAuthors";
import AuthorItem from "./components/AuthorItem";

import "./styles.scss";
import Button from "@/components/Button";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Authors = props => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const [params, setParams] = useState({
        page: 1,
        filter: {},
        sortBy: 'createdAt',
        order: 'DESC',
    });

    const { loading, err, data } = useQuery(GET_AUTHORS, {
        variables: {
            page: params.page,
            limit: 10,
            filter: params.filter,
            sortBy: params.sortBy,
            order: params.order,
        }
    });

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
