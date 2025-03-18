import "./styles.scss";

const Dropdown = props => {
    const { options, onChange, value } = props;

    const handleOnChange = (event) => {
        onChange(event.target.value);
    };

    return (
        <div className="dropdown__container">
            <select onChange={handleOnChange} defaultValue={value}>
                {options.map(item => {
                    return (
                        <option key={item.id} value={item.id} selected={item.value == value}>
                            {item.value}
                        </option>
                    )
                })}
            </select>
        </div>
    );
};

export default Dropdown;