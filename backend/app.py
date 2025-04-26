import random

from flask import Flask, request, jsonify
from flask_cors import CORS
from scipy.optimize import linprog

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return "Health Check: The server is running!"

@app.route('/calc/simplex', methods=['POST'])
def simplex():
    """
    Solve a linear programming problem using the simplex method."""
    data: dict = request.get_json()
    
    l_in: list = data['coefficient_inequality']
    r_in: list = data['right_hand_inequality']
    z: list = data['objective']
    l_eq = data.get('coefficient_equality')
    r_eq = data.get('right_hand_equality')
    l_x = data.get('bounds', []) 

    result = linprog(
        z, 
        A_ub=l_in, 
        b_ub=r_in, 
        A_eq=l_eq, 
        b_eq=r_eq, 
        bounds=l_x, 
        method='highs'  # Using 'highs' as the preferred method
    )

    return jsonify({
        'result': -result.fun if result.success else None,  # Negate if maximizing
        'x': result.x.tolist() if result.success else None,
        'status': result.status,
        'message': result.message
    })

@app.route('/calc/knapsack/problem', methods=['POST'])
def generate_knapsack_problem():
    """
    Generate a multiple-knapsack problem where multiple knapsacks are treated as one.
    """
    try:
        data: dict = request.get_json()

        n = data['knapsacks_length']  # List of the number of items in each knapsack
        min_weight = data['minimum_weight']  # Minimum weight of items
        max_weight = data['maximum_weight']  # Maximum weight of items
        max_weights = data['max_weights']  # List of maximum weights for each knapsack

        # Generate weights and costs for items in each knapsack
        weights = []
        costs = []
        for i in range(len(n)):
            weights.append([random.randint(min_weight, max_weight) for _ in range(n[i])])
            costs.append([random.randint(1, 100) for _ in range(n[i])])  # Random costs between 1 and 100

        # Combine all knapsacks into one structure
        combined_problem = {
            'n': n,  # Number of items in each knapsack
            'max_weights': max_weights,  # Maximum weights for each knapsack
            'weights': weights,  # Weights of items for each knapsack
            'costs': costs  # Costs of items for each knapsack
        }

        return jsonify({'problem': combined_problem})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/calc/knapsack/initial_solution', methods=['POST'])
def initial_knapsack_solution():
    """
    Generate an initial solution for a multiple-knapsack problem.
    """
    try:
        data: dict = request.get_json()

        n = data['knapsacks_length']  # List of the number of items in each knapsack
        max_weights = data['max_weights']  # List of maximum weights for each knapsack
        weights = data['weights']  # List of lists of item weights for each knapsack

        # Generate initial solutions for each knapsack
        solutions = []
        for k in range(len(n)):  # Iterate over each knapsack
            bag = [0] * n[k]  # Initialize the solution for the current knapsack
            total_weight = 0

            # Add items to the knapsack randomly until the weight exceeds max_weight
            while total_weight <= max_weights[k]:
                item = random.randint(0, n[k] - 1)  # Pick a random item
                if bag[item] == 0:  # If the item is not already in the knapsack
                    bag[item] = 1  # Add the item to the knapsack
                    total_weight += weights[k][item]  # Update the total weight

                    # If adding the item exceeds the max weight, remove it
                    if total_weight > max_weights[k]:
                        bag[item] = 0
                        total_weight -= weights[k][item]
                        break

            solutions.append(bag)  # Append the solution for the current knapsack

        # Return the initial solutions for all knapsacks
        return jsonify({'solutions': solutions})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/calc/knapsack/evaluate_solution', methods=['POST'])
