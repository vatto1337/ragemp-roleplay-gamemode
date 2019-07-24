const module = {
  namespaced: true,
  state: {
    hudStatus: 2,
    justRegistered: true,
    statusF3: false,
    clothes: null,
    activeModal: null,
    modalData: null
  },
  mutations: {
    setHudStatus(state, level) {
      state.hudStatus = level;
    },
    setRegisteredOutfit(state, toggle) {
      state.justRegistered = toggle;
    },
    setStatusF3(state, toggle) {
      state.statusF3 = toggle;
    },
    setClothes(state, clothes) {
      state.clothes = clothes;
    },
    setModalActive(state, data) {
      state.activeModal = data;
    },
    setModalData(state, data) {
      state.modalData = JSON.parse(data);
      // console.log(data);
    },
    disableModals(state) {
      state.modalData = null;
      state.activeModal = null;
      mp.trigger("disableModals");
    }
  },
}

export default module;