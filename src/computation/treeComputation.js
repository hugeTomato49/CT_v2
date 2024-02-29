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
        if (node.children_id.length > 0) {
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
    const relatedNodeIds = findAllRelatedNodeIds(id, originalTree); // 查找所有相关节点的ID

    // 先将所有节点透明度设置为20%
    document.querySelectorAll('circle').forEach(circle => {
        circle.style.fillOpacity = '0.1';
    });

    // 高亮相关节点：透明度100%，半径增大
    relatedNodeIds.forEach(nodeId => {
        const circle = document.getElementById(`node${nodeId}`);
        if (circle) {
            circle.style.fillOpacity = '1'; // 完全不透明
            // circle.setAttribute('r', '10'); // 假设高亮时半径变为10
            circle.style.r = '10'; // 恢复默认半径
        }
    });
};

export const resetNodes = () => {
    // 选择所有circle元素，恢复默认透明度和半径
    document.querySelectorAll('.node').forEach(circle => {
        circle.style.fillOpacity = '0.5'; // 恢复默认透明度为50%
        circle.style.r = '7'; // 恢复默认半径
    });
};


export const calculatePlotLinks = (hoveredId, originalTree, coordinateCollection, xScale, yScale) => {
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
    const paths = [];
    const hoveredNode = findNodeById(hoveredId, coordinateCollection);
    const relatedNodeIds = findAllRelatedNodeIds(hoveredId, originalTree);
    // console.log('related node id is', relatedNodeIds)
    relatedNodeIds.forEach(childId => {
        // 假设 findNodeCoordinates 可以从 coordinateCollection 获取节点坐标
        const start = findNodeCoordinates(hoveredId, coordinateCollection, xScale, yScale);
        const end = findNodeCoordinates(childId, coordinateCollection, xScale, yScale);

        if (start && end) {
            // console.log("paths is", paths)
            const pathD = generateBezierPath(start, end);
            paths.push(pathD);
        }
    });
    return paths;
}
const findAllRelatedNodeIds = (nodeId, tree) => {
    let ids = [nodeId]; // 初始化包含当前节点ID的数组

    const findChildrenIds = (id, nodes) => {
        const node = nodes.find(node => node.id === id);
        if (node && node.children_id) {
            node.children_id.forEach(childId => {
                ids.push(childId); // 添加子节点ID到数组
                findChildrenIds(childId, nodes); // 递归查找更深层的子节点
            });
        }
    };

    findChildrenIds(nodeId, tree);
    return ids;
};
function findNodeById(id, coordinateCollection) {
    let node = null
    Object.entries(coordinateCollection).forEach(
        ([level_id, coordinates]) => {
            const temp = coordinates.find(node => node.id === id);
            // console.log("node is", node)
            if (temp) {
                node = temp
            };
        }
    );
    return node;
}
function generateBezierPath(start, end) {
    const controlX = (start.x + end.x) / 2;
    const controlY = start.y - 20; // 控制点上移，使曲线向上弯曲
    return `M ${start.x},${start.y} Q ${controlX},${controlY} ${end.x},${end.y}`;
}
function findNodeCoordinates(nodeId, coordinateCollection, x_Scale, y_Scale) {
    let coordinate = null
    Object.entries(coordinateCollection).forEach(
        ([level_id, coordinates]) => {
            const xScaleObj = x_Scale.find(
                (scale) => scale.level_id === level_id
            );
            const yScaleObj = y_Scale.find(
                (scale) => scale.level_id === level_id
            );
            const node = coordinates.find(node => node.id === nodeId);
            if (node) {
                // console.log("link node is", node)
                coordinate = { x: xScaleObj.xScale(node.x), y: yScaleObj.yScale(node.y) };
            }
        }
    );
    return coordinate; // 如果没有找到节点，返回null
}

