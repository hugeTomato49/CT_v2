import axios from "axios"
import { PLOT_Scale } from "../scale/scale";

const state = {
    plotWidth: 0,
    plotHeight: 0,
    plot_X_Scale: [],
    plot_Y_Scale: [],
    coordinateCollection: [],
    plotLinks: []

}

const mutations = {
    UPDATE_PLOT_WIDTH(state, payload) {
        state.plotWidth = payload
    },
    UPDATE_PLOT_HEIGHT(state, payload) {
        state.plotHeight = payload
    },
    UPDATE_PLOT_X_SCALE(state, payload) {
        state.plot_X_Scale = payload
    },
    UPDATE_PLOT_Y_SCALE(state, payload) {
        state.plot_Y_Scale = payload
    },
    UPDATE_COORDINATE_COLLECTION(state, payload) {
        state.coordinateCollection = payload
        console.log("Check CC")
        console.log(payload)
    },
}

const actions = {
    getCoordinateCollection({ state, commit, dispatch, rootState }) {
        const dataset = rootState.tree.dataset
        const level_id_list = [...new Set(rootState.tree.selectionTree.map(node => node.level))]
        const timeRange = rootState.tree.timeRange
        axios.post('/api/coordinateCollection', { "dataset": dataset, "level_id_list": level_id_list, "timeRange": timeRange }).then((response) => {
            // console.log("check MDS result")
            // console.log(response.data.coordinateCollection)
            commit('UPDATE_COORDINATE_COLLECTION', response.data.coordinateCollection)
            dispatch('updatePlotScale')
        })
        console.log("CoordinateCollection is",state.coordinateCollection)
          // step 1: use updated result of MDS coordinates to update computed scales(for each level)
        
    },
    updatePlotScale({ state, commit }) {
        // still step 1: update scale
        const coordinateCollection = state.coordinateCollection
        //the format of coordinateCollection: 
        // {
        //  level_id1: 
        //      [{node_id:?, x:?, y:?}, ...]},
        //  level_id2: 
        //      [{node_id:?, x:?, y:?}, ...]},
        //  ...
        // }
        // write a function in scale/scale.js using coordinates of each level, and plotHeight, plotWidth
        // import function to return multiple scales(每一个level一个xy scale), commit UPDATE_PLOT_X_SCALE and Y ...
        const plotWidth = state.plotWidth; // 画布宽度
        const plotHeight = state.plotHeight; // 画布高度

        // 初始化存储比例尺的数组
        let plot_X_Scale = [];
        let plot_Y_Scale = [];

        // 为 coordinateCollection 中的每个级别计算比例尺
        Object.keys(coordinateCollection).forEach(level_id => {
            const coordinates = coordinateCollection[level_id];
            // 使用 PLOT_Scale 函数为当前级别计算比例尺
            const { xScale, yScale } = PLOT_Scale(coordinates, plotWidth, plotHeight);

            // 将计算出的比例尺存储在相应的数组中
            plot_X_Scale.push({ level_id: level_id, xScale: xScale });
            plot_Y_Scale.push({ level_id: level_id, yScale: yScale });
            console.log("width is", plotWidth)
            // console.log("yScale is", plot_Y_Scale)
            
        });
        
        

        // 提交包含所有级别 x 比例尺的数组
        commit('UPDATE_PLOT_X_SCALE', plot_X_Scale);
        // 提交包含所有级别 y 比例尺的数组
        commit('UPDATE_PLOT_Y_SCALE', plot_Y_Scale);
    },
    updatePlotWidth({ commit }, plotWidth) {
        commit('UPDATE_PLOT_WIDTH', plotWidth)
    },
    updatePlotHeight({ commit }, plotHeight) {
        commit("UPDATE_PLOT_HEIGHT", plotHeight)
    }
}
const getters = {
    plotWidth: state => state.plotHWidth,
    plotHeight: state => state.plotHeight,
    plot_X_Scale: state => state.plot_X_Scale,
    plot_Y_Scale: state => state.plot_Y_Scale,
    coordinateCollection: state => state.coordinateCollection,
    plotLinks: state => state.plotLinks


}

const scatterPlotModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default scatterPlotModule