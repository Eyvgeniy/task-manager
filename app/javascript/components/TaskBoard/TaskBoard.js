import React, { useEffect, useState } from 'react';
import KanbanBoard from '@lourenci/react-kanban';
import { propOr } from 'ramda';
import '@lourenci/react-kanban/dist/styles.css';
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add';

import Task from '../Task';
import ColumnHeader from '../ColumnHeader';
import TasksRepository from '../../repositories/TasksRepository';
import AddPopup from '../AddPopup';
import TaskForm from '../../forms/TaskForm'

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
};

const initialBoard = {
  columns: STATES.map(column => ({
    id: column.key,
    title: column.value,
    cards: [],
    meta: {},
  }))
};

const TaskBoard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [boardCards, setBoardCards] = useState([]);
  const [mode, setMode] = useState(MODES.NONE); 
  useEffect(() => loadBoard(), []);
  useEffect(() => generateBoard(), [boardCards]);

  const styles = useStyles();

  const handleOpenAddPopup = () => {
    setMode(MODES.ADD);
  };
  
  const handleClose = () => {
    setMode(MODES.NONE);
  };

  const loadColumn = (state, page, perPage) => {
    return TasksRepository.index({
      q: { stateEq: state },
      page,
      perPage,
    });
  };

  const loadColumnMore = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      // TODO Надо реализовать метод
      // if (data.items.length === 0){
      //   setBoard(state => state.columns)
      // }
    });
  };

  const loadColumnInitial = (state, page = 1, perPage = 10) => {
    loadColumn(state, page, perPage).then(({ data }) => {
      setBoardCards((prevState) => {
        return {
          ...prevState,
          [state]: { cards: data.items, meta: data.meta },

        };
      });
    });
  };

  const generateBoard = () => {
    const board = {
      columns: STATES.map(({ key, value }) => {
        return {
          id: key,
          title: value,
          cards: propOr({}, 'cards', boardCards[key]),
          meta: propOr({}, 'meta', boardCards[key]),
        }
      })
    }

    setBoard(board);
  }

  const loadBoard = () => {
    STATES.map(({ key }) => loadColumnInitial(key));
  };

  const handleCardDragEnd = (task, source, destination) => {
    const transition = task.transitions.find(({ to }) => destination.toColumnId === to);
    if (!transition) {
      return null;
    }
  
    return TasksRepository.update(task.id, { stateEvent: transition.event })
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
      // TODO реализовать метод
      loadColumnInitial(task.state);
      handleClose();
      // … loading column with task.state
      // … close popup
    });
  };

  return(
    <> 
      <KanbanBoard
        renderCard={card => <Task task={card} />} 
        renderColumnHeader={(column) => <ColumnHeader column={column} onLoadMore={loadColumnMore} />}
        onCardDragEnd={handleCardDragEnd}>
          {board}
      </KanbanBoard>;
      <Fab className={styles.addButton} color="primary" aria-label="add" onClick={handleOpenAddPopup}>
        <AddIcon />
      </Fab>
      {mode === MODES.ADD && <AddPopup onCreateCard={handleTaskCreate} onClose={handleClose} />}
    </>)
};

export default TaskBoard;