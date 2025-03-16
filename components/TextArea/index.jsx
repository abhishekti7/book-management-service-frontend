import PropTypes from "prop-types";

import "./styles.scss";

const TextArea = props => {
    const { classes, placeholder, value, rows, onChange } = props;

    return (
        <div className={`textarea__container ${classes ? classes : ''}`}>
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={event => {
                    onChange(event.target.value)
                }}
                rows={rows || 5}

            />
        </div>
    );
};

TextArea.propTypes = {
    classes: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    rows: PropTypes.number,
    onChange: PropTypes.func,
};

export default TextArea;