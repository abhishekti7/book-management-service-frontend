import PropTypes from "prop-types";

import "./styles.scss";

const InputBox = props => {
    const { placeholder, inputType, value, error, onChange, onKeyDown } = props;

    return (
        <input
            className={`component__input ${error ? 'error' : ''}`}
            placeholder={placeholder}
            type={inputType}
            value={value}
            onKeyDown={onKeyDown}
            onChange={(event) => {
                onChange(event.target.value);
            }}
        />
    );
};

InputBox.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func,
}

export default InputBox;