def evaluate_knapsack_solution():
    """
    Evaluate the total cost and weight of solutions for a multiple-knapsack problem.
    """
    try:
        data: dict = request.get_json()

        bags = data['bags']  # List of knapsacks with their solutions, weights, and costs

        costs = []
        weights = []

        # Iterate over each knapsack
        for i in range(len(bags)):
            cost, weight = evaluate_solution(
                solution=bags[i]['solution'],  # Current solution (list of 0s and 1s)
                weights=bags[i]['weights'],  # Weights of items in the knapsack
                costs=bags[i]['costs']  # Costs of items in the knapsack
            )
            costs.append(cost)  # Append the total cost for this knapsack
            weights.append(weight)  # Append the total weight for this knapsack

        # Return the total costs and weights for all knapsacks
        return jsonify({
            'costs': costs,
            'weights': weights
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/calc/knapsack/slope_climb', methods=['POST'])
def slope_climb_knapsack():
    """
    Perform slope climbing for a multiple-knapsack problem.
    """
    data: dict = request.get_json()

    n = data['n']
    max_weights = data['max_weights']  
    weights = data['weights'] 
    costs = data['costs']
    solutions = data['solutions']  # 

    current_costs = []
    current_weights = []
    for i in range(len(solutions)):
        current_costs.append(sum(solutions[i][j] * costs[i][j] for j in range(n[i])))
        current_weights.append(sum(solutions[i][j] * weights[i][j] for j in range(n[i])))

    improved = True
    while improved:
        improved = False
        for k in range(len(solutions)):  
            better_successors = successors(
                actual_solution=solutions[k],
                actual_cost=current_costs[k],
                actual_weight=current_weights[k],
                max_weight=max_weights[k],
                n=n[k],
                weights=weights[k],
                costs=costs[k]
            )

            if better_successors:
                best_successor = max(better_successors, key=lambda x: x['cost'])
                solutions[k] = best_successor['solution']
                current_costs[k] = best_successor['cost']
                current_weights[k] = best_successor['weight']
                improved = True  
        
    return jsonify({
        'solutions': solutions,
        'costs': current_costs,
        'weights': current_weights
    })

@app.route('/calc/knapsack/slope_climb_try_again', methods=['POST'])
def slope_climb_knapsack_try_again():
    """
    Perform slope climbing for a multiple-knapsack problem with retry logic.
    """
    data: dict = request.get_json()

    n = data['n']
    max_weights = data['max_weights']
    weights = data['weights']
    costs = data['costs']
    solutions = data['solutions']
    Tmax = data.get('Tmax', 10)  # Maximum retries (default to 10 if not provided)

    current_costs = []
    current_weights = []
    for i in range(len(solutions)):
        current_costs.append(sum(solutions[i][j] * costs[i][j] for j in range(n[i])))
        current_weights.append(sum(solutions[i][j] * weights[i][j] for j in range(n[i])))

    improved = True
    T = 1  # Initialize retry counter
    while improved:
        improved = False
        better_successors = []
        for k in range(len(solutions)):
            better_successors += successors(
                actual_solution=solutions[k],
                actual_cost=current_costs[k],
                actual_weight=current_weights[k],
                max_weight=max_weights[k],
                n=n[k],
                weights=weights[k],
                costs=costs[k]
            )
        if better_successors:
            best_successor = max(better_successors, key=lambda x: x['cost'])
            solutions[0] = best_successor['solution']
            current_costs[0] = best_successor['cost']
            current_weights[0] = best_successor['weight']
            improved = True
            T = 1  # Reset retry counter on improvement
            for k in range(1, len(solutions)):
                solutions[k] = solutions[0]
                current_costs[k] = current_costs[0]
                current_weights[k] = current_weights[0]
        else:
            T += 1  # Increment retry counter
            if T > Tmax:
                break  # Stop if Tmax retries are reached

    return jsonify({
        'solutions': solutions,
        'costs': current_costs,
        'weights': current_weights
    })

def evaluate_solution(solution, weights, costs):
    """
    Evaluate the total cost and weight of a solution for the knapsack problem.

    Parameters:
    - solution: List of 0s and 1s representing the items included in the knapsack.
    - weights: List of weights for the items.
    - costs: List of costs for the items.

    Returns:
    - A tuple containing the total cost and total weight of the solution.
    """
    total_cost = sum(solution[i] * costs[i] for i in range(len(solution)))
    total_weight = sum(solution[i] * weights[i] for i in range(len(solution)))
    return total_cost, total_weight

def successors(actual_solution, actual_cost, max_weight, n, weights, costs):
    """
    Generate and evaluate successors for the knapsack problem.

    Parameters:
    - actual_solution: Current solution (list of 0s and 1s).
    - actual_cost: Current total cost of the solution.
    - actual_weight: Current total weight of the solution.
    - max_weight: Maximum weight allowed for the knapsack.
    - n: Number of items.
    - weights: List of weights for the items.
    - costs: List of costs for the items.

    Returns:
    - A list of better successor solutions.
    """
    qs = 2 * len(actual_solution)  
    better_successors = []

    for _ in range(qs):
        aux = actual_solution.copy()
        while True:
            # Randomly toggle an item in the solution
            p = random.randint(0, len(aux) - 1)
            aux[p] = 1 - aux[p]  # Flip the bit (0 -> 1 or 1 -> 0)

            # Calculate the new weight and cost
            new_weight = sum(aux[i] * weights[i] for i in range(n))
            new_cost = sum(aux[i] * costs[i] for i in range(n))

            # Check if the new solution is valid and better
            if new_weight <= max_weight and new_cost > actual_cost:
                better_successors.append({
                    'solution': aux,
                    'cost': new_cost,
                    'weight': new_weight
                })
                break  # Stop modifying this solution and move to the next

    return better_successors

if __name__ == '__main__':
    app.run(debug=True)
