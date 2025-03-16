import moment from "moment";
import "./styles.scss";

const AuthorItem = props => {
    const { name, biography, dateOfBirth } = props;

    const truncateBiography = (desc) => {
        if (desc.length >= 200) {
            return desc.slice(0, 200) + '...';
        }

        return desc;
    };

    return (
        <div className="authoritem__container">
            <div className="authoritem__container--name">
                {name}
            </div>

            <div className="authoritem__container--meta">
                <div className="meta-biography">{truncateBiography(biography)}</div>
                {dateOfBirth ? <div className="meta-dob">Date of Birth: {moment(dateOfBirth).format('DD MMMM YYYY')}</div> : null}
            </div>
        </div>
    )
}

export default AuthorItem;