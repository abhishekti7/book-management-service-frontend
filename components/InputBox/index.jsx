import PropTypes from "prop-types";

import "./styles.scss";

const InputBox = props => {
    const { placeholder, inputType, value, error, onChange } = props;

    return (
        <input
            className={`component__input ${error ? 'error' : ''}`}
            placeholder={placeholder}
            type={inputType}
            value={value}
            onChange={(event) => {
                onChange(event.target.value);
            }}
        />
    );
};

InputBox.propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
}

export default InputBox;