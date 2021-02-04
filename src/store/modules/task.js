const state = {
    nodeState: {},
    nodeStateId: '',
    isLeaf: false,
    otherId: ''
}

const mutations = {
    CHANGE_NODE: (state, obj) => {
      state.nodeState = Object.assign({}, obj)
    },
    CHANGE_NODE_ID: (state, id) => {
      state.nodeStateId = id
    },
    CHANGE_ISLEAF: (state, status) => {
      state.isLeaf = status
    },
    CHANGE_OTHERID: (state, id) => {
      state.otherId = id
    }
}

const actions = {
    changeNode({ commit }, data) {
      commit('CHANGE_NODE', data)
    },
    changeNodeId({ commit }, data) {
      commit('CHANGE_NODE', data)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}