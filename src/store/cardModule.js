const state = {
    chartType: 'line chart'
}

const mutations = {
    UPDATE_CHART_TYPE(state, payload) {
        state.chartType = payload
    }
}

const actions = {
    updateChartType({commit}, chart_type) {
        commit("UPDATE_CHART_TYPE", chart_type)
    }
}
const getters = {
    chartType: state => state.chartType
}

const cardModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default cardModule