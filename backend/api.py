from flask import Flask, request, jsonify
from flask_cors import CORS
from migration import migrate_file

app = Flask(__name__)
CORS(app)

@app.route('/migrate', methods=['POST'])
def migrate():
    data = request.json
    src_path = data['src_path']
    dst_path = data['dst_path']
    try:
        migrate_file(src_path, dst_path)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)