import Link from "next/link";

import PropTypes from "prop-types";

import "./styles.scss";

const Button = props => {
    const { classes, label, onClick, mode, isLink, link, icon, isLoading } = props;

    return (
        <div
            className={`button__container ${classes ? classes : ''} ${mode ? mode : 'light'}`}
            onClick={onClick}
        >
            {icon ? icon : null}
            {isLink ? <Link href={link}>{label}</Link> : null}
            {!isLink ? <div>{label}</div> : null}
        </div>
    );
};

Button.propTypes = {
    classes: PropTypes.string,
    label: PropTypes.string,
    onClick: PropTypes.func,
    mode: PropTypes.oneOf(['light', 'dark']),
    isLink: PropTypes.bool,
    link: PropTypes.string,
    icon: PropTypes.any,
    isLoading: PropTypes.bool
}

export default Button;