import random
from flask import Flask, request, jsonify
from scipy.optimize import linprog

app = Flask(__name__)

@app.route('/calc/simplex', methods=['POST'])
def calc_simplex():
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

@app.route('/calc/knapsack/problem', methods=['POST'])
def generate_knapsack_problem(n, min,max):
    m1:int[n]
    m2:int[n]

    for i in range(n):
        m1 += random.randint(min, max)
        m2 += random.randint(min, max)
    return m1, m2

@app.route('/calc/knapsack/initial_solution', methods=['POST'])
def initial_bag_solution(n, max, weight):
    bag = random.sample(range(0, n), n)
    w = 0
    while w <= max:
        item = random.randint(0, n-1)
        if bag[item] == 0:
            bag[item] = 1
            w += weight[item]
    bag = sorted(bag)
    return bag

@app.route('/calc/knapsack/evaluate_solution', methods=['POST'])
def evaluate_bag_solution(n, solution, m1):
    cost = 0
    weight = 0
    for i in range(n):
        if solution[i] == 1:
            cost += random.randint(1, m1)
            weight += random.randint(1, m1)
    return cost, weight

if __name__ == '__main__':
    app.run(debug=True)
