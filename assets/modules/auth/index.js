import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  loading: true,
	token: window.localStorage.getItem('token') || null,
	refresh_token: window.localStorage.getItem('refresh_token') || null,
	user: window.localStorage.getItem('user') || null,
	error: window.localStorage.getItem('error') || null,
	authorities: window.localStorage.getItem('authorities') || '',
	serverDown: null || '',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
