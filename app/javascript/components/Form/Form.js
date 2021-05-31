import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'ramda';

import TextField from '@material-ui/core/TextField';

import UserSelect from 'components/UserSelect';
import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

const MODES = {
  ADD: 'add',
  EDIT: 'edit',
};

const Form = ({ errors, onChange, task, mode }) => {
  const handleChangeTextField = ({ target: { name, value } }) =>
    onChange({ ...task, [name]: value });
  const handleChangeSelect = (fieldName) => (user) =>
    onChange({ ...task, [fieldName]: user });
  const styles = useStyles();

  return (
    <form className={styles.root}>
      <TextField
        error={has('name', errors)}
        helperText={errors.name}
        onChange={handleChangeTextField}
        value={TaskPresenter.name(task)}
        label="Name"
        name="name"
        required
        margin="dense"
      />
      <TextField
        error={has('description', errors)}
        helperText={errors.description}
        onChange={handleChangeTextField}
        value={TaskPresenter.description(task)}
        label="Description"
        name="description"
        required
        multiline
        margin="dense"
      />
      {mode === MODES.EDIT && (
        <UserSelect
          label="Author"
          value={TaskPresenter.author(task)}
          onChange={handleChangeSelect('author')}
          isDisabled
          isRequired
          error={has('author', errors)}
          helperText={errors.author}
        />
      )}
      <UserSelect
        label="Assignee"
        value={TaskPresenter.assignee(task)}
        onChange={handleChangeSelect('assignee')}
        isRequired
        error={has('Assignee', errors)}
        helperText={errors.assignee}
      />
    </form>
  );
};

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  task: PropTypes.shape().isRequired,
  mode: PropTypes.string.isRequired,
  errors: PropTypes.shape({
    name: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.arrayOf(PropTypes.string),
    author: PropTypes.arrayOf(PropTypes.string),
    assignee: PropTypes.arrayOf(PropTypes.string),
  }),
};

Form.defaultProps = {
  errors: {},
};

export default Form;
