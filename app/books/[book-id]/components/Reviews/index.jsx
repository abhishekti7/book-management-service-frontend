'use client';

import moment from "moment";
import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { UserIcon } from "lucide-react";
import ReactStars from "react-stars";

import Button from "@/components/Button";
import TextArea from "@/components/TextArea";

import { GET_BOOK_REVIEWS } from "@/graphql-services/getBookReviews";
import { ADD_REVIEW } from "@/graphql-services/addReview";

import "./styles.scss";

const Reviews = props => {
    const [reviewData, setReviewData] = useState({
        review: '',
        rating: 0,
    });

    const { loading, err, data, refetch } = useQuery(GET_BOOK_REVIEWS, {
        variables: {
            book_id: props.bookId,
        }
    });

    const [error, setError] = useState(null);

    const [addBookReview, { addReviewLoading }] = useMutation(ADD_REVIEW);

    const postBookReview = async () => {
        try {
            const data = await addBookReview({
                variables: {
                    input: {
                        book_id: props.bookId,
                        rating: reviewData.rating,
                        comment: reviewData.review,
                    }
                }
            });

            console.log(data);
            refetch();
            setReviewData({ review: '', rating: 0 });
            toast.success('Your review was successfully submitted');
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong. Please try again later!');
        }
    };

    const validate = () => {
        if (!reviewData.review) {
            setError('You cannot submit an empty review');
            return false;
        }

        if (!reviewData.rating) {
            setError('Rating must be atleast 1');
            return false;
        }

        setError(null);
        return true;
    }

    const handleOnPostReview = () => {
        if (validate()) {
            postBookReview();
        }
    };

    return (
        <div className="reviews__container">
            <div className="reviews__container--header">
                Reviews:

                <div className="header-input">
                    <TextArea
                        classes="input-review"
                        placeholder="Write a review"
                        value={reviewData.review}
                        rows={5}
                        onChange={text => {
                            setReviewData(prevObj => {
                                return {
                                    ...prevObj,
                                    review: text
                                }
                            })
                        }}
                    />
                    <div className="input-actions">
                        <ReactStars
                            value={reviewData.rating}
                            count={5}
                            size={20}
                            half={false}
                            onChange={(rating) => {
                                setReviewData(prevObj => {
                                    return {
                                        ...prevObj,
                                        rating: rating,
                                    }
                                })
                            }}
                        />
                        <Button
                            isLoading={addReviewLoading}
                            classes="btn-post"
                            label="Post"
                            onClick={handleOnPostReview}
                        />
                    </div>
                </div>
                {error ? <div className="input-error">{error}</div> : null}
            </div>

            <div className="reviews__container--list">
                {loading ? (
                    <div className="list-loading">Loading...</div>
                ) : null}

                {err || !loading && (!data || !data.bookReviews || data.bookReviews.length === 0) ? (
                    <div className="list-error">No Reviews found</div>
                ) : null}

                {data && data.bookReviews && data.bookReviews.length > 0 ? (
                    data.bookReviews.map(reviewItem => {
                        return (
                            <div
                                key={reviewItem.id}
                                className="list-item"
                            >
                                <div className="user">
                                    <UserIcon />
                                    <div>{reviewItem.user.first_name} {reviewItem.user.last_name} <span>{moment(reviewItem.created_at).format('DD MMMM YYYY')}</span></div>
                                </div>
                                <div className="review">
                                    <div className="rating">
                                        <ReactStars
                                            value={reviewItem.rating}
                                            edit={false}
                                        />
                                    </div>
                                    <div className="comment">"{reviewItem.comment}"</div>
                                </div>
                            </div>
                        )
                    })
                ) : null}
            </div>
        </div>
    );
};

export default Reviews;