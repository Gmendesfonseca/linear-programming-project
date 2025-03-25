from flask import Flask, request, jsonify
from scipy.optimize import linprog

app = Flask(__name__)

@app.route('/calc', methods=['POST'])
def calc():
    data: dict = request.get_json()
    l: list = data['l']  # Coefficients for the inequality constraints
    r: list = data['r']  # Right-hand side of the inequality constraints
    z: list = data['z']  # Coefficients for the objective function

    # Solve the linear programming problem
    result = linprog(z, A_ub=l, b_ub=r, method='simplex')

    # Return the result as JSON
    return jsonify({'result': result.fun, 'x': result.x.tolist(), 'status': result.status})

if __name__ == '__main__':
    app.run(debug=True)
