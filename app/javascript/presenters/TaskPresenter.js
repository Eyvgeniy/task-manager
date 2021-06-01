import PropTypes from 'prop-types';
import PropTypesPresenter from 'utils/PropTypesPresenter';

export const STATES = [
  { state: 'new_task', value: 'New' },
  { state: 'in_development', value: 'In Dev' },
  { state: 'in_qa', value: 'In QA' },
  { state: 'in_code_review', value: 'In CR' },
  { state: 'ready_for_release', value: 'Ready for release' },
  { state: 'released', value: 'Released' },
  { state: 'archived', value: 'Archived' },
];

export default new PropTypesPresenter(
  {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.string,
    assignee: PropTypes.string,
    state: PropTypes.string,
    transitions: PropTypes.shape,
  },
  {}
);
