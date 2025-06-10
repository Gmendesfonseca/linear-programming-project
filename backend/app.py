import logging
from typing import Any, Dict
import service
from flask import Flask, request, jsonify, abort # type: ignore
from flask_cors import CORS # type: ignore

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

@app.route('/', methods=['GET'])
def index() -> str:
    """Health check endpoint."""
    return "<strong>Health Check:</strong> The server is running!"

def get_json_data() -> Dict[str, Any]:
    """Safely get JSON data from request."""
    data = request.get_json()
    if data is None:
        abort(400, description="Invalid or missing JSON data.")
    return data

@app.route('/calc/simplex', methods=['POST'])
def simplex() -> Any:
    data = get_json_data()
    try:
        l_in = data['coefficient_inequality']
        r_in = data['right_hand_inequality']
        z = data['objective']
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
    except KeyError as e:
        logging.error(f"Missing key: {e}")
        abort(400, description=f"Missing key: {e}")
    except Exception as e:
        logging.error(f"Error in simplex: {e}")
        abort(500, description=str(e))

@app.route('/calc/knapsack/problem', methods=['POST'])
def generate_knapsack_problem() -> Any:
    data = get_json_data()
    try:
        n = data['knapsacks_length']
        min_weight = data['minimum_weight']
        max_weight = data['maximum_weight']

        weights, costs = service.generate_knapsack_problem(n, min_weight, max_weight)
        combined_problem = {
            'costs': costs,
            'weights': weights,
            'knapsacks_length': n,
            'minimum_weight': min_weight,
            'maximum_weight': max_weight,
        }
        return jsonify({'problem': combined_problem})
    except KeyError as e:
        logging.error(f"Missing key: {e}")
        abort(400, description=f"Missing key: {e}")
    except Exception as e:
        logging.error(f"Error in generate_knapsack_problem: {e}")
        abort(500, description=str(e))

@app.route('/calc/knapsack/initial_solution', methods=['POST'])
def initial_knapsack_solution() -> Any:
    data = get_json_data()
    try:
        weights = data['weights']
        n = data['knapsacks_length']
        max_weights = data['maximum_weights']

        solutions = service.generate_initial_solution(n, max_weights, weights)
        return jsonify({'solutions': solutions})
    except KeyError as e:
        logging.error(f"Missing key: {e}")
        abort(400, description=f"Missing key: {e}")
    except Exception as e:
        logging.error(f"Error in initial_knapsack_solution: {e}")
        abort(500, description=str(e))

@app.route('/calc/knapsack/evaluate_solution', methods=['POST'])
def evaluate_knapsack_solution() -> Any:
    data = get_json_data()
    try:
        knapsacks = data['knapsacks']
        current_values = []
        for knapsack in knapsacks:
            current_value = service.evaluate_solution(
                costs=knapsack['costs'],
                weights=knapsack['weights'],
                solution=knapsack['solution'],
            )
            current_values.append(current_value)
        return jsonify({'current_values': current_values})
    except KeyError as e:
        logging.error(f"Missing key: {e}")
        abort(400, description=f"Missing key: {e}")
    except Exception as e:
        logging.error(f"Error in evaluate_knapsack_solution: {e}")
        abort(500, description=str(e))

@app.route('/calc/knapsack/slope_climb', methods=['POST'])
def slope_climb_knapsack() -> Any:
    data = get_json_data()
    try:
        costs = data['costs']
        weights = data['weights']
        solutions = data['solutions']
        max_weights = data['maximum_weights']
        current_values = data.get('current_values', [])

        solutions, current_values = service.slope_climbing_method(
            solutions, current_values, weights, costs, max_weights
        )
        return jsonify({
            'solutions': solutions,
            'current_values': current_values
        })
    except KeyError as e:
        logging.error(f"Missing key: {e}")
        abort(400, description=f"Missing key: {e}")
    except Exception as e:
        logging.error(f"Error in slope_climb_knapsack: {e}")
        abort(500, description=str(e))

