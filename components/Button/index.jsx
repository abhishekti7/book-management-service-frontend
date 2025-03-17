import Link from "next/link";

import PropTypes from "prop-types";

import "./styles.scss";

const Button = props => {
    const { classes, label, onClick, mode, isLink, link, icon, isLoading } = props;

    let content = null;

    if (isLoading) {
        content = <div>Loading...</div>
    } else {
        content = (
            <>
                {icon ? icon : null}
                {isLink ? <Link href={link}>{label}</Link> : null}
                {!isLink ? <div>{label}</div> : null}
            </>
        )
    }
    return (
        <div
            className={`button__container ${isLoading ? 'loading' : ''} ${classes ? classes : ''} ${mode ? mode : 'light'}`}
            onClick={() => {
                if (isLoading) {
                    return;
                }
                onClick();
            }}
        >
            {content}
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