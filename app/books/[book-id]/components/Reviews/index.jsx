'use client';

import { useState } from "react";
import { useQuery } from "@apollo/client";

import Button from "@/components/Button";
import TextArea from "@/components/TextArea";
import { GET_BOOK_REVIEWS } from "@/graphql-services/getBookReviews";

import "./styles.scss";

const Reviews = props => {
    const [inputValue, setInputValue] = useState('');

    const { loading, err, data } = useQuery(GET_BOOK_REVIEWS, {
        variables: {
            book_id: props.bookId,
        }
    });

    return (
        <div className="reviews__container">
            <div className="reviews__container--header">
                Reviews:

                <div className="header-input">
                    <TextArea
                        classes="input-review"
                        placeholder="Write a review"
                        value={inputValue}
                        rows={5}
                        onChange={text => setInputValue(text)}
                    />
                    <Button classes="btn-post" label="Post" />
                </div>
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
                            <div key={reviewItem.id}>{reviewItem.comment}</div>
                        )
                    })
                ) : null}
            </div>
        </div>
    );
};

export default Reviews;