from flask import Flask, request, jsonify
from cluster import cluster_kmeans
from pearson import pearson_cal

app = Flask(__name__)


# kmeans cluster
@app.route('/kmeans',methods=['GET', 'POST'])
def cluster():
    try:
        data = request.json.get("data")
        # print(data)
        result = cluster_kmeans(data, 4)
        if result == '':
            error_message = {"error": "Data Error."}
            return jsonify(error_message), 400
        return result

    except Exception as e:
        error_message = {"error": str(e)}
        return jsonify(error_message), 400


# calculate pearson correlation coefficient
@app.route('/pearson',methods=['GET', 'POST'])
def pearson():
    try:
        data = request.json.get("data")
        # print(data)
        result = pearson_cal(data)
        if result == 2 or result == '':
            error_message = {"error": "Data Error."}
            return jsonify(error_message), 400
        return result
    except Exception as e:
        error_message = {"error": str(e)}
        return jsonify(error_message), 400


if __name__ == "__main__":
    app.run(port=3000, debug=True)