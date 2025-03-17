'use client';

import { useState } from "react";
import PropTypes from "prop-types";

import { XIcon } from "lucide-react";

import "./styles.scss";

const SearchDropdown = props => {
    const { placeholder, selected, options = [], onChange, onItemSelected, onClear, error } = props;

    // to maintain the state of the dropdown
    const [showDropdown, setShowDropdown] = useState(false);

    // call parent function and clear dropdown when item selected
    const handleOnItemClick = (id, name) => {
        onItemSelected(id, name);
        setShowDropdown(false);
    };

    return (
        <div
            className={`searchdropdown__container ${error ? 'error' : ''}`}
            onFocus={() => {
                setShowDropdown(true);
            }}
            onBlur={() => {
                setShowDropdown(false);
            }}
        >
            <div className="searchdropdown__container--input">
                {selected && selected.id ? (
                    <div className="input-selected">
                        <div className="selected-value">
                            <div>{selected.name} (id: {selected.id})</div>
                        </div>
                        <div className="btn-clear" onClick={onClear}>
                            <XIcon />
                        </div>
                    </div>
                ) : (
                    <div className="input-notselected">
                        <input
                            placeholder={placeholder}
                            onChange={(event) => {
                                onChange(event.target.value);
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="searchdropdown__container--dropdown">
                {showDropdown ? (
                    options && options.length > 0 ? (
                        <div className="dropdown-list">
                            {options.map(item => {
                                return (
                                    <div
                                        key={item.id}
                                        className="dropdown-list-item"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            handleOnItemClick(item.id, item.name)
                                        }}
                                    >
                                        {item.name}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="dropdown-list empty">
                            No matching authors found
                        </div>
                    )
                ) : null}
            </div>
        </div>
    );
};

SearchDropdown.propTypes = {
    placeholder: PropTypes.string,
    selected: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    }),
    options: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
    }),
    onChange: PropTypes.func,
    onItemSelected: PropTypes.func,
    onClear: PropTypes.func,
    error: PropTypes.any
}

export default SearchDropdown;