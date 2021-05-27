import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Task from 'components/Task';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import ColumnHeader from 'components/ColumnHeader';
import TasksRepository from 'repositories/TasksRepository';

import useTasks from 'hooks/store/useTasks';

import '@lourenci/react-kanban/dist/styles.css';
import useStyles from './useStyles';

const MODES = {
  ADD: 'add',
  NONE: 'none',
};

const TaskBoard = () => {
  const { board, loadBoard, loadColumn } = useTasks();
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);
  const styles = useStyles();

  useEffect(loadBoard, []);

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(task.id);
    setMode(MODES.EDIT);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const loadColumnMore = () => {};

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

  const handleTaskCreate = () => {};
  const handleTaskLoad = () => {};
  const handleTaskUpdate = () => {};
  const handleTaskDestroy = () => {};

  return (
    <>
      <Fab
        onClick={handleOpenAddPopup}
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
          <Task onClick={handleOpenEditPopup} task={card} />
        )}
        renderColumnHeader={(column) => (
          <ColumnHeader column={column} onLoadMore={loadColumnMore} />
        )}
      >
        {board}
      </KanbanBoard>

      {mode === MODES.ADD && (
        <AddPopup
          onCreateCard={handleTaskCreate}
          onClose={handleClose}
          mode={MODES.ADD}
        />
      )}
      {mode === MODES.EDIT && (
        <EditPopup
          onLoadCard={handleTaskLoad}
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
