import random as rd
import math
import logging as log
import numpy as np # type: ignore
from scipy.optimize import linprog # type: ignore

# SIMPLEX METHOD ---------------------------------------------------------------------
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

# GENERAL FUNCTIONS ------------------------------------------------------------------
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
            knapsack_weights.append(rd.randint(min_weight, max_weight))
            knapsack_costs.append(rd.randint(1, 100))

        weights.append(knapsack_weights)
        costs.append(knapsack_costs)

    return weights, costs
# ------------------------------------------------------------------------------------
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
        rd.shuffle(indices)
        for item in indices:
            if total_weight + weights[k][item] <= max_weights[k]:
                knapsack[item] = 1
                total_weight += weights[k][item]
        knapsack[item] = 0
        solutions.append(knapsack)

    return solutions
# ------------------------------------------------------------------------------------
def evaluate_solution(solution, weights, costs):
    """
    Avalia o custo total e o peso de uma solução para o problema da mochila.

    :param solution: Lista de 0s e 1s representando a solução (itens incluídos/excluídos).
    :param weights: Lista de pesos dos itens.
    :param costs: Lista de custos dos itens.

    :return: Uma tupla contendo o custo total e o peso total da solução.
    """
    total_cost = evaluate_array(solution, costs)
    total_weight = evaluate_array(solution, weights)
    current_value = total_cost / total_weight if total_weight > 0 else 0
    return current_value
# ------------------------------------------------------------------------------------
def evaluate_array(solution, values):
    """
    Avalia valor total de uma solução para o problema da mochila.

    :param solution: Lista de 0s e 1s representando a solução (itens incluídos/excluídos).
    :param values: Lista de itens para multiplicação.

    :return: O peso total da solução.
    """
    total = sum(solution[i] * values[i] for i in range(len(solution)))
    return total

# SLOPE CLIMBING ---------------------------------------------------------------------
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
    log.debug(f"Starting successors with current_solution={current_solution}, current_value={current_value}, max_weight={max_weight}")
    qs = 2 * len(current_solution)  
    p = 0
    best_successor = current_solution[:]
    best_value = current_value
    total_weight = evaluate_array(current_solution, weights)
    log.debug(f"Initial total_weight={total_weight}")

    for it in range(qs):
        aux = current_solution[:]
        current_value = evaluate_solution(aux, weights, costs)
        log.debug(f"Iteration {it}: aux={aux}, current_value={current_value}")
        
        if sum(aux) == 0:
            log.debug("No items included in solution, skipping iteration.")
            continue
        
        while True:
            p = rd.randint(0, len(aux) - 1)
            if (aux[p] == 1):
                aux[p] = 0  # Reverte a troca se o item foi adicionado
                current_value = evaluate_solution(aux, weights, costs)
                log.debug(f"Removed item {p}: aux={aux}, current_value={current_value}")
                break
        k = p + 1
        for j in range(len(aux)):
            if k >= len(aux):
                k = 0
            aux[k] = 1
            current_value = evaluate_solution(aux, weights, costs)
            total_weight = evaluate_array(aux, weights)
            log.debug(f"Trying to add item {k}: aux={aux}, current_value={current_value}, total_weight={total_weight}")
            if (total_weight > max_weight):
                aux[k] = 0
                log.debug(f"Exceeded max_weight after adding item {k}, reverting.")
            k += 1
        current_value = evaluate_solution(aux, weights, costs)
        total_weight = evaluate_array(aux, weights)
        log.debug(f"End of iteration {it}: aux={aux}, current_value={current_value}, total_weight={total_weight}")
        if (total_weight <= max_weight and best_value > current_value):
            best_successor = aux[:]
            best_value = current_value
            log.debug(f"New best_successor found: {best_successor}, best_value={best_value}")
            
    log.debug(f"Returning best_successor={best_successor}, best_value={best_value}")
    return best_successor, best_value
# ------------------------------------------------------------------------------------
def slope_climbing(solutions, current_values, weights, costs, max_weights):
    """
    Executa a subida de encosta para um problema de mochila múltipla.
    
    :param current_values: Lista de valores de cada solução.
    :param max_weights: Lista de máximo de peso para cada mochila.
    :param weights: Lista de listas de pesos dos itens para cada mochila.
    :param costs: Lista de listas de custos dos itens para cada mochila.
    :param solutions: Lista de soluções iniciais para cada mochila.
    
    :return: A list of solutions for each knapsack.
    """
    log.debug("Starting slope_climbing_method")
    for i in range(len(solutions)):
        current_value = current_values[i]
        current_solution = solutions[i]
        log.debug(f"Knapsack {i}: Initial solution={current_solution}, value={current_value}")
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
            log.debug(f"Knapsack {i}, Iteration {iteration}: best_successor={best_successor}, best_value={best_value}")
            if best_value < current_value:
                log.debug(f"Knapsack {i}, Iteration {iteration}: Improvement found! Updating solution.")
                current_solution = best_successor
                current_value = best_value
                improved = True
            iteration += 1
        solutions[i] = current_solution
        current_values[i] = current_value
        log.debug(f"Knapsack {i}: Final solution={current_solution}, value={current_value}")
    log.debug("Finished slope_climbing_method")
    return solutions, current_values
# ------------------------------------------------------------------------------------
def slope_climb_try_again(solutions, current_values, weights, costs, max_weights, Tmax=10):
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
    log.debug("Starting slope_climb_try_again_method")
    for i in range(len(solutions)):
        current_value = current_values[i]
        current_solution = solutions[i]
        log.debug(f"Knapsack {i}: Initial solution={current_solution}, value={current_value}")
        improved = True
        T = 1  # Inicializa o contador de tentativas
        iteration = 0
        while improved:
            log.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: Calling successors")
            best_successor, best_value = successors(
                current_solution=current_solution,
                current_value=current_value,
                max_weight=max_weights[i],
                weights=weights[i],
                costs=costs[i]
            )
            log.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: best_successor={best_successor}, best_value={best_value}")
            if best_value < current_value:
                log.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: Improvement found! Updating solution.")
                current_solution = best_successor
                current_value = best_value
                T = 1  # Reinicia o contador de tentativas
            else:
                T += 1  # Incrementa o contador de tentativas
                log.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: No improvement. T={T}")
                if T > Tmax:
                    log.debug(f"Knapsack {i}, Iteration {iteration}, Try {T}: Tmax reached. Stopping.")
                    improved = False  # Para a execução se o número máximo de tentativas for atingido
            iteration += 1
        solutions[i] = current_solution
        current_values[i] = current_value
        log.debug(f"Knapsack {i}: Final solution={current_solution}, value={current_value}")
    log.debug("Finished slope_climb_try_again_method")
    return solutions, current_values 

# TEMPERATURE METHOD -----------------------------------------------------------------
def tempera(solution, weights, costs, va, max_weight, ti=10, tf=0.1, fr=0.95):
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
    log.debug(f"Starting tempera with solution={solution}, weights={weights}, costs={costs}, va={va}, max_weight={max_weight}, ti={ti}, tf={tf}, fr={fr}")
    current_solution = solution[:]
    t = ti
    iteration = 0
    while t > tf:
        log.debug(f"Iteration {iteration}: t={t}, current_solution={current_solution}, va={va}")
        novo, vn = successor(solution=current_solution, max_weight=max_weight, weights=weights, costs=costs)
        de = va - vn
        log.debug(f"Iteration {iteration}: novo={novo}, vn={vn}, de={de}")
        if de < 0:
            log.debug(f"Iteration {iteration}: Accepting better solution.")
            current_solution = novo[:]
            va = vn
        else:
            prob = rd.uniform(0,1)
            aux = math.exp(-de/t)
            log.debug(f"Iteration {iteration}: prob={prob}, aux={aux}")
            if prob < aux:
                log.debug(f"Iteration {iteration}: Accepting worse solution by probability.")
                current_solution = novo[:]
                va = vn
        t = t * fr
        iteration += 1
    log.debug(f"Finished tempera: final_solution={current_solution}, final_value={va}")
    return current_solution, va 
# ------------------------------------------------------------------------------------
def successor(solution, max_weight, weights, costs):
    """
    Gera um sucessor para a solução atual do problema da mochila.

    :param solution: Lista de 0s e 1s representando a solução atual (itens incluídos/excluídos).
    :param max_weight: Peso máximo permitido.
    :param weights: Lista de pesos dos itens.
    :param costs: Lista de custos dos itens.
    
    :return: Uma nova solução (sucessor) e o valor dessa solução.
    """
    log.debug(f"Generating successor for solution={solution}, weights={weights}, costs={costs}, max_weight={max_weight}")
    new = solution[:]
    p = rd.randint(0, len(solution)-1)
    new[p] = 1 - new[p]  # Flip the bit (0 -> 1 or 1 -> 0)
    log.debug(f"Flipped position {p}: new={new}")

    total_weight = evaluate_array(new, weights)
    if total_weight > max_weight:
        log.debug(f"Exceeded max_weight after flipping item {p}, reverting.")
        new[p] = solution[p]  # Reverte a mudança

    current_value = evaluate_solution(new, weights, costs)
    log.debug(f"Successor evaluated: new={new}, current_value={current_value}")
    return new, current_value

