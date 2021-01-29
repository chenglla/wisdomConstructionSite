const state = {
    nodeState: {},
    nodeStateId: ''
}

const mutations = {
    CHANGE_NODE: (state, obj) => {
      state.nodeState = Object.assign({}, obj)
    },
    CHANGE_NODE_ID: (state, id) => {
      state.nodeStateId = id
    }
}

const actions = {
    changeNode({ commit }, data) {
      commit('CHANGE_NODE', data)
    },
    changeNodeId({ commit }, data) {
      commit('CHANGE_NODE', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}