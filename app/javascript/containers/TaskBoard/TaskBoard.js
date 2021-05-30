import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Task from 'components/Task';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import ColumnHeader from 'components/ColumnHeader';
import TasksRepository from 'repositories/TasksRepository';
import TaskForm from 'forms/TaskForm';
import TaskPresenter from 'presenters/TaskPresenter';

import useTasks from 'hooks/store/useTasks';

import '@lourenci/react-kanban/dist/styles.css';
import useStyles from './useStyles';

const MODES = {
  ADD: 'add',
  EDIT: 'edit',
  NONE: 'none',
};

const TaskBoard = () => {
  const { board, loadBoard, loadColumn } = useTasks();
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);
  const styles = useStyles();

  useEffect(loadBoard, []);

  const handleAddPopupOpen = () => {
    setMode(MODES.ADD);
  };

  const handleEditPopupOpen = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage);
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(
      ({ to }) => destination.toColumnId === to
    );
    if (!transition) {
      return;
    }

    return TasksRepository.update(task.id, {
      task: { stateEvent: transition.event },
    })
      .then(() => {
        loadColumn(destination.toColumnId);
        loadColumn(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumn(TaskPresenter.state(task));
      handleClose();
    });
  };
  const handleTaskLoad = (id) =>
    TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(TaskPresenter.id(task), attributes).then(
      () => {
        loadColumn(TaskPresenter.state(task));
        handleClose();
      }
    );
  };
  const handleTaskDestroy = (task) =>
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => {
      loadColumn(TaskPresenter.state(task));
      handleClose();
    });

  return (
    <>
      <Fab
        onClick={handleAddPopupOpen}
        className={styles.addButton}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </Fab>

      <KanbanBoard
        disableColumnDrag
        onCardDragEnd={handleCardDragEnd}
        renderCard={(card) => (
          <Task onClick={handleEditPopupOpen} task={card} />
        )}
        renderColumnHeader={(column) => (
          <ColumnHeader column={column} onLoadMore={loadColumnMore} />
        )}
      >
        {board}
      </KanbanBoard>

      {mode === MODES.ADD && (
        <AddPopup
          onCardCreate={handleTaskCreate}
          onClose={handleClose}
          mode={MODES.ADD}
        />
      )}
      {mode === MODES.EDIT && (
        <EditPopup
          onCardLoad={handleTaskLoad}
          onCardDestroy={handleTaskDestroy}
          onCardUpdate={handleTaskUpdate}
          onClose={handleClose}
          cardId={openedTaskId}
          mode={MODES.EDIT}
        />
      )}
    </>
  );
};

export default TaskBoard;
