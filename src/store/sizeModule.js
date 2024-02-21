import * as d3 from "d3"
import { groupData } from "../computation/basicComputation"
import { TS_Scales } from "../scale/scale" 

const state = {
    rowHeight: 0,
    cardHeight: 0,
    cardWidth: 0,
    xScale: d3.scaleTime(),
    yScale: [],
    columnPercentage: 0.2,
    rowNum: 18

}

const mutations = {
    UPDATE_ROW_HEIGHT(state, payload) {
        state.rowHeight = payload
    },
    UPDATE_CARD_HEIGHT(state, payload){
        state.cardHeight = payload
    },
    UPDATE_CARD_WIDTH(state, payload) {
        state.cardWidth = payload
    },
    UPDATE_X_SCALE(state, payload) {
        state.xScale = payload
    },
    UPDATE_Y_SCALE(state, payload) {
        state.yScale = payload
    }

}

const actions = {
    updateRowHeight({commit}, height) {
        commit('UPDATE_ROW_HEIGHT', height)
    },
    updateCardHeight({commit}, height) {
        commit('UPDATE_CARD_HEIGHT', height)
    },
    updateCardWidth({commit}, width) {
        commit('UPDATE_CARD_WIDTH', width)
    },
    updateScale({state, commit}, seriesCollection) {
        const data_list = groupData(seriesCollection)
        const x_scale = TS_Scales(data_list[0], state.cardWidth, state.cardHeight).xScale
        const y_scale_list = data_list.map(data => TS_Scales(data, state.cardWidth, state.cardHeight).yScale)
        commit('UPDATE_X_SCALE', x_scale)
        commit('UPDATE_Y_SCALE', y_scale_list)  
    } 


}

const getters = {
    rowHeight: state => state.rowHeight,
    cardWidth: state => state.cardWidth,
    cardHeight: state => state.cardHeight,
    xScale: state => state.xScale,
    yScale: state => state.yScale,
    columnPercentage: state => state.columnPercentage,
    rowNum: state => state.rowNum

}



const sizeModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default sizeModule