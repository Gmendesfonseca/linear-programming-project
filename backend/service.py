import random
import math
import logging
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
def generate_knapsack_problem(n, min_weight, max_weight):
    """
    Gera um problema de mochila múltipla com limitação de peso e custo.

    :param n: Lista de número de itens de cada mochila.
    :param min_weight: Peso mínimo de cada item.
    :param max_weight: Peso máximo de cada item.
    :return: Uma lista com listas de pesos e uma lista com listas de custos dos itens para cada mochila.
    """
    costs = []
    weights = []

    for i in range(len(n)):
        knapsack_weights = []
        knapsack_costs = []

        for _ in range(n[i]):
            knapsack_weights.append(random.randint(min_weight, max_weight))
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

        indices = list(range(n[k]))
        random.shuffle(indices)
        for item in indices:
            if total_weight + weights[k][item] <= max_weights[k]:
                knapsack[item] = 1
                total_weight += weights[k][item]
        knapsack[item] = 0
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
    total_weight = evaluate_weight(solution, weights)
    current_value = total_cost / total_weight if total_weight > 0 else 0
    return current_value

def evaluate_weight(solution, weights):
    """
    Avalia o peso total de uma solução para o problema da mochila.

    :param solution: Lista de 0s e 1s representando a solução (itens incluídos/excluídos).
    :param weights: Lista de pesos dos itens.

    :return: O peso total da solução.
    """
    total_weight = sum(solution[i] * weights[i] for i in range(len(solution)))
    return total_weight

# SLOPE CLIMBING SUCCESSORS FUNCTION
def successors(current_solution, current_value, max_weight, weights, costs):
    """
    Gera e avalia soluções sucessoras para o problema da mochila.

    :param current_solution: Lista de 0s e 1s representando a solução atual (itens incluídos/excluídos).
    :param current_value: Valor atual da solução.
    :param max_weight: Peso máximo permitido.
    :param weights: Lista de pesos dos itens.
    :param costs: Lista de custos dos itens.
    :return: Lista com uma solução melhorada.
    """
    logging.debug(f"Starting successors with current_solution={current_solution}, current_value={current_value}, max_weight={max_weight}")
    qs = 2 * len(current_solution)  
    p = 0
    best_successor = current_solution[:]
    best_value = current_value
    total_weight = evaluate_weight(current_solution, weights)
    logging.debug(f"Initial total_weight={total_weight}")

    for it in range(qs):
        aux = current_solution[:]
        current_value = evaluate_solution(aux, weights, costs)
        logging.debug(f"Iteration {it}: aux={aux}, current_value={current_value}")
        
        if sum(aux) == 0:
            logging.debug("No items included in solution, skipping iteration.")
            continue
        
        while True:
            p = random.randint(0, len(aux) - 1)
            if (aux[p] == 1):
                aux[p] = 0  # Reverte a troca se o item foi adicionado
                current_value = evaluate_solution(aux, weights, costs)
                logging.debug(f"Removed item {p}: aux={aux}, current_value={current_value}")
                break
        k = p + 1
        for j in range(len(aux)):
            if k >= len(aux):
                k = 0
            aux[k] = 1
            current_value = evaluate_solution(aux, weights, costs)
            total_weight = evaluate_weight(aux, weights)
            logging.debug(f"Trying to add item {k}: aux={aux}, current_value={current_value}, total_weight={total_weight}")
            if (total_weight > max_weight):
                aux[k] = 0
                logging.debug(f"Exceeded max_weight after adding item {k}, reverting.")
            k += 1
        current_value = evaluate_solution(aux, weights, costs)
        total_weight = evaluate_weight(aux, weights)
        logging.debug(f"End of iteration {it}: aux={aux}, current_value={current_value}, total_weight={total_weight}")
        if (total_weight <= max_weight and best_value > current_value):
            best_successor = aux[:]
            best_value = current_value
            logging.debug(f"New best_successor found: {best_successor}, best_value={best_value}")
            
    logging.debug(f"Returning best_successor={best_successor}, best_value={best_value}")
    return best_successor, best_value

# SLOPE CLIMBING METHOD
def slope_climbing_method(solutions, current_values, weights, costs, max_weights):
    """
    Executa a subida de encosta para um problema de mochila múltipla.
    
    :param current_values: Lista de valores de cada solução.
    :param max_weights: Lista de máximo de peso para cada mochila.
    :param weights: Lista de listas de pesos dos itens para cada mochila.
    :param costs: Lista de listas de custos dos itens para cada mochila.
    :param solutions: Lista de soluções iniciais para cada mochila.
    :return: A list of solutions for each knapsack.
    """
    logging.debug("Starting slope_climbing_method")
    for i in range(len(solutions)):
        current_value = current_values[i]
        current_solution = solutions[i]
        logging.debug(f"Knapsack {i}: Initial solution={current_solution}, value={current_value}")
        improved = True
        iteration = 0
        while improved:
            improved = False
            best_successor, best_value = successors(
                current_solution=current_solution,
                current_value=current_value,
                max_weight=max_weights[i],
                weights=weights[i],
                costs=costs[i]
            )
            logging.debug(f"Knapsack {i}, Iteration {iteration}: best_successor={best_successor}, best_value={best_value}")
            if best_value < current_value:
                logging.debug(f"Knapsack {i}, Iteration {iteration}: Improvement found! Updating solution.")
                current_solution = best_successor
                current_value = best_value
                improved = True
            iteration += 1
        solutions[i] = current_solution
        current_values[i] = current_value
        logging.debug(f"Knapsack {i}: Final solution={current_solution}, value={current_value}")
    logging.debug("Finished slope_climbing_method")
    return solutions, current_values

# SLOPE CLIMB WITH TRY AGAIN
def slope_climb_try_again_method(solutions, current_values, weights, costs, max_weights, Tmax=10):
    """
    Executa a subida de encosta com lógica de tentativa e erro para um problema de mochila múltipla.

    :param Tmax: Máximo de tentativas para melhorar a solução (default é 10).
    :param current_costs: Lista de custos atuais para cada mochila.
    :param current_weights: Lista de pesos atuais para cada mochila.
    :param max_weights: Lista de máximo de peso para cada mochila.
    :param weights: Lista de listas de pesos dos itens para cada mochila.
    :param costs: Lista de listas de custos dos itens para cada mochila.
    :param solutions: Lista de soluções iniciais para cada mochila.
    :return: Lista de soluções para cada mochila, custos atuais e pesos atuais.
    """
    logging.debug("Starting slope_climb_try_again_method")
    for i in range(len(solutions)):
        current_value = current_values[i]
        current_solution = solutions[i]
        logging.debug(f"Knapsack {i}: Initial solution={current_solution}, value={current_value}")
        improved = True
        T = 1  # Inicializa o contador de tentativas
        iteration = 0
        while improved:
            logging.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: Calling successors")
            best_successor, best_value = successors(
                current_solution=current_solution,
                current_value=current_value,
                max_weight=max_weights[i],
                weights=weights[i],
                costs=costs[i]
            )
            logging.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: best_successor={best_successor}, best_value={best_value}")
            if best_value < current_value:
                logging.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: Improvement found! Updating solution.")
                current_solution = best_successor
                current_value = best_value
                T = 1  # Reinicia o contador de tentativas
            else:
                T += 1  # Incrementa o contador de tentativas
                logging.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: No improvement. T={T}")
                if T > Tmax:
                    logging.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: Tmax reached. Stopping.")
                    improved = False  # Para a execução se o número máximo de tentativas for atingido
            iteration += 1
        solutions[i] = current_solution
        current_values[i] = current_value
        logging.debug(f"Knapsack {i}: Final solution={current_solution}, value={current_value}")
    logging.debug("Finished slope_climb_try_again_method")
    return solutions, current_values 

# TEMPERATURE METHOD
def tempera(solution, weights, costs, va, max_weight, ti=10, tf=0.1, fr=0.95, Tmax=10):
    """
    :param solution: Lista de 0s e 1s representando a solução atual (itens incluídos/excluídos).
    :param weight: Peso total da solução atual.
    :param cost: Custo total da solução atual.
    :param ti: Temperatura inicial.
    :param tf: Temperatura final.
    :param fr: Fator de resfriamento/redutor.
    :param va: Valor atual da solução.
    :param max_weight: Peso máximo permitido.
    :return: Uma nova solução e o custo dessa solução após o processo de resfriamento.
    """
    logging.debug(f"Starting tempera with solution={solution}, weights={weights}, costs={costs}, va={va}, max_weight={max_weight}, ti={ti}, tf={tf}, fr={fr}")
    current_solution = solution[:]
    t = ti
    iteration = 0
    while t > tf:
        logging.debug(f"Iteration {iteration}: t={t}, current_solution={current_solution}, va={va}")
        novo, vn = successor(solution=current_solution, max_weight=max_weight, weights=weights, costs=costs)
        de = va - vn
        logging.debug(f"Iteration {iteration}: novo={novo}, vn={vn}, de={de}")
        if de < 0:
            logging.debug(f"Iteration {iteration}: Accepting better solution.")
            current_solution = novo[:]
            va = vn
        else:
            prob = random.uniform(0,1)
            aux = math.exp(-de/t)
            logging.debug(f"Iteration {iteration}: prob={prob}, aux={aux}")
            if prob < aux:
                logging.debug(f"Iteration {iteration}: Accepting worse solution by probability.")
                current_solution = novo[:]
                va = vn
        t = t * fr
        iteration += 1
    logging.debug(f"Finished tempera: final_solution={current_solution}, final_value={va}")
    return current_solution, va 

# TEMPERATURE METHOD SUCCESSOR
def successor(solution, max_weight, weights, costs):
    """
    Gera um sucessor para a solução atual do problema da mochila.

    :param solution: Lista de 0s e 1s representando a solução atual (itens incluídos/excluídos).
    :param max_weight: Peso máximo permitido.
    :param weights: Lista de pesos dos itens.
    :param costs: Lista de custos dos itens.
    :return: Uma nova solução (sucessor) e o valor dessa solução.
    """
    logging.debug(f"Generating successor for solution={solution}, weights={weights}, costs={costs}, max_weight={max_weight}")
    new = solution[:]
    p = random.randint(0, len(solution)-1)
    new[p] = 1 - new[p]  # Flip the bit (0 -> 1 or 1 -> 0)
    logging.debug(f"Flipped position {p}: new={new}")

    total_weight = evaluate_weight(new, weights)
    if total_weight > max_weight:
        logging.debug(f"Exceeded max_weight after flipping item {p}, reverting.")
        new[p] = solution[p]  # Reverte a mudança

    current_value = evaluate_solution(new, weights, costs)
    logging.debug(f"Successor evaluated: new={new}, current_value={current_value}")
    return new, current_value
