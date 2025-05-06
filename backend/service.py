import random
import math
from scipy.optimize import linprog

# SIMPLEX METHOD
def simplex_method(l_in, r_in, z, l_eq=None, r_eq=None, l_x=None):
    """
    Solve a linear programming problem using the simplex method.

   :param l_in: Coefficients for the inequality constraints.
    :param r_in: Right-hand side values for the inequality constraints.
    :param z: Coefficients for the objective function.
    :param l_eq: Coefficients for the equality constraints (optional).
    :param r_eq: Right-hand side values for the equality constraints (optional).
    :param l_x: Bounds for the variables (optional).
    :return: A dictionary containing the result of the optimization.
    """


    result = linprog(
        c=z,
        A_ub=l_in,
        b_ub=r_in,
        A_eq=l_eq,
        b_eq=r_eq,
        bounds=l_x,
        method='highs'
    )

    return {
        'result': -result.fun if result.success else None,  # Negate if maximizing
        'x': result.x.tolist() if result.success else None,
        'status': result.status,
        'message': result.message
    }

# GENERAL FUNCTIONS
def generate_knapsack_problem(n, min_weight, max_weight, max_weights):
    """
    Generate a multiple-knapsack problem where multiple knapsacks are treated as one.

    :param n: List of the number of items in each knapsack.
    :param min_weight: Minimum weight of items.
    :param max_weight: Maximum weight of items.
    :param max_weights: List of maximum weights for each knapsack.
    :return: A tuple containing the weights and costs of the items.
    """
    weights = []
    costs = []

    for i in range(len(n)):
        knapsack_weights = []
        knapsack_costs = []
        total_weight = 0

        for _ in range(n[i]):
            # Generate a random weight for the item within the allowed range
            item_weight = random.randint(min_weight, max_weight)

            # Ensure the total weight does not exceed the knapsack's max weight
            if total_weight + item_weight <= max_weights[i]:
                knapsack_weights.append(item_weight)
                total_weight += item_weight
            else:
                # If adding the item exceeds the max weight, add a smaller item
                remaining_weight = max_weights[i] - total_weight
                if remaining_weight > 0:
                    knapsack_weights.append(remaining_weight)
                    total_weight += remaining_weight
                else:
                    knapsack_weights.append(0)  # Add a zero-weight item if full

            # Generate a random cost for the item
            knapsack_costs.append(random.randint(1, 100))

        weights.append(knapsack_weights)
        costs.append(knapsack_costs)

    return weights, costs

def generate_initial_solution(n, max_weights, weights):
    """
    Generate an initial solution for a multiple-knapsack problem.

    :param n: List of the number of items in each knapsack.
    :param max_weights: List of maximum weights for each knapsack.
    :param weights: List of lists of item weights for each knapsack.
    :return: A list of initial solutions for each knapsack.
    """
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

        solutions.append(bag)

    return solutions

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

# SUCCESSORS FUNCTION
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

# SLOPE CLIMBING METHOD
def slope_climbing_method(n, max_weights, weights, costs, solutions):
    """
    Perform slope climbing for a multiple-knapsack problem.
    
    :param n: List of the number of items in each knapsack.
    :param max_weights: List of maximum weights for each knapsack.
    :param weights: List of lists of item weights for each knapsack.
    :param costs: List of lists of item costs for each knapsack.
    :return: A list of solutions for each knapsack.
    """
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
    return solutions, current_costs, current_weights

# SLOPE CLIMB WITH TRY AGAIN
def slope_climb_try_again_method(n, max_weights, weights, costs, solutions, Tmax=10):
    """
    Perform slope climbing for a multiple-knapsack problem with retry logic.

    :param n: List of the number of items in each knapsack.
    :param max_weights: List of maximum weights for each knapsack.
    :param weights: List of lists of item weights for each knapsack.
    :param costs: List of lists of item costs for each knapsack.
    :param solutions: List of initial solutions for each knapsack.
    :param Tmax: Maximum retries (default to 10 if not provided).
    :return: A list of solutions for each knapsack.
    """
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

    return solutions, current_costs, current_weights

# TEMPERATURE METHOD
def tempera(n, s, v, items, ti, tf,fr):
    atual = s[:]
    va = v
    t = ti
    while t > tf:
        novo, vn = successor(n, atual, items)
        de = vn - va
        if de < 0:
            atual = novo[:]
            va = vn
        else:
            prob = random.uniform(0,1)
            aux = math.exp(-de/t)
            if prob < aux:
                atual = novo[:]
                va = vn
        t = t * fr
    return atual, va 

def successor(n, atual, items):
    """
    Generate a successor solution for the knapsack problem.

    :param n: Number of items.
    :param atual: Current solution (list of 0s and 1s).
    :param items: List of tuples (weight, cost) for each item.
    :return: A tuple containing the new solution and its cost.
    """
    novo = atual[:]
    p = random.randint(0, n-1)
    novo[p] = 1 - novo[p]  # Flip the bit (0 -> 1 or 1 -> 0)
    
    # Calculate the new cost
    vn = sum(novo[i] * items[i][1] for i in range(n))
    
    return novo, vn
