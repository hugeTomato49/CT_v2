const state = {
    SD: [],
    wholeTimeRange: ['2022-11-27', '2023-3-27'],
    //wholeTimeRange: ['2023-1-3', '2023-12-29']
    zoomVisiable:0
}

const mutations = {
    UPDATE_ZOOM(state){
        state.zoomVisiable = !state.zoomVisiable
    }
}

const actions = {
    updateSD({ state }, SD_result) {
        state.SD = SD_result
        // console.log("update")
        // console.log(state.SD)
    },
    updateTimeRange({ state, commit, dispatch }, newTimeRange) {
        newTimeRange = [new Date('2022-12-15'), new Date('2022-12-29')]
        commit('UPDATE_TIME_RANGE', newTimeRange)
        // dispatch('filterSeriesCollectionByTimeRange', newTimeRange)
    },
}
const getters = {
    SD: state => state.SD,
    wholeTimeRange: state => state.wholeTimeRange,
    zoomVisiable: state => state.zoomVisiable
}

const timeModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default timeModule