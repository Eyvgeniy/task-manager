import routes from '../routes';
import FetchHelper from '../../../utils/fetchHelper';

export default {
  index(params) {
    console.log(routes.apiV1TasksPath())
    const path = routes.apiV1TasksPath();
    return FetchHelper.get(path, params);
  },

  show(id) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.get(`${path}.json`);
  },

  update(id, task = {}) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.put(task);
  },

  create(task = {}) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.post(task);
  },

  destroy(id) {
    const path = routes.apiV1TaskPath(id);
    return FetchHelper.delete(task);
  },
};
