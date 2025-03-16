import PropTypes from "prop-types";
import InputBox from "../InputBox";

import "./styles.scss";

const FormInput = props => {
    const { classes, label, placeholder, value, error, inputType = 'text', onChange } = props;

    return (
        <div className={`forminput__container ${classes ? classes : ''}`}>
            {label ? (
                <div className="forminput__container--label">
                    {label}
                </div>
            ) : null}

            <InputBox
                placeholder={placeholder}
                value={value}
                inputType={inputType}
                onChange={onChange}
                error={error}
            />

            {error ? (
                <div className="forminput__container--error">
                    {error}
                </div>
            ) : null}

        </div>
    );
};

FormInput.propTypes = {
    classes: PropTypes.string,
    label: PropTypes.any,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.any,
    onChange: PropTypes.func,
    inputType: PropTypes.oneOf(['text', 'email', 'password'])
};

export default FormInput;