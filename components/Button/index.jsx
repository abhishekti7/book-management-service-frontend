import Link from "next/link";
import "./styles.scss";

const Button = props => {
    const { label, onClick, mode, isLink, link } = props;

    return (
        <div className={`button__container ${mode ? mode : 'light'}`} onClick={onClick}>
            {isLink ? <Link href={link}>{label}</Link> : null}
            {!isLink ? <div>{label}</div> : null}
        </div>
    );
};

export default Button;