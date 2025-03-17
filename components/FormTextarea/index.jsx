import TextArea from "../TextArea";
import "./styles.scss";

const FormTextarea = props => {
    const { classes, label, value, error, placeholder, onChange, rows } = props;

    return (
        <div className={`formtextarea__container ${classes ? classes : ''}`}>
            {label ? (
                <div className="formtextarea__container--label">
                    {label}
                </div>
            ) : null}

            <TextArea
                placeholder={placeholder}
                value={value}
                error={error}
                onChange={onChange}
                rows={rows}
            />

            {error ? (
                <div className="formtextarea__container--error">
                    {error}
                </div>
            ) : null}
        </div>
    );
};

export default FormTextarea;