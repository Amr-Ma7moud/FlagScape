#!/bin/bash
cd "$(dirname "$0")"
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install -r requirements.txt
    ./venv/bin/python scripts/seed.py
fi

echo "Starting Flask server..."
./venv/bin/python app.py
