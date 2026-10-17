from functools import wraps

from flask import jsonify, session

# Demo-only credentials for the prototype login. Not for production use —
# a real deployment would check hashed passwords against a users table.
DEMO_USERNAME = "admin"
DEMO_PASSWORD = "admin123"


def check_credentials(username, password):
    return username == DEMO_USERNAME and password == DEMO_PASSWORD


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("logged_in"):
            return jsonify({"error": "Login required"}), 401
        return view(*args, **kwargs)

    return wrapped
