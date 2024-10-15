import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        theme: localStorage.getItem('theme'),
        isCollapse: true
    },
    mutations: {
        changeTheme(state, theme) {
            state.theme = theme
        },
        changeIsCollapse(state, isCollapse) {
            state.isCollapse = isCollapse
        }
    },
    actions: {
        changeTheme(context, theme) {
            context.commit('changeTheme', theme)
        },
        changeIsCollapse(context, isCollapse) {
            context.commit('changeIsCollapse', isCollapse)
        }
    }
})
export default store;
