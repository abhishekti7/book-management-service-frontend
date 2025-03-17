import SearchDropdown from "../SearchDropdown";
import "./styles.scss";

const FormSearchDropdown = props => {
    const { label, placeholder, selected, options, error, onChange, onItemSelected, onClear } = props;

    return (
        <div className="formsearchdropdown__container">
            {label ? (
                <div className="formsearchdropdown__container--label">
                    {label}
                </div>
            ) : null}

            <SearchDropdown
                placeholder={placeholder}
                selected={selected}
                options={options}
                onChange={onChange}
                onItemSelected={onItemSelected}
                onClear={onClear}
                error={error}
            />

            {error ? (
                <div className="formsearchdropdown__container--error">
                    {error}
                </div>
            ) : null}
        </div>
    )
}

export default FormSearchDropdown;