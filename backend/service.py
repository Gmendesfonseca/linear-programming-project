import random
import math
from scipy.optimize import linprog # type: ignore

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
    Gera um problema de mochila múltipla com limitação de peso e custo.

    :param n: Lista de número de itens de cada mochila.
    :param min_weight: Peso mínimo de cada item.
    :param max_weight: Peso máximo de cada item.
    :param max_weights: Lista de máximo de peso de cada mochila.
    :return: Uma lista com listas de pesos e uma lista com listas de custos dos itens para cada mochila.
    """
    weights = []
    costs = []

    for i in range(len(n)):
        knapsack_weights = []
        knapsack_costs = []
        total_weight = 0

        for _ in range(n[i]):
            # Escolhe uma peso aleatória entre o peso mínimo e máximo
            item_weight = random.randint(min_weight, max_weight)

            # Verifica se o peso total não excede o peso máximo da mochila
            if total_weight + item_weight <= max_weights[i]:
                knapsack_weights.append(item_weight)
                total_weight += item_weight
            else:
                # Se o peso total exceder, adiciona o peso restante
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
    Gera uma solução inicial aleatória para o problema da mochila múltipla.

    :param n: Lista de número de itens de cada mochila.
    :param max_weights: Lista de máximo de peso de cada mochila.
    :param weights: Lista de pesos dos itens para cada mochila.
    :return: Lista de listas de soluções iniciais para cada mochila.
    """
    solutions = []
    total_knapsacks = len(n)
    for k in range(total_knapsacks):
        knapsack = [0] * n[k]  # Inicializa a mochila com 0s
        total_weight = 0

        # Adiciona itens aleatórios à mochila até atingir o peso máximo
        while total_weight <= max_weights[k]:
            item = random.randint(0, n[k] - 1)  # Escolhe um item aleatório
            if knapsack[item] == 0:  # Verifica se o item já está na mochila
                knapsack[item] = 1  # Se não estiver, adiciona o item
                total_weight += weights[k][item]  # Atualiza o peso total

        solutions.append(knapsack)

    return solutions

def evaluate_solution(solution, weights, costs):
    """
    Avalia o custo total e o peso de uma solução para o problema da mochila.

    :param solution: Lista de 0s e 1s representando a solução (itens incluídos/excluídos).
    :param weights: Lista de pesos dos itens.
    :param costs: Lista de custos dos itens.

    :return: Uma tupla contendo o custo total e o peso total da solução.
    """
    total_cost = sum(solution[i] * costs[i] for i in range(len(solution)))
    total_weight = sum(solution[i] * weights[i] for i in range(len(solution)))
    return total_cost, total_weight

# SLOPE CLIMBING SUCCESSORS FUNCTION
def successors(actual_solution, actual_cost, actual_weight, max_weight, n, weights, costs):
    """
    Gera e avalia soluções sucessoras para o problema da mochila.

    :param actual_solution: Lista de 0s e 1s representando a solução atual (itens incluídos/excluídos).
    :param actual_cost: Custo da solução atual.
    :param actual_weight: Peso da solução atual.
    :param max_weight: Peso máximo permitido.
    :param n: Número de itens na solução atual.
    :param weights: Lista de pesos dos itens.
    :param costs: Lista de custos dos itens.
    :return: Lista com uma solução melhorada.
    """
    qs = 2 * len(actual_solution)  
    p = 0
    best_successor = actual_solution[:]
    best_cost = actual_cost
    best_weight = actual_weight

    for _ in range(qs):
        aux = actual_solution[:]
        total_cost, total_weight = evaluate_solution(aux, weights, costs)
        while True:
            p = random.randint(0, len(aux) - 1)
            if (aux[p] == 1):
                aux[p] = 0  # Reverte a troca se o item foi adicionado
                total_cost, total_weight = evaluate_solution(aux, weights, costs)
                break
        k = p + 1
        for j in range(len(aux)):
            if k >= len(aux):
                k = 0
            aux[k] = 1
            total_cost, total_weight = evaluate_solution(aux, weights, costs)
            if (total_weight > max_weight):
                aux[k] = 0
            k += 1
        total_cost, total_weight = evaluate_solution(aux, weights, costs)
        if (total_weight <= max_weight and total_cost > actual_cost):
            best_successor = aux[:]
            best_cost = total_cost
            best_weight = total_weight
            
    return [{'solution': best_successor, 'cost': best_cost, 'weight': best_weight}]

# SLOPE CLIMBING METHOD
def slope_climbing_method(n, max_weights, weights, costs, solutions):
    """
    Perform slope climbing for a multiple-knapsack problem.
    
    :param n: Lista de número de itens em cada mochila.
    :param max_weights: Lista de máximo de peso para cada mochila.
    :param weights: Lista de listas de pesos dos itens para cada mochila.
    :param costs: Lista de listas de custos dos itens para cada mochila.
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
        de = va - vn
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

# TEMPERATURE METHOD SUCCESSOR
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
