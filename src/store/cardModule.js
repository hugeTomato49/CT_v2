

const state = {
    chartType: 'line chart',
    selectCheck:[]
}

const mutations = {
    UPDATE_CHART_TYPE(state, payload) {
        state.chartType = payload
    },
    UPDATE_SELECT_CHECK(state, payload) {
        state.chartType = payload
    },
}

const actions = {
    updateChartType({commit}, chart_type) {
        commit("UPDATE_CHART_TYPE", chart_type)
    },
    updateSelectCheck({commit}, check_id) {
        state.selectCheck.push(check_id);
    },
}
const getters = {
    chartType: state => state.chartType,
    selectCheck: state => state.selectCheck
}

const cardModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default cardModule