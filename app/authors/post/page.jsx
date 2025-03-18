'use client';

import moment from "moment";
import { toast } from "react-toastify";
import { DeleteIcon, Edit2Icon, Plus, XIcon } from "lucide-react";
const { useState, useEffect } = require("react");
const { useSearchParams, useRouter } = require("next/navigation");
const { useLazyQuery, useMutation } = require("@apollo/client");

import { useAuth } from "@/contexts/auth-context";

import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextarea";
import MandatoryAsterisk from "@/components/MandatoryAsterisk";

import { GET_AUTHOR } from "@/graphql-services/getAuthor";
import { ADD_AUTHOR } from "@/graphql-services/addAuthor";
import { UPDATE_AUTHOR } from "@/graphql-services/updateAuthor";
import { DELETE_AUTHOR } from "@/graphql-services/deleteAuthor";

import "./styles.scss";

const MODES = {
    EDIT: 'edit',
    ADD: 'add',
};

const PostAuthor = () => {
    const { user, isAuthenticated, loading } = useAuth();

    const router = useRouter();
    const params = useSearchParams();

    const [mode, setMode] = useState(MODES.ADD);
    const [authorData, setAuthorData] = useState(null);
    const [authorId, setAuthorId] = useState(null);

    const [getAuthor, { getAuthorLoading }] = useLazyQuery(GET_AUTHOR);

    const [addAuthor, { addAuthorLoading }] = useMutation(ADD_AUTHOR);
    const [updateAuthor, { updateAuthorLoading }] = useMutation(UPDATE_AUTHOR);
    const [deleteAuthor, { deleteAuthorLoading }] = useMutation(DELETE_AUTHOR);

    const [formData, setFormData] = useState({
        name: '',
        biography: '',
        date_of_birth: '',
        socialMedia: {
            twitter: '',
            instagram: '',
            facebook: '',
            website: '',
        },
        nationality: '',
        languages: '',
    });

    const [error, setError] = useState({
        name: null,
        biography: null,
        date_of_birth: null,
    });

    // fetches author details based on author id from the query params
    const getAuthorDetails = async () => {
        try {
            const data = await getAuthor({
                variables: {
                    id: authorId,
                }
            });

            if (data && data.data && data.data.author) {
                const author = data.data.author;
                setAuthorData(author);
                setFormData({
                    name: author.name,
                    biography: author.biography,
                    date_of_birth: author.date_of_birth,
                    nationality: author.metadata ? author.metadata.nationality : '',
                    languages: author.metadata ? author.metadata.languages.join(',') : '',
                    social_media: author.metadata ? author.metadata.socialMedia : {}
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('Could not find author. Please try again!');
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
            router.replace('/authors');
        }
    }, [user, isAuthenticated, loading]);

    useEffect(() => {
        if (authorId) {
            getAuthorDetails();
        }
    }, [authorId])

    useEffect(() => {
        if (params.get('action') === MODES.EDIT) {
            if (params.get('id')) {
                setMode(MODES.EDIT);
                setAuthorId(params.get('id'));
            }
        }
    }, [params])

    // function for data sanity before upload
    const validate = () => {
        let hasError = false;
        const errorObj = {};

        if (!formData.name) {
            hasError = true;
            errorObj.name = 'Please enter name of the author';
        }

        if (!formData.biography) {
            hasError = true;
            errorObj.biography = 'Please enter biograph for the author';
        }

        if (!formData.date_of_birth) {
            hasError = true;
            errorObj.date_of_birth = 'Please enter date of birth of the author';
        } else {
            if (!moment(formData.date_of_birth).isValid()) {
                hasError = true;
                errorObj.date_of_birth = 'Please enter a valid date';
            }
        }

        if (hasError) {
            setError(errorObj);
            return false;
        }

        setError({});
        return true;
    }

    // function which calls the add author mutation
    const handleAddAuthor = async () => {
        try {
            const data = await addAuthor({
                variables: {
                    input: {
                        name: formData.name,
                        biography: formData.biography,
                        date_of_birth: formData.date_of_birth,
                    },
                    metadata: {
                        nationality: formData.nationality,
                        languages: formData.languages ? formData.languages.split(',') : [],
                        social_media: {

                        }
                    }
                }
            });

            console.log(data);
            toast.success('Author added successfully');
            router.replace('/authors');
        } catch (error) {
            console.log(error);
            toast.error('Failed to add author. Please try again!');
        }
    };

    // function that calls the edit author mutation
    const handleEditAuthor = async () => {
        try {
            const data = await updateAuthor({
                variables: {
                    id: authorId,
                    input: {
                        name: formData.name,
                        biography: formData.biography,
                        date_of_birth: formData.date_of_birth,
                    },
                    metadata: {
                        nationality: formData.nationality,
                        languages: formData.languages ? formData.languages.split(',') : [],
                        social_media: {}
                    }
                }
            });

            console.log(data);
            toast.success('Author updated successfully');
            router.replace('/authors');
        } catch (error) {
            console.log(error);
            toast.error('Failed to edit author. Please try again!');
        }
    }

    const handleOnSubmit = () => {
        if (validate()) {
            if (mode === MODES.ADD) {
                handleAddAuthor();
            } else {
                handleEditAuthor();
            }
        }
    };

    // delete author and all the books and metadata associated with it
    const handleDeleteAuthor = async () => {
        const user = confirm('Are you sure you want to delete this author? All associated books and metadata will also be deleted.');

        if (user) {
            try {
                await deleteAuthor({
                    variables: {
                        id: authorId,
                    }
                });

                toast.success('Author delete successfully');
                router.replace('/authors');
            } catch (error) {
                console.log(error);
                toast.error('Failed to delete author. Please try again later!');
            }
        }
    }

    const getContent = () => {
        return (
            <>
                <div className="postauthor__container--header">
                    <div className="header-title">{mode === MODES.ADD ? 'Add A New Author' : 'Edit Author'}</div>
                </div>
                <div className="postauthor__container--content">
                    <div className="content-form">
                        <FormInput
                            label={<>Name of the author <MandatoryAsterisk /></>}
                            placeholder="Enter name of the author"
                            value={formData.name}
                            error={error.name}
                            onChange={text => {
                                setFormData(prevObj => {
                                    return {
                                        ...prevObj,
                                        name: text,
                                    }
                                });
                            }}
                        />

                        <FormTextarea
                            label={<>Biography <MandatoryAsterisk /></>}
                            placeholder="Enter biography for the author"
                            value={formData.biography}
                            error={error.biography}
                            rows={10}
                            onChange={text => {
                                setFormData(prevObj => {
                                    return {
                                        ...prevObj,
                                        biography: text,
                                    }
                                })
                            }}
                        />

                        <FormInput
                            label={<>Date of birth (YYYY-MM-DD) <MandatoryAsterisk /></>}
                            placeholder="Enter date of birth of the author (YYYY-MM-DD)"
                            value={formData.date_of_birth}
                            error={error.date_of_birth}
                            onChange={text => {
                                setFormData(prevObj => {
                                    return {
                                        ...prevObj,
                                        date_of_birth: text,
                                    }
                                });
                            }}
                        />
                    </div>

                    <div className="form-header">
                        Enter Metadata for the author
                    </div>

                    <div className="metadata-form">
                        <FormInput
                            label="Nationality"
                            placeholder="Enter nationality of the author"
                            value={formData.nationality}
                            onChange={text => {
                                setFormData(prevObj => {
                                    return {
                                        ...prevObj,
                                        nationality: text,
                                    }
                                });
                            }}
                        />
                        <FormInput
                            label="Languages"
                            placeholder="Enter langauges of the author"
                            value={formData.languages}
                            onChange={text => {
                                setFormData(prevObj => {
                                    return {
                                        ...prevObj,
                                        languages: text,
                                    }
                                });
                            }}
                        />
                    </div>
                </div>

                <div className="postauthor__container--actions">
                    <Button
                        classes="btn-add-author"
                        label={`${mode === MODES.EDIT ? 'Edit' : 'Add'} author`}
                        icon={mode === MODES.EDIT ? <Edit2Icon /> : <Plus />}
                        mode="light"
                        onClick={handleOnSubmit}
                    />
                    <Button
                        label="Cancel"
                        icon={<XIcon />}
                        mode="dark"
                        onClick={() => {
                            router.replace('/authors');
                        }}
                    />
                    {mode === MODES.EDIT ? (
                        <Button
                            classes="btn-delete"
                            label="Delete Author"
                            icon={<DeleteIcon />}
                            mode="dark"
                            isLoading={deleteAuthorLoading}
                            onClick={handleDeleteAuthor}
                        />
                    ) : null}
                </div>
            </>
        );
    };
    return (
        <div className="postauthor__container">
            {mode === MODES.EDIT && !authorData ? (
                <div className="content-loader">Loading author profile...</div>
            ) : null}

            {mode === MODES.EDIT && !loading && authorData ? getContent() : null}
            {mode === MODES.ADD ? getContent() : null}
        </div>
    );
}

export default PostAuthor;