@app.route('/calc/knapsack/slope_climb_try_again', methods=['POST'])
def slope_climb_knapsack_try_again() -> Any:
    data = get_json_data()
    try:
        costs = data['costs']
        weights = data['weights']
        solutions = data['solutions']
        max_weights = data['maximum_weights']
        Tmax = data.get('Tmax', 10)
        current_values = data['current_values']

        solutions, current_values = service.slope_climb_try_again_method(
            solutions=solutions, current_values=current_values, weights=weights, costs=costs, max_weights=max_weights, Tmax=Tmax
        )
        return jsonify({
            'solutions': solutions,
            'current_values': current_values
        })
    except KeyError as e:
        logging.error(f"Missing key: {e}")
        abort(400, description=f"Missing key: {e}")
    except Exception as e:
        logging.error(f"Error in slope_climb_knapsack_try_again: {e}")
        abort(500, description=str(e))

@app.route('/calc/knapsack/tempera', methods=['POST'])
def tempera_knapsack() -> Any:
    data = get_json_data()
    try:
        costs = data['costs']
        weights = data['weights']
        solutions = data['solutions']
        max_weights = data['maximum_weights']
        fr= data.get('reducer_factor', 0.95)
        ti= data.get('initial_temperature', 0.01)
        tf = data.get('final_temperature', 0.01)
        Tmax = data.get('Tmax', 10)
        current_values = data.get('current_values', [])
        
        new_solutions = []
        new_current_values = []
        
        for i in range(len(solutions)):
            if len(solutions[i]) != len(weights[i]) or len(solutions[i]) != len(costs[i]):
                logging.error("Solution length does not match weights or costs length.")
                abort(400, description="Solution length does not match weights or costs length.")
                
            new_solution, new_value = service.tempera(
                costs=costs[i],
                weights=weights[i],
                solution=solutions[i],
                Tmax=Tmax,
                max_weight=max_weights[i],
                fr=fr,
                tf=tf,
                ti=ti,
                va=current_values[i]
            )
            new_solutions.append(new_solution)
            new_current_values.append(new_value)
            
        return jsonify({'solutions': new_solutions, 'current_values': new_current_values})
    except KeyError as e:
        logging.error(f"Missing key: {e}")
        abort(400, description=f"Missing key: {e}")
    except Exception as e:
        logging.error(f"Error in tempera_knapsack: {e}")
        abort(500, description=str(e))

@app.route('/calc/knapsack/all', methods=['POST'])
def all_methods_knapsack():
    data = get_json_data()
    try:
        n = data['n']
        costs = data['costs']
        weights = data['weights']
        solutions = data['solutions']
        max_weights = data['maximum_weights']
        current_values = data.get('current_values', [])
        Tmax = data.get('Tmax', 10)

        # Executa o método de escalada para cada solução
        slope_climb_solutions, slope_climb_values = service.slope_climbing_method(
            solutions, current_values, weights, costs, max_weights
        )
        slope_climb_try_solutions, slope_climb_try_values = service.slope_climb_try_again_method(
            solutions, current_values, weights, costs, max_weights, Tmax
        )
        
        # Executa o método tempera para cada solução
        tempera_solutions = []
        tempera_values = []
        for i in range(len(solutions)):
            tempera_solution, tempera_value = service.tempera(
                n=n,
                max_weights=max_weights,
                weights=weights,
                costs=costs,
                solutions=solutions,
                Tmax=Tmax
            )
            tempera_solutions.append(tempera_solution)
            tempera_values.append(tempera_value)

        return jsonify({
            'initial_solutions': solutions,
            'slope_climb': {
                'solutions': slope_climb_solutions,
                'values': slope_climb_values
            },
            'slope_climb_try': {
                'solutions': slope_climb_try_solutions,
                'values': slope_climb_try_values
            },
            'tempera': {
                'solutions': tempera_solutions,
                'values': tempera_values
            }
        })
    except KeyError as e:
        logging.error(f"Missing key: {e}")
        abort(400, description=f"Missing key: {e}")
    except Exception as e:
        logging.error(f"Error in all_methods_knapsack: {e}")
        abort(500, description=str(e))

if __name__ == '__main__':
    app.run(debug=True)
