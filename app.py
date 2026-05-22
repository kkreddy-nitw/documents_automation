from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

PIPELINE_STEPS = {
    "ASPICE": [
        "Validating repository manifest",
        "Parsing C/C++ AST and symbol graph",
        "Mapping architecture layers to SWE scope",
        "Tracing requirements and unit links",
        "Compiling SWE compliance package",
        "Rendering markdown and export bundle",
    ],
    "FuSa": [
        "Validating repository manifest",
        "Parsing C/C++ AST and symbol graph",
        "Extracting safety-critical interfaces",
        "Building risk/failure propagation matrix",
        "Compiling FuSa evidence package",
        "Rendering markdown and export bundle",
    ],
}


@app.get("/")
def index() -> str:
    return render_template("index.html")


@app.post("/api/generate")
def generate() -> Any:
    payload = request.get_json(force=True, silent=True) or {}
    source_path = str(payload.get("sourcePath", "")).strip()
    framework = str(payload.get("framework", "ASPICE")).strip() or "ASPICE"
    modules = payload.get("modules", [])

    if framework not in PIPELINE_STEPS:
        return jsonify({"error": f"Unsupported framework: {framework}"}), 400

    if not source_path:
        return jsonify({"error": "sourcePath is required"}), 400

    if not isinstance(modules, list) or not modules:
        return jsonify({"error": "At least one module selection is required"}), 400

    run_id = f"RUN-{int(datetime.now(tz=timezone.utc).timestamp())}"
    return jsonify(
        {
            "runId": run_id,
            "status": "queued",
            "acceptedAt": datetime.now(tz=timezone.utc).isoformat(),
            "sourcePath": source_path,
            "framework": framework,
            "modules": modules,
            "pipeline": PIPELINE_STEPS[framework],
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
