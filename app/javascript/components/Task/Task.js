import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

const Task = ({ task, onClick }) => {
  const styles = useStyles();

  const handleClick = () => onClick(task);

  const action = (
    <IconButton onClick={handleClick}>
      <EditIcon />
    </IconButton>
  );

  return (
    <Card className={styles.root}>
      <CardHeader title={TaskPresenter.name(task)} action={action} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {TaskPresenter.description(task)}
        </Typography>
      </CardContent>
    </Card>
  );
};

Task.propTypes = {
  task: PropTypes.shape().isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Task;
