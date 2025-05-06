import service
from flask import Flask, request, jsonify
from flask_cors import CORS

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

    result = service.simplex_method(
        l_in=l_in,
        r_in=r_in,
        z=z,
        l_eq=l_eq,
        r_eq=r_eq,
        l_x=l_x
    )

    return jsonify(result)

@app.route('/calc/knapsack/problem', methods=['POST'])
def generate_knapsack_problem():
    """
    Generate a multiple-knapsack problem where multiple knapsacks are treated as one.
    """
    try:
        data: dict = request.get_json()

        n = data['knapsacks_length']
        min_weight = data['minimum_weight']
        max_weight = data['maximum_weight']
        max_weights = data['max_weights']

        weights,costs =  service.generate_knapsack_problem(n, min_weight, max_weight, max_weights)
        
        combined_problem = {
            'n': n,
            'min_weight': min_weight,
            'max_weights': max_weights,
            'weights': weights,
            'costs':costs,
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

        n = data['knapsacks_length'] 
        max_weights = data['max_weights']  
        weights = data['weights']  

        solutions = service.initial_solution(
            n=n,  
            max_weights=max_weights, 
            weights=weights  
        )
    
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

        bags = data['bags'] 

        costs = []
        weights = []

        for i in range(len(bags)):
            cost, weight = service.evaluate_solution(
                solution=bags[i]['solution'],
                weights=bags[i]['weights'], 
                costs=bags[i]['costs']
            )
            costs.append(cost)
            weights.append(weight)

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

    solutions, current_costs, current_weights = service.slope_climbing_method(
        n=n,  
        max_weights=max_weights, 
        weights=weights, 
        costs=costs, 
        solutions=solutions
    )
        
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

    solutions, current_costs, current_weights = service.slope_climb_try_again_method(
        n=n,
        max_weights=max_weights,
        weights=weights,
        costs=costs,
        solutions=solutions,
        Tmax=Tmax
    )

    return jsonify({
        'solutions': solutions,
        'costs': current_costs,
        'weights': current_weights
    })

if __name__ == '__main__':
    app.run(debug=True)
