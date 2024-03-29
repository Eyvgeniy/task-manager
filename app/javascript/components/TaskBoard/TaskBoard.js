import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import { propOr } from 'ramda';
import '@lourenci/react-kanban/dist/styles.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Task from 'components/Task';
import ColumnHeader from 'components/ColumnHeader';
import AddPopup from 'components/AddPopup';
import EditPopup from 'components/EditPopup';
import TasksRepository from 'repositories/TasksRepository';
import TaskForm from 'forms/TaskForm';
import TaskPresenter from 'presenters/TaskPresenter';

import useStyles from './useStyles';

const STATES = [
  { key: 'new_task', value: 'New' },
  { key: 'in_development', value: 'In Dev' },
  { key: 'in_qa', value: 'In QA' },
  { key: 'in_code_review', value: 'in CR' },
  { key: 'ready_for_release', value: 'Ready for release' },
  { key: 'released', value: 'Released' },
  { key: 'archived', value: 'Archived' },
];

const MODES = {
  ADD: 'add',
  NONE: 'none',
  EDIT: 'edit',
};

const initialBoard = {
  columns: STATES.map((column) => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  })),
};

const TaskBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);
  const [mode, setMode] = useState(MODES.NONE);
  const [openedTaskId, setOpenedTaskId] = useState(null);

  const styles = useStyles();

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };

  const handleClose = () => {
    setMode(MODES.NONE);
    setOpenedTaskId(null);
  };

  const handleOpenEditPopup = (task) => {
    setOpenedTaskId(TaskPresenter.id(task));
    setMode(MODES.EDIT);
  };

  const loadColumn = (state, page, perPage) =>
    TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: {
          cards: [...prevState[state].cards, ...data.items],
          meta: data.meta,
        },
      }));
    });
  };

  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => ({
        ...prevState,
        [state]: { cards: data.items, meta: data.meta },
      }));
    });
  };

  const generateBoard = () => {
    const boardUpdated = {
      columns: STATES.map(({ key, value }) => ({
        id: key,
        title: value,
        cards: propOr({}, 'cards', boardCards[key]),
        meta: propOr({}, 'meta', boardCards[key]),
      })),
    };

    setBoard(boardUpdated);
  };

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = TaskPresenter.transitions(task).find(
      ({ to }) => destination.toColumnId === to
    );
    if (!transition) {
      return null;
    }

    return TasksRepository.update(TaskPresenter.id(task), {
      task: { stateEvent: transition.event },
    })
      .then(() => {
        loadColumnInitial(destination.toColumnId);
        loadColumnInitial(source.fromColumnId);
      })
      .catch((error) => {
        alert(`Move failed! ${error.message}`);
      });
  };

  const handleTaskCreate = (params) => {
    const attributes = TaskForm.attributesToSubmit(params);
    return TasksRepository.create(attributes).then(({ data: { task } }) => {
      loadColumnInitial(TaskPresenter.state);
      handleClose();
    });
  };

  const loadTask = (id) =>
    TasksRepository.show(id).then(({ data: { task } }) => task);

  const handleTaskUpdate = (task) => {
    const attributes = TaskForm.attributesToSubmit(task);

    return TasksRepository.update(TaskPresenter.id(task), attributes).then(
      () => {
        loadColumnInitial(TaskPresenter.state(task));
        handleClose();
      }
    );
  };

  const handleTaskDestroy = (task) =>
    TasksRepository.destroy(TaskPresenter.id(task)).then(() => {
      loadColumnInitial(TaskPresenter.state(task));
      handleClose();
    });

  useEffect(() => loadBoard(), []);
  useEffect(() => generateBoard(), [boardCards]);

  return (
    <>
      <KanbanBoard
        renderCard={(card) => (
          <Task onClick={handleOpenEditPopup} task={card} />
        )}
        renderColumnHeader={(column) => (
          <ColumnHeader column={column} onLoadMore={loadColumnMore} />
        )}
        onCardDragEnd={handleCardDragEnd}
      >
        {board}
      </KanbanBoard>
      ;
      <Fab
        className={styles.addButton}
        color="primary"
        aria-label="add"
        onClick={handleOpenAddPopup}
      >
        <AddIcon />
      </Fab>
      {mode === MODES.ADD && (
        <AddPopup
          onCardCreate={handleTaskCreate}
          onClose={handleClose}
          mode={MODES.ADD}
        />
      )}
      {mode === MODES.EDIT && (
        <EditPopup
          onCardLoad={loadTask}
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
