import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login_user: null,
    categores: Array(),
  },
  mutations: {
    setLoginUser(state, user) {
      state.login_user = user;
    },
    logoutUser(state) {
      state.login_user = null;
    },
    addCategory(state, { id, category }) {
      category.id = id;
      state.categores.push(category);
      return state.categores;
    },
    deleteCategory(state, { id }) {
      const index = state.categores.findIndex((category) => {
        return category.id === id;
      });
      state.categores.splice(index, 1);
    },
  },
  actions: {
    googleLogin(): void {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    facebookLogin(): void {
      const provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider);
    },
    logout(): void {
      firebase.auth().signOut();
    },
    setLoginUser({ commit }, user) {
      commit('setLoginUser', user);
    },
    logoutUser({ commit }) {
      commit('logoutUser');
    },
    addCategory({ getters, commit }, category) {
      if (getters.uid) {
        firebase
          .firestore()
          .collection(`users/${getters.uid}/categores`)
          .add(category)
          .then((c) => {
            commit('addCategory', { id: c.id, c });
          });
      }
    },
    fetchCategores({ getters, commit }) {
      firebase
        .firestore()
        .collection(`users/${getters.uid}/categores`)
        .orderBy('updatedAt', 'desc')
        .onSnapshot((categores) => {
          categores.docChanges().forEach((category) => {
            commit('addCategory', { id: category.doc.id, category: category.doc.data() });
          });
        });
    },
    deleteCategory({ getters, commit }, { id }) {
      if (getters.uid) {
        firebase
          .firestore()
          .collection(`users/${getters.uid}/categores`)
          .doc(id)
          .delete()
          .then(() => {
            commit('deleteCategory', { id });
          });
      }
    },
  },
  getters:  {
    uid: (state) => (state.login_user ? state.login_user.uid : null),
    getCategoryId: (state) => (id: string) => state.categores.find((category) => category.id === id),
  },
  modules: {
  },
});
