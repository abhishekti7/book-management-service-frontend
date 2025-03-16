'use client';

import { useState } from "react";
import FormInput from "@/components/FormInput";

import "./styles.scss";
import MandatoryAsterisk from "@/components/MandatoryAsterisk";
import Button from "@/components/Button";

const PostBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        published_date: '',
        author_id: '',
        genres: '',
        tags: '',
        page_count: '',
        average_rating: '',
    });

    const [error, setError] = useState({
        title: null,
        description: null,
        published_date: null,
        author_id: null,
        genres: null,
        tags: null,
        page_count: null,
        average_rating: null,
    });

    const handleOnAddBook = () => {

    };

    return (
        <div className="postbook__container">
            <div className="postbook__container--header">
                <div className="header-title">Add A New Book</div>
            </div>
            <div className="postbook__container--content">
                <div className="content-form">
                    <FormInput
                        label={<>Title of the book <MandatoryAsterisk /></>}
                        placeholder="Enter title of the book"
                        value={formData.title}
                        error={error.title}
                        onChange={text => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    title: text,
                                }
                            });
                        }}
                    />

                    <FormInput
                        label={<>Description <MandatoryAsterisk /></>}
                        placeholder="Enter description of the book"
                        value={formData.description}
                        error={error.description}
                        onChange={text => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    description: text,
                                }
                            });
                        }}
                    />

                    <FormInput
                        label={<>Published Date <MandatoryAsterisk /></>}
                        placeholder="Enter date of publication of the book"
                        value={formData.published_date}
                        error={error.published_date}
                        onChange={text => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    published_date: text,
                                }
                            });
                        }}
                    />

                    <FormInput
                        label={<>Author Id <MandatoryAsterisk /></>}
                        placeholder="Enter author id for the book"
                        value={formData.author_id}
                        error={error.author_id}
                        onChange={text => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    author_id: text,
                                }
                            });
                        }}
                    />
                </div>

                <div className="form-header">
                    Enter Metadata for the book
                </div>

                <div className="metadata-form">
                    <FormInput
                        label="Genres"
                        placeholder="Enter genres that the book belongs to"
                        value={formData.genres}
                        error={error.genres}
                        onChange={text => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    genres: text,
                                }
                            });
                        }}
                    />
                    <FormInput
                        label="Tags"
                        placeholder="Enter the tags for the book"
                        value={formData.tags}
                        error={error.tags}
                        onChange={text => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    tags: text,
                                }
                            });
                        }}
                    />
                    <FormInput
                        label="Average Rating"
                        placeholder="Enter the average rating for the book"
                        value={formData.average_rating}
                        error={error.average_rating}
                        onChange={text => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    average_rating: text,
                                }
                            });
                        }}
                    />
                    <FormInput
                        label="Page Count"
                        placeholder="Enter the length of the book"
                        value={formData.page_count}
                        error={error.page_count}
                        onChange={text => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    page_count: text,
                                }
                            });
                        }}
                    />
                </div>
            </div>

            <div className="postbook__container--actions">
                <Button
                    classes="btn-add-book"
                    label="Add book"
                    mode="light"
                    onClick={handleOnAddBook}
                />
            </div>
        </div>
    );
};

export default PostBook;