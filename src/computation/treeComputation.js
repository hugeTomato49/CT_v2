export const DFS = (tree) => {
    const result = []; 
    const nodeMap = tree.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
    }, {});
    const dfs = (nodeId) => {
        const node = nodeMap[nodeId];
        if (!node) return;

        result.push(node); 
        node.children_id.forEach(childId => dfs(childId)); 
    };
    dfs(1);
    return result; 
};

export const calculateEdges = (tree) => {
    // parameter tree is linearizedTree
    const edges = []
    tree.forEach((node, index) => {
        if(node.children_id.length > 0){
            node.children_id.forEach(child => {
                const edge = {}
                edge.startIndex = index
                edge.startLevel = node.level

                const endNode = tree.find(n => n.id == child)
                edge.endIndex = tree.findIndex(n => n.id == child)
                edge.endLevel = endNode.level
                edges.push(edge)     
            })
        }
    })
    return edges
}

export const highlightNodes = (id, originalTree) => {

}

export const resetNodes = () => {
    
}


export const calculatePlotLinks = (id, originalTree, coordinateCollection) => {
//     return [
//         {
//         "start_id": 1,
//         "end_id": 2,
//         "start_x": 0,
//         "start_y": 0,
//         "end_x": 0,
//         "end_y": 0,
//     },
//     ...
// ]

}