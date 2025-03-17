'use client';

import moment from "moment";
import { DeleteIcon, Edit2Icon, Plus, XIcon } from "lucide-react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { useAuth } from "@/contexts/auth-context";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import FormSearchDropdown from "@/components/FormSearchDropdown";
import MandatoryAsterisk from "@/components/MandatoryAsterisk";
import Button from "@/components/Button";
import { GET_BOOK } from "@/graphql-services/getBook";
import { ADD_BOOK } from "@/graphql-services/addBook";
import { GET_AUTHORS } from "@/graphql-services/getAuthors";
import { UPDATE_BOOK } from "@/graphql-services/updateBook";
import { DELETE_BOOK } from "@/graphql-services/deleteBook";

import "./styles.scss";

const MODES = {
    EDIT: 'edit',
    ADD: 'add',
};

const PostBook = () => {
    const { isAuthenticated, user, loading } = useAuth();

    const params = useSearchParams();
    const router = useRouter();

    const [mode, setMode] = useState(MODES.ADD);
    const [bookId, setBookId] = useState(null);
    const [bookData, setBookData] = useState(null);
    const [authorInput, setAuthorInput] = useState(null);
    const [authorsList, setAuthorsList] = useState([]);
    const authorTimer = useRef(null);

    const [getAuthors, { getAuthorsLoading }] = useLazyQuery(GET_AUTHORS);
    const [getBook, { getBookLoading }] = useLazyQuery(GET_BOOK);
    const [postBook, { postBookLoading }] = useMutation(ADD_BOOK);
    const [editBook, { editBookLoading }] = useMutation(UPDATE_BOOK);
    const [deleteBook, { deleteBookLoading }] = useMutation(DELETE_BOOK);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        published_date: '',
        author_id: '',
        author_name: '',
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

    /**
     * function that fetched the details of the book from the book id
     * this will fire as soon as the bookid is available
     */
    const getBookDetails = async () => {
        try {
            const data = await getBook({
                variables: {
                    id: bookId,
                }
            });

            if (data && data.data && data.data.book) {
                const book = data.data.book;

                setBookData(book);

                setFormData(prevObj => {
                    return {
                        ...prevObj,
                        title: book.title,
                        description: book.description,
                        published_date: book.published_date,
                        author_id: book.author ? book.author.id : '',
                        author_name: book.author ? book.author.name : '',
                        genres: book.metadata ? book.metadata.genres.join(',') : '',
                        tags: book.metadata ? book.metadata.tags.join(',') : '',
                        average_rating: book.metadata ? book.metadata.average_rating : '',
                        page_count: book.metadata ? book.metadata.page_count : ''
                    }
                })
            }
        } catch (error) {
            toast.error('Error fetching book details. Please try again later');
            router.replace('/books');
        }
    };

    const fetchAuthorOptions = async () => {
        try {
            const data = await getAuthors({
                variables: {
                    page: 1,
                    limit: 10,
                    filter: {
                        name: authorInput,
                    },
                    sortBy: 'createdAt',
                    orderBy: 'DESC'
                }
            });

            setAuthorsList(data.data.authors.authors);
        } catch (error) {
            console.log(error);
            setAuthorsList([]);
        }
    };

    // check if user is logged in
    // check whether user is authorized to visit this page
    useEffect(() => {
        // if user is not logged in
        if (!loading && !isAuthenticated && !user) {
            router.replace('/login');
            return;
        }

        // if user is not authorized
        if (!loading && isAuthenticated && user.userType !== 1) {
            toast.error('You are not authorized to visit this page');
            router.replace('/books');
        }
    }, [user, isAuthenticated, loading]);

    // check if page is opened in add or edit mode
    useEffect(() => {
        if (params.get('action') === MODES.EDIT) {
            if (params.get('id')) {
                setMode(MODES.EDIT);
                setBookId(params.get('id'));
            }
        }
    }, [params]);

    // fetch book details when book id is available
    useEffect(() => {
        if (bookId) {
            getBookDetails();
        }
    }, [bookId]);

    // this side effect is used for debouncing of the search query for authors
    // this will add a timer for 500ms before requesting another list from server
    useEffect(() => {
        if (!authorInput) return;

        // timer already set
        if (authorTimer.current) {
            return;
        }

        const timerId = setTimeout(() => {
            fetchAuthorOptions();
            clearTimeout(authorTimer.current)
            authorTimer.current = null;
        }, 500);

        authorTimer.current = timerId;
    }, [authorInput]);

    // check all the fields before processing
    const validate = () => {
        const errorObj = {};
        let hasError = false;

        if (!formData.title) {
            hasError = true;
            errorObj.title = 'Please enter title of the book';
        }

        if (!formData.description) {
            hasError = true;
            errorObj.description = 'Please enter description of the book';
        }

        if (!formData.published_date) {
            hasError = true;
            errorObj.published_date = 'Please enter date of publication of the book';
        } else {
            if (!moment(formData.published_date).isValid()) {
                hasError = true;
                errorObj.published_date = 'Please enter a valid date';
            }
        }

        if (!formData.author_id) {
            hasError = true;
            errorObj.author_id = 'Please enter author id for the book';
        }

        if (hasError) {
            setError(errorObj);
            return false;
        }

        setError({});
        return true;
    };

    // handles add book functionality
    const handleOnAddBook = async () => {
        try {
            const data = await postBook({
                variables: {
                    input: {
                        title: formData.title,
                        description: formData.description,
                        published_date: formData.published_date,
                        author_id: formData.author_id,
                    },
                    metadata: {
                        genres: formData.genres ? formData.genres.split(',') : [],
                        tags: formData.tags ? formData.tags.split(',') : [],
                        average_rating: parseFloat(formData.average_rating) || 0,
                        page_count: parseInt(formData.page_count) || 0,
                    },
                },
            });

            toast.success('The book has been added successfully');
            router.replace('/books');
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Please try again later!')
        }
    };

    /**
     * handles edit book functionality
     */
    const handleOnEditBook = async () => {
        try {
            const data = await editBook({
                variables: {
                    id: bookId,
                    input: {
                        title: formData.title,
                        description: formData.description,
                        published_date: formData.published_date,
                        author_id: formData.author_id,
                    },
                    metadata: {
                        genres: formData.genres ? formData.genres.split(',') : [],
                        tags: formData.tags ? formData.tags.split(',') : [],
                        average_rating: formData.average_rating ? parseFloat(formData.average_rating) : 0,
                        page_count: formData.page_count ? parseInt(formData.page_count) : 0
                    }
                }
            });

            toast.success('The book was updated successfully');
            router.replace('/books');
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Please try again later!');
        }
    };

    const handleOnSubmit = () => {
        if (validate()) {
            if (mode === MODES.ADD) {
                handleOnAddBook();
            } else {
                handleOnEditBook();
            }
        }
    };

    const handleDeleteBook = async () => {
        const user = confirm('Are you sure you want to delete this book?');

        if (user) {
            try {
                await deleteBook({
                    variables: {
                        id: bookId,
                    }
                });

                toast.success('Book delete successfully');
                router.replace('/books');
            } catch (error) {
                console.log(error);
                toast.error('Failed to delete book. Please try again later!');
            }
        }
    }

    return (
        <div className="postbook__container">
            <div className="postbook__container--header">
                <div className="header-title">{mode === MODES.ADD ? 'Add A New Book' : 'Edit Book'}</div>
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

                    <FormTextarea
                        label={<>Description <MandatoryAsterisk /></>}
                        placeholder="Enter description of the book"
                        value={formData.description}
                        error={error.description}
                        rows={10}
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
                        placeholder="Enter date of publication of the book (YYYY-MM-DD)"
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

                    <FormSearchDropdown
                        label={<>Select author <MandatoryAsterisk /></>}
                        placeholder="Type to select author"
                        selected={{
                            id: formData.author_id,
                            name: formData.author_name
                        }}
                        error={error.author_id}
                        options={authorsList}
                        onItemSelected={(id, name) => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    author_id: id,
                                    author_name: name
                                }
                            })
                        }}
                        onChange={(text) => {
                            setAuthorInput(text);
                        }}
                        onClear={() => {
                            setFormData(prevObj => {
                                return {
                                    ...prevObj,
                                    author_id: null,
                                    author_name: ''
                                }
                            })
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
                    label={`${mode === MODES.EDIT ? 'Edit' : 'Add'} book`}
                    icon={mode === MODES.EDIT ? <Edit2Icon /> : <Plus />}
                    mode="light"
                    isLoading={mode === MODES.EDIT ? editBookLoading : postBookLoading}
                    onClick={handleOnSubmit}
                />
                <Button
                    label="Cancel"
                    icon={<XIcon />}
                    mode="dark"
                    onClick={() => {
                        router.replace('/books');
                    }}
                />

                {mode === MODES.EDIT ? (
                    <Button
                        classes="btn-delete"
                        label="Delete Book"
                        icon={<DeleteIcon />}
                        mode="dark"
                        isLoading={deleteBookLoading}
                        onClick={handleDeleteBook}
                    />
                ) : null}

            </div>
        </div>
    );
};

export default PostBook;