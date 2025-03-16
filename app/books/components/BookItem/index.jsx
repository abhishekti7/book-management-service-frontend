import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import moment from "moment/moment";

import { Edit2Icon } from "lucide-react";

import "./styles.scss";

const BookItem = props => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const { id, title, description, author, published_date, averageRating } = props;

    const truncateDescription = (desc) => {
        if (desc.length >= 150) {
            return desc.slice(0, 150) + '...';
        }

        return desc;
    };

    const handleOnItemClick = () => {
        router.push(`/books/${id}`)
    };

    const handleOnBookEdit = (event) => {
        event.preventDefault();
        router.push(`/books/post?action=edit&id=${id}`);
    }

    return (
        <div className="bookitem__wrapper" onClick={handleOnItemClick}>
            {isAuthenticated && user && user.userType == 1 ? (
                <div className="btn-edit" onMouseDown={handleOnBookEdit}>
                    <Edit2Icon />
                </div>
            ) : null}

            <div className="bookitem__container">
                <div className="bookitem__container--title">{title}</div>

                <div className="bookitem__container--meta">
                    <div className="meta-desc">{truncateDescription(description)}</div>
                    <div className="meta-author">
                        <div className="rating">{averageRating}</div>
                        <div className="name">{author}</div>
                        {published_date ? <div className="date">Published On: {moment(published_date).format('DD MMMM YYYY')}</div> : null}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BookItem;