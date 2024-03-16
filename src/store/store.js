import { createStore } from "vuex"
import treeModule from "./treeModule"
import sizeModule from "./sizeModule"
import scrollModule from "./scrollModule"
import scatterPlotModule from "./scatterPlotModule"
import alignModule from "./alignModule"
import selectionModule from "./selectionModule"

const store = createStore({
    modules: {
        tree: treeModule,
        size: sizeModule,
        scroll: scrollModule,
        scatterPlot: scatterPlotModule,
        align: alignModule,
        selection: selectionModule
    }
})

export default store


