'use client';

import moment from "moment";
import ReactStars from "react-stars";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@apollo/client";

import Reviews from "./components/Reviews";
import { GET_BOOK } from "@/graphql-services/getBook";

import "./styles.scss";

const BookDetails = props => {
    const params = useParams();

    const { loading, err, data } = useQuery(GET_BOOK, {
        variables: {
            id: params['book-id'],
        }
    });

    let avgRating = 0, ratingCount = 0;

    if (data && data.book && data.book.metadata) {
        avgRating = data.book.metadata.average_rating || 0;
        ratingCount = data.book.metadata.ratingCount || 0;
    }

    return (
        <div className="bookdetails__container">
            {loading ? (
                <div className="bookdetails__container--loader">Loading....</div>
            ) : null}

            {err || !loading && (!data || !data.book) ? (
                <div className="bookdetails__container--error">
                    Could not find requested book. Please check the url again.
                </div>
            ) : null}

            {!loading && data && data.book ? (
                <>
                    <div className="bookdetails__container--info">
                        <div className="info-title">
                            {data.book.title}
                        </div>
                        <div className="info-rating">
                            <ReactStars
                                className="rating-stars"
                                count={5}
                                value={avgRating}
                                edit={false}
                            />
                            {data && data.book ? <div className="rating-count">{ratingCount} ratings</div> : null}
                        </div>
                        <div className="info-author">
                            <Link href={`/authors/${data.book.author.id}`}>By: {data.book.author.name} <ExternalLink /></Link>
                            {data.book.published_date ? <div className="author-date">Published On: {moment(data.book.published_date).format('DD MMMM YYYY')}</div> : null}
                        </div>
                        <div className="info-desc">
                            {data.book.description}
                        </div>
                    </div>

                    <Reviews
                        bookId={params['book-id']}
                    />
                </>
            ) : null}
        </div>
    );
};

export default BookDetails;