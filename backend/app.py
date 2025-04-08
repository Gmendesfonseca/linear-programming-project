import random

from flask import Flask, request, jsonify
from flask_cors import CORS
# from scipy.optimize import linprog

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return "Hello, World!"

# @app.route('/calc/simplex', methods=['POST'])
# def calc_simplex():
#     data: dict = request.get_json()
    
#     # Extracting data from the request
#     l_in: list = data['coefficient_inequality']  # Coefficients for the inequality constraints
#     r_in: list = data['right_hand_inequality']  # Right-hand side of the inequality constraints
#     z: list = data['objective']  # Coefficients for the objective function
#     l_eq = data.get('coefficient_equality')  # Coefficients for equality constraints (optional)
#     r_eq = data.get('right_hand_equality')  # Right-hand side of equality constraints (optional)
#     l_x = data.get('bounds', [])  # Bounds for variables (optional)

#     # Solve the linear programming problem
#     result = linprog(
#         z, 
#         A_ub=l_in, 
#         b_ub=r_in, 
#         A_eq=l_eq, 
#         b_eq=r_eq, 
#         bounds=l_x, 
#         method='highs'  # Using 'highs' as the preferred method
#     )

#     # Return the result as JSON
#     return jsonify({
#         'result': -result.fun if result.success else None,  # Negate if maximizing
#         'x': result.x.tolist() if result.success else None,
#         'status': result.status,
#         'message': result.message
#     })

@app.route('/calc/knapsack/problem', methods=['POST'])
def generate_knapsack_problem():
    try:
        data: dict = request.get_json()

        # Validate input data
        if not all(key in data for key in ['n', 'min', 'max']):
            return jsonify({'error': 'Missing required keys: n, min, max'}), 400

        n = data['n']  # Number of items
        min = data['min']  # Minimum weight
        max = data['max']  # Maximum weight

        # Validate that n, min, and max are integers and n > 0
        if not isinstance(n, int) or not isinstance(min, int) or not isinstance(max, int) or n <= 0:
            return jsonify({'error': 'Invalid input values. n must be a positive integer, min and max must be integers.'}), 400

        weight = []  # Initialize weight as an empty list

        for i in range(n):
            weight.append(random.randint(min, max))  # Append random weights to the list

        return jsonify({'weight': weight})

    except Exception as e:
        # Handle unexpected errors
        return jsonify({'error': str(e)}), 500

@app.route('/calc/knapsack/initial_solution', methods=['POST'])
def initial_knapsack_solution():
    try:
        data: dict = request.get_json()

        # Extract input data
        n = data['n']  # Number of items
        max_weight = data['max']  # Maximum weight
        weight = data['weight']  # Weights of the items

        # Validate input
        if not isinstance(n, int) or not isinstance(max_weight, int) or n <= 0:
            return jsonify({'error': 'Invalid input values. n must be a positive integer, max must be an integer.'}), 400
        if not isinstance(weight, list) or len(weight) != n:
            return jsonify({'error': 'Invalid weight list. It must be a list of length n.'}), 400

        # Initialize the bag as a binary vector (0s)
        bag = [0] * n
        total_weight = 0

        # Add items to the bag randomly until the weight exceeds max_weight
        while total_weight <= max_weight:
            item = random.randint(0, n - 1)  # Pick a random item
            if bag[item] == 0:  # If the item is not already in the bag
                bag[item] = 1  # Add the item to the bag
                total_weight += weight[item]  # Update the total weight

                # Break if adding the item exceeds the max weight
                if total_weight > max_weight:
                    bag[item] = 0  # Remove the item
                    total_weight -= weight[item]
                    break

        return jsonify({'bag': bag})
    except Exception as e:
        # Handle unexpected errors
        return jsonify({'error': str(e)}), 500

@app.route('/calc/knapsack/evaluate_solution', methods=['POST'])
def evaluate_knapsack_solution():
    data: dict = request.get_json()

    n=data['n'] # Number of items
    solution=data['solution'] # Solution vector
    max=data['max'] # Maximum weight

    cost = 0
    weight = 0

    for i in range(n):
        if solution[i] == 1:
            cost += random.randint(1, max)
            weight += random.randint(1, max)

    return jsonify({
        'cost': cost,
        'weight': weight
    })

if __name__ == '__main__':
    app.run(debug=True)
