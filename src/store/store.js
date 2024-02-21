import { createStore } from "vuex"
import treeModule from "./treeModule"
import sizeModule from "./sizeModule"
import scrollModule from "./scrollModule"
import scatterPlotModule from "./scatterPlotModule"

const store = createStore({
    modules: {
        tree: treeModule,
        size: sizeModule,
        scroll: scrollModule,
        scatterPlot: scatterPlotModule
    }
})

export default store


