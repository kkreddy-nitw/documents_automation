from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/generate")
def generate():
    data = request.get_json(force=True, silent=True) or {}
    source_path = data.get("sourcePath", "")
    framework = data.get("framework", "ASPICE")
    modules = data.get("modules", [])

    summary = {
        "sourcePath": source_path,
        "framework": framework,
        "modules": modules,
        "status": "queued",
    }
    return jsonify(summary)


if __name__ == "__main__":
    app.run(debug=True)
