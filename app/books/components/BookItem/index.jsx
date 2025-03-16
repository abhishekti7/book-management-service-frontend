import moment from "moment/moment";
import "./styles.scss";

const BookItem = props => {
    const { title, description, author, published_date } = props;

    const truncateDescription = (desc) => {
        if (desc.length >= 150) {
            return desc.slice(0, 150) + '...';
        }

        return desc;
    };

    return (
        <div className="bookitem__container">
            <div className="bookitem__container--title">{title}</div>

            <div className="bookitem__container--meta">
                <div className="meta-desc">{truncateDescription(description)}</div>
                <div className="meta-author">
                    <div className="name">{author}</div>
                    {published_date ? <div className="date">Published On: {moment(published_date).format('DD MMMM YYYY')}</div> : null}
                </div>
            </div>

        </div>
    );
}

export default BookItem;