# GENETIC ALGORITHM -----------------------------------------------------------------
def ordena(p, f):
    """ 
    Ordena a população e a aptidão de forma decrescente.
    
    :param p: População.
    :param f: Aptidão.
    
    :return: População e aptidão ordenadas.
    """
    aux = sorted(zip(p, f), key=lambda x: x[1], reverse=True) 
    p, f = zip(*aux)
    p = list(p)
    f = list(f)
    log.debug(f"População ordenada: {p}")
    log.debug(f"Aptidão ordenada: {f}")
    return p, f
#------------------------------------------------------------------------------------
def pop_ini(n, tp, vet, c_max):
    """
    Gera a população inicial aleatória para o algoritmo genético.
    
    :param n: Número de itens.
    :param tp: Tamanho da população.
    :param vet: Vetor de pesos dos itens.
    :param c_max: Peso máximo permitido.
    
    :return: População inicial como uma matriz de 0s e 1s.
    """
    pop = np.zeros((tp,n),int)
    for i in range(tp):
        v = 0
        c = 0
        while v <= c_max and c != n:
            j = rd.randrange(n)
            if pop[i][j] == 0:
                pop[i][j] = 1
                v += vet[j]
                c += 1
        if c != n:
            pop[i][j] = 0
    log.debug(f"População inicial gerada: {pop}")
    return pop
#------------------------------------------------------------------------------------
def aptidao(vet, p, tp, c_max, cost):
    """
    Calcula a aptidão de cada indivíduo na população.
    
    :param vet: Vetor de pesos dos itens.
    :param cost: Vetor de custos dos itens.
    :param p: População.
    :param tp: Tamanho da população.
    :param c_max: Peso máximo permitido.
    
    :return: Vetor de aptidão normalizado.
    """
    fit = np.zeros(tp,float)
    for i in range(tp):
        if fit[i] == c_max:
            fit[i] = c_max * 1000
        else:
            fit[i] = evaluate_solution(p[i],vet,cost)
    soma = sum(fit)
    log.debug(f"Aptidão bruta: {fit}")
    fit = fit / soma
    log.debug(f"Aptidão normalizada: {fit}")
    return fit
#------------------------------------------------------------------------------------
def roleta(fit, tp):
    """ 
    Seleciona um indivíduo da população usando o método da roleta.
    
    :param fit: Vetor de aptidão da população.
    :param tp: Tamanho da população.
    
    :return: Índice do indivíduo selecionado.
    """
    ale = rd.uniform(0, 1)
    ind = 0
    soma = fit[ind]
    while soma < ale and ind < tp - 1:
        ind += 1
        soma += fit[ind]
    log.debug(f"Selecionado por roleta: índice={ind}")
    return ind
#------------------------------------------------------------------------------------
def torneio(tp, fit):
    """
    Realiza um torneio entre dois indivíduos da população e retorna o vencedor.
    
    :param tp: Tamanho da população.
    :param fit: Vetor de aptidão da população.
    
    :return: Índice do indivíduo vencedor.
    """
    p1 = rd.randrange(tp)
    p2 = rd.randrange(tp)
    vencedor = p1 if fit[p1] > fit[p2] else p2
    log.debug(f"Torneio entre {p1} e {p2}, vencedor: {vencedor}")
    return vencedor
#------------------------------------------------------------------------------------
def cruzamento(p1, p2, ponto, n):
    """
    Realiza o cruzamento entre dois indivíduos da população.
    
    :param p1: Primeiro indivíduo.
    :param p2: Segundo indivíduo.
    :param ponto: Ponto de cruzamento.
    :param n: Tamanho do indivíduo.
    
    :return: Dois novos indivíduos gerados pelo cruzamento.
    """
    log.debug(f"Cruzamento no ponto {ponto} entre {p1} e {p2}")
    d1 = np.concatenate((p1[0:ponto], p2[ponto:n]))
    d2 = np.concatenate((p2[0:ponto], p1[ponto:n]))
    log.debug(f"Descendentes gerados: {d1}, {d2}")
    return d1, d2
#------------------------------------------------------------------------------------
def mutacao(d, n):
    """
    Realiza uma mutação simples em um indivíduo da população.
    
    :param d: Indivíduo a ser mutado.
    :param n: Tamanho do indivíduo.
    
    :return: Indivíduo mutado.
    """
    pos = rd.randrange(n)
    d[pos] = 1 - d[pos]
    log.debug(f"Mutação na posição {pos}: {d}")
    return d
#------------------------------------------------------------------------------------
def descendentes(n, pop, fit, tp, tc, tm):
    """
    Gera os descendentes da população atual usando cruzamento e mutação.
    
    :param n: Número de itens.
    :param pop: População atual.
    :param fit: Vetor de aptidão da população.
    :param tp: Tamanho da população.
    :param tc: Taxa de cruzamento.
    :param tm: Taxa de mutação.
    
    :return: Tupla contendo os descendentes e o número de descendentes gerados.
    """
    log.debug("Gerando descendentes.")
    qd = 3 * tp
    desc = np.zeros((qd, n), int)
    corte = rd.randint(0, n - 1)
    i = 0
    while i < qd - 1:
        p1 = pop[roleta(fit, tp)]
        p2 = pop[roleta(fit, tp)]
        if rd.uniform(0, 1) <= tc:
            desc[i], desc[i + 1] = cruzamento(p1, p2, corte, n)
        else:
            desc[i], desc[i + 1] = p1, p2
        if rd.uniform(0, 1) <= tm:
            desc[i] = mutacao(desc[i], n)
        if rd.uniform(0, 1) <= tm:
            desc[i + 1] = mutacao(desc[i + 1], n)
        i += 2
    log.debug(f"Descendentes gerados: {desc}")
    return desc, qd
#------------------------------------------------------------------------------------
def nova_pop(pop, desc, tp, ig):
    """
    Gera uma nova população combinando a população atual e os descendentes.
    
    :param pop: População atual.
    :param desc: Descendentes gerados.
    :param tp: Tamanho da população.
    :param ig: Proporção de indivíduos da população atual a serem mantidos (elite
    
    :return: Nova população combinada.
    """
    elite = math.ceil(ig * tp)
    log.debug(f"Gerando nova população. Elite: {elite}")
    for i in range(tp - elite):
        pop[i + elite] = desc[i]
    log.debug(f"Nova população: {pop}")
    return pop
#------------------------------------------------------------------------------------
def ajusta_restricao(n, vet, desc, qd, c_max, cost):
    """
    Ajusta as restrições de peso dos descendentes para garantir que não excedam o peso máximo permitido.
    
    :param n: Número de itens.
    :param cost: Vetor de custos dos itens.
    :param vet: Vetor de pesos dos itens.
    :param desc: Descendentes gerados.
    :param qd: Número de descendentes gerados.
    :param c_max: Peso máximo permitido.
    
    :return: Descendentes ajustados com restrições de peso atendidas.
    """
    log.debug("Ajustando restrições dos descendentes.")
    for i in range(qd):
        peso = evaluate_solution(desc[i], vet, cost)
        while peso > c_max:
            log.debug(f"Descendente {i} excedeu o peso máximo: {peso} > {c_max}. Ajustando...")
            j = rd.randrange(n)
            if desc[i][j] == 1:
                desc[i][j] = 0
                peso -= vet[j]
    log.debug(f"Descendentes ajustados: {desc}")
    return desc
#------------------------------------------------------------------------------------
def genetic_algorithm(length, weight, cost, max_weight, population_size, generations, cross_over_rate, mutation_rate, keep_individuals_rate):
    """
    Executa o algoritmo genético para resolver o problema da mochila.
    
    :param length: Número de itens.
    :param weight: Vetor de pesos dos itens.
    :param cost: Vetor de custos dos itens.
    :param max_weight: Peso máximo permitido.
    :param population_size: Tamanho da população.
    :param generations: Número de gerações.
    :param cross_over_rate: Taxa de cruzamento.
    :param mutation_rate: Taxa de mutação.
    :param keep_individuals_rate: Proporção de indivíduos da população atual a serem mantidos (elite).
    
    :return: Tupla contendo a solução inicial, solução final, valor da solução inicial e valor da solução final.
    """
    log.debug("Iniciando algoritmo genético.")
    pop = pop_ini(length, population_size, weight, max_weight)
    fit = aptidao(weight, pop, population_size, max_weight, cost)
    pop, fit = ordena(pop, fit)
    si = pop[0]
    log.debug(f"Solução inicial: {si}")
    for g in range(generations):
        log.debug(f"Geração {g}")
        desc, qd = descendentes(length, pop, fit, 
                                population_size, cross_over_rate, mutation_rate)
        desc = ajusta_restricao(length, weight, desc, qd, max_weight, cost)
        log.debug(f"Descendentes gerados: {desc}")
        
        fit_d = aptidao(weight, desc, qd, max_weight, cost)
        log.debug(f"Aptidão dos descendentes: {fit_d}")
        
        pop, fit = ordena(pop, fit)
        desc, fit_d = ordena(desc, fit_d)
        log.debug(f"População e descendentes ordenados.")
        
        pop = nova_pop(pop, desc, population_size, keep_individuals_rate)
        log.debug(f"Nova população gerada: {pop}")
        
        fit = aptidao(weight, pop, population_size, max_weight, cost)
        log.debug(f"Aptidão final: {fit}")
    
    pop, fit = ordena(pop, fit)
    sf = pop[0]
    log.debug(f"Solução final: {sf}")
    
    initial_value = evaluate_array(si, cost)
    final_value = evaluate_array(sf, cost)
    log.debug(f"Valor da solução inicial: {initial_value}, Valor da solução final: {final_value}")
    
    return si.tolist(), sf.tolist(), float(initial_value), float(final_value)