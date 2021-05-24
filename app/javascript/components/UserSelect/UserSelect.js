import React, { useState } from 'react';
import PropTypes from 'prop-types';

import AsyncSelect from 'react-select/async';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';

import UsersRepository from 'repositories/UsersRepository';
import UserPresenter from 'presenters/UserPresenter';

import useStyles from './useStyles';

const UserSelect = ({
  error,
  label,
  isClearable,
  isDisabled,
  isRequired,
  onChange,
  value,
  helperText,
}) => {
  const styles = useStyles();
  const handleLoadOptions = (inputValue) =>
    UsersRepository.index({ q: { firstNameOrLastNameCont: inputValue } }).then(
      ({ data }) => data.items
    );

  return (
    <>
      <FormControl
        margin="dense"
        disabled={isDisabled}
        error={error}
        required={isRequired}
      >
        <InputLabel shrink>{label}</InputLabel>
        <div className={styles.select}>
          <AsyncSelect
            cacheOptions
            loadOptions={handleLoadOptions}
            defaultOptions
            getOptionLabel={(user) => UserPresenter.fullName(user)}
            getOptionValue={(user) => UserPresenter.id(user)}
            isDisabled={isDisabled}
            isClearable={isClearable}
            defaultValue={value}
            onChange={onChange}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </>
  );
};

UserSelect.propTypes = {
  error: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

UserSelect.defaultProps = {
  isClearable: false,
  isDisabled: false,
  helperText: '',
  value: '',
};

export default UserSelect;
