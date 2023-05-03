import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

const ridingClasses = {
  "CLASS 1": "INTRODUCTORY EQUITATION",
  "CLASS 2A": "PRE-NOVICE EQUITATION",
  "CLASS 2B": "NOVICE EQUITATION",
  "CLASS 3": "LIMIT EQUITATION ON THE FLAT",
  "CLASS 4": "LIMIT EQUITATION OVER FENCES",
  "CLASS 5": "INTERMEDIATE EQUITATION ON THE FLAT",
  "CLASS 6": "INTERMEDIATE EQUITATION OVER FENCES",
  "CLASS 7": "OPEN EQUITATION ON THE FLAT",
  "CLASS 8": "OPEN EQUITATION OVER FENCES",
  "CLASS 9": "ALUMNI EQUITATION ON THE FLAT",
  "CLASS 10": "ALUMNI EQUITATION OVER FENCES",
  "CLASS 11": "BEGINNER WESTERN HORSEMANSHIP",
  "CLASS 12A": "ROOKIE A WESTERN HORSEMANSHIP",
  "CLASS 12B": "ROOKIE B WESTERN HORSEMANSHIP",
  "CLASS 13": "LEVEL I WESTERN HORSEMANSHIP",
  "CLASS 14": "LEVEL II WESTERN HORSEMANSHIP",
  "CLASS 15": "LEVEL II RANCH RIDING",
  "CLASS 16": "OPEN WESTERN HORSEMANSHIP",
  "CLASS 17": "OPEN REINING",
  "CLASS 18": "ALUMNI WESTERN HORSEMANSHIP",
  "CLASS 19": "ALUMNI RANCH RIDING",
};

// Define the store
export default createStore({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  state: {
    eventsRiders: {},
    eventsHorses: {},
    eventsClasses: {},
    eventInfo: {},
    classToName: ridingClasses,
    role: 0,
    isAuth: false,
    token: null,
  },
  getters: {
    getEventsRiders: (state) => {
      return state.eventsRiders;
    },
    getEventsHorses: (state) => {
      return state.eventsHorses;
    },
    getEventsClasses: (state) => {
      return state.eventsClasses;
    },
    getEventInfo: (state) => {
      return state.eventInfo;
    },
    getClassToName: (state) => {
      return state.classToName;
    },
    getRole: (state) => {
      return state.role;
    },
    getAuth: (state) => {
      return state.isAuth;
    },
    getToken: (state) => {
      return state.token;
    },
  },
  mutations: {
    setEventsRiders: (state, riders) => {
      state.eventsRiders = riders;
    },
    setEventsHorses: (state, horses) => {
      state.eventsHorses = horses;
    },
    setEventsClasses: (state, classes) => {
      state.eventsClasses = classes;
    },
    setEventInfo: (state, info) => {
      state.eventInfo = info;
    },
    setClassToName: (state, classToName) => {
      state.classToName = classToName;
    },
    setRole: (state, role) => {
      state.role = role;
    },
    setAuth: (state, isAuth) => {
      state.isAuth = isAuth;
    },
    setToken: (state, token) => {
      state.token = token;
    },
  },
  actions: {
    setEventsRiders: ({ commit }, riders) => {
      commit("setEventsRiders", riders);
    },
    setEventsHorses: ({ commit }, horses) => {
      commit("setEventsHorses", horses);
    },
    setEventsClasses: ({ commit }, classes) => {
      commit("setEventsClasses", classes);
    },
    setEventInfo: ({ commit }, info) => {
      commit("setEventInfo", info);
    },
    setClassToName: ({ commit }, classToName) => {
      commit("setClassToName", classToName);
    },
    setRole: ({ commit }, role) => {
      commit("setRole", role);
    },
    setAuth: ({ commit }, isAuth) => {
      commit("setAuth", isAuth);
    },
    setToken: ({ commit }, token) => {
      commit("setToken", token);
    },
  },
});
