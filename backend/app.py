from flask import Flask, request, jsonify
from scipy.optimize import linprog

app = Flask(__name__)

@app.route('/calc', methods=['POST'])
def calc():
    data: dict = request.get_json()
    
    # Extracting data from the request
    l_in: list = data['coefficient_inequality']  # Coefficients for the inequality constraints
    r_in: list = data['right_hand_inequality']  # Right-hand side of the inequality constraints
    z: list = data['objective']  # Coefficients for the objective function
    l_eq = data.get('coefficient_equality')  # Coefficients for equality constraints (optional)
    r_eq = data.get('right_hand_equality')  # Right-hand side of equality constraints (optional)
    l_x = data.get('bounds', [])  # Bounds for variables (optional)

    # Solve the linear programming problem
    result = linprog(
        z, 
        A_ub=l_in, 
        b_ub=r_in, 
        A_eq=l_eq, 
        b_eq=r_eq, 
        bounds=l_x, 
        method='highs'  # Using 'highs' as the preferred method
    )

    # Return the result as JSON
    return jsonify({
        'result': -result.fun if result.success else None,  # Negate if maximizing
        'x': result.x.tolist() if result.success else None,
        'status': result.status,
        'message': result.message
    })

if __name__ == '__main__':
    app.run(debug=True)
