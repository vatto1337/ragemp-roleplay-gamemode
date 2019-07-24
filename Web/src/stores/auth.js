const module = {
  namespaced: true,
  state: {
    alert: null,
    pageMethod: 'login'
  },
  mutations: {
    setAlert(state, alert) {
      state.alert = alert;
    },
    setPageMethod(state, method) {
      state.pageMethod = method;
    }
  },
}

export default module;