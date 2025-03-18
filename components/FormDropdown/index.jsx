import Dropdown from "../Dropdown";

import "./styles.scss";

const FormDropdown = props => {
    const { label, error, options, value, onChange } = props;

    return (
        <div className="formdropdown__container">
            {label ? (
                <div className="formdropdown__container--label">{label}</div>
            ) : null}

            <Dropdown
                value={value}
                options={options}
                onChange={onChange}
            />

            {error ? (
                <div className="formdropdown__container--error">{error}</div>
            ) : null}
        </div>
    );
};

export default FormDropdown;