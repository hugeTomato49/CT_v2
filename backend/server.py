from flask import Flask, request, jsonify, make_response
import os
import json  
from compute.filter import filterDataByTimeRange
from compute.dr import mds_to2d
from compute.groupTree import constructGT, getGroupedPoints

app = Flask(__name__)

PV_data_folder_path = "data/PV"
PV_tree_file_name = "PV_Tree.json"
collection_json_path = os.path.join(os.path.dirname(__file__), 'tmp/origin_coordinateCollection.json')

@app.route('/PVTree', methods=['GET'])
def getPVTree():
    file_path = os.path.join(os.path.dirname(__file__),PV_data_folder_path, PV_tree_file_name)
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            pv_tree_data = json.load(file) 
        # print(pv_tree_data)
        return {"PV_Tree": pv_tree_data}
    else:
        return make_response(jsonify({"error": "File not found"}), 404)

@app.route('/SeriesCollection', methods=['POST'])
def getSeriesCollection():
    data = request.get_json()
    nodeList = data.get('nodeList', [])
    dataset = data.get('dataset', None)
    collection = []
    
    if dataset == 'PV':
        # read the tree structure to get file_name
        file_path = os.path.join(os.path.dirname(__file__),PV_data_folder_path, PV_tree_file_name)
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                pv_tree_data = json.load(file) 

        for id in nodeList:
            object = {}
            object["id"] = id

            matching_dict = next((item for item in pv_tree_data if item["id"] == id), None)
            object["node_name"] = matching_dict["node_name"]
            object["level"] = matching_dict["level"]
            data_file_name = matching_dict["node_name"] + ".json"
            if id == 1:
                data_file_path = os.path.join(os.path.dirname(__file__),PV_data_folder_path, data_file_name)
                with open(data_file_path, 'r') as file:
                    object['seriesData'] = json.load(file)["data"]
                    object['seriesData_copy'] = object['seriesData']
            else:
                data_folder_path = list(matching_dict["node_name"].split("-"))[-2]
                data_file_path = os.path.join(os.path.dirname(__file__),PV_data_folder_path, data_folder_path, data_file_name)
                with open(data_file_path, 'r') as file:
                    object['seriesData'] = json.load(file)["data"]
                    object['seriesData_copy'] = object['seriesData']
                    
                
            collection.append(object)
    
    return {"seriesCollection": collection}

@app.route('/coordinateCollection', methods=["POST"])
def getCoordinateCollection():
    data = request.get_json()
    dataset = data.get("dataset","")
    level_id_list = data.get("level_id_list",[])
    timeRange = data.get("timeRange",[])
    # print("CHECK")
    # print(timeRange)

    if dataset == "PV":
        if os.path.isfile(collection_json_path):
            with open(collection_json_path, 'r') as file:
                collection_dict = json.load(file)
            
            return collection_dict

        file_path = os.path.join(os.path.dirname(__file__),PV_data_folder_path, PV_tree_file_name)
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                pv_tree_data = json.load(file) 
        
        collection = {}
        for level_id in level_id_list:
            object = {}
            node_list = []
            # find nodes in pv_tree_data whose level equals to level_id
            for node in pv_tree_data:
                if node["level"] == level_id:
                    node_list.append(node)
            
            for node in node_list:
                data_file_name = node["node_name"] + ".json"
                if node["id"] == 1:
                    data_file_path = os.path.join(os.path.dirname(__file__),PV_data_folder_path, data_file_name)
                    with open(data_file_path, 'r') as file:
                        object[node["id"]] = filterDataByTimeRange(json.load(file)["data"], timeRange)

                else:
                    data_folder_path = list(node["node_name"].split("-"))[-2]
                    data_file_path = os.path.join(os.path.dirname(__file__),PV_data_folder_path, data_folder_path, data_file_name)
                    with open(data_file_path, 'r') as file:
                        object[node["id"]] = filterDataByTimeRange(json.load(file)["data"], timeRange)
                        
            result = mds_to2d(object)
            collection[level_id] = result
        
        collection_dict = {"coordinateCollection":collection}
        os.makedirs(os.path.join(os.path.dirname(__file__),"tmp"), exist_ok=True)
        with open(collection_json_path, 'w') as json_file:
            json.dump(collection_dict, json_file)

        return collection_dict

@app.route('/addLayer', methods=["POST"])
def getGroupedCoordinateCollection():
    data = request.get_json()
    dataset = data.get("dataset","")
    level = data.get("level_id",[])
    collection = {}

    if dataset == 'PV':
        Tree_path = os.path.join(os.path.dirname(__file__),PV_data_folder_path, PV_tree_file_name)
        if os.path.exists(Tree_path):
            with open(Tree_path, 'r') as file:
                pv_tree_data = json.load(file) 
                print(pv_tree_data)
        max_level = max(pv_tree_data, key=lambda x: x["level"])['level']

        # if exist the original collection: get level's points;
        # else run the mds on the original Tree
        with open(collection_json_path, 'r') as file:
            origin_collection = json.load(file) 
        # print(origin_collection)
        tmp_result = origin_collection["coordinateCollection"][str(level)]

        grouped_Tree = constructGT(Tree_path, tmp_result, level, n=5)
        grouped_Points = getGroupedPoints(grouped_Tree, tmp_result, level)
        for i in range(max_level+1, level, -1):
            collection[i] = origin_collection["coordinateCollection"][str(i-1)]
        collection[level] = grouped_Points
        for i in range(level-1, 0, -1):
            collection[i] = origin_collection["coordinateCollection"][str(i)]
        grouped_result = {"newOriginalTree":grouped_Tree, "newCoordinateCollection":collection}
       

        
        return grouped_result

if __name__ == "__main__":
    app.run(port=3000, debug=True)
