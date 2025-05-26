import service

def test_generate_knapsack_problem():
    n = [3, 4]
    min_weight = 1
    max_weight = 10
    max_weights = [15, 20]
    weights, costs = service.generate_knapsack_problem(n, min_weight, max_weight, max_weights)
    assert len(weights) == len(n)
    assert len(costs) == len(n)
    for i in range(len(n)):
        assert len(weights[i]) == n[i]
        assert len(costs[i]) == n[i]
        assert sum(weights[i]) <= max_weights[i]
    
def test_initial_solution():
    n = [3, 4]
    max_weights = [10, 15]
    weights = [[2, 5, 8], [3, 6, 9, 12]]
    solutions = service.generate_initial_solution(n, max_weights, weights)
    assert len(solutions) == len(n)
    for i in range(len(n)):
        assert len(solutions[i]) == len(weights[i])
        assert sum(solutions[i]) <= max_weights[i]

def test_evaluate_solution():
    solution = [1, 0, 1]
    weights = [2, 5, 8]
    costs = [10, 20, 15]
    cost, weight = service.evaluate_solution(solution, weights, costs)
    assert cost == 25
    assert weight == 10
    
def test_successors():
    n = [3, 4, 3]
    solutions = [[1, 0, 1], [0, 1, 0, 1], [1, 1, 0]]
    weights = [[2, 5, 8], [3, 6, 9, 2], [4, 7, 10]]
    costs = [[10, 20, 15], [30, 40, 50, 60], [60, 70, 80]]
    max_weights = [10, 15, 20]
    for i in range(len(solutions)):
        actual_solution = solutions[i]
        actual_cost = sum([a * b for a, b in zip(actual_solution, costs[i])])
        succ = service.successors(
            actual_solution=actual_solution,
            actual_cost=actual_cost,
            max_weight=max_weights[i],
            n=n[i],
            weights=weights[i],
            costs=costs[i]
            
        )
        for s in succ:
            assert sum([a * b for a, b in zip(s['solution'], weights[i])]) <= max_weights[i]
            assert sum([a * b for a, b in zip(s['solution'], costs[i])]) == s['cost']
            assert len(s['solution']) == n[i]
            assert s['cost'] > actual_cost

# def test_slope_climbing_method():
    # n = [3, 4]
    # max_weights = [10, 15]
    # weights = [[2, 5, 8], [3, 6, 9, 2]]
    # costs = [[10, 20, 15], [30, 40, 50, 60]]
    # initial_solution = [[1, 0, 1], [0, 1, 0, 1]]
    
    # solutions, current_costs, current_weights = service.slope_climbing_method(
    #     n=n,
    #     max_weights=max_weights,
    #     weights=weights,
    #     costs=costs,
    #     solutions=initial_solution
    # )
    # assert len(solutions) == len(n)
    # for i in range(len(n)):
    #     assert len(solutions[i]) == len(weights[i])
    #     assert sum([a * b for a, b in zip(solutions[i], weights[i])]) <= max_weights[i]
    #     # The cost should not decrease
    #     assert current_costs[i] >= sum([a * b for a, b in zip(initial_solution[i], costs[i])])