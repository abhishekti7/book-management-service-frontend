import moment from "moment";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Edit2Icon } from "lucide-react";

import "./styles.scss";

const AuthorItem = props => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { id, name, biography, dateOfBirth } = props;

    const truncateBiography = (desc) => {
        if (desc.length >= 200) {
            return desc.slice(0, 200) + '...';
        }

        return desc;
    };

    return (
        <div className="authoritem__container" onClick={() => {
            router.push(`/authors/${id}`);
        }}>
            <div className="authoritem__container--name">
                <div className="header-container">
                    <div className="name">{name}</div>
                    {isAuthenticated && user && user.userType == 1 ? (
                        <div className="btn-edit" onMouseDown={(event) => {
                            event.preventDefault();
                            router.push(`/authors/post?action=edit&id=${id}`)
                        }}>
                            <Edit2Icon />
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="authoritem__container--meta">
                <div className="meta-biography">{truncateBiography(biography)}</div>
                {dateOfBirth ? <div className="meta-dob">Date of Birth: {moment(dateOfBirth).format('DD MMMM YYYY')}</div> : null}
            </div>
        </div>
    )
}

export default AuthorItem;