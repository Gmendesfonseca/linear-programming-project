export const ProblemDisplaySection = ({
  knapsackProblem,
  initialSolution,
  currentValues,
  knapsacksLengths,
}) => {
  return (
    <div className="bg-white p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Dados do Problema</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Custos</h3>
          <div className="bg-gray-50 p-3 rounded max-h-48 overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(knapsackProblem.costs, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Pesos</h3>
          <div className="bg-gray-50 p-3 rounded max-h-48 overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(knapsackProblem.weights, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">
            Tamanhos das Mochilas
          </h3>
          <div className="bg-gray-50 p-3 rounded">
            <pre className="text-sm">
              {JSON.stringify(knapsacksLengths, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-2">Solução Inicial</h3>
          <div className="bg-gray-50 p-3 rounded max-h-48 overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(initialSolution, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-medium text-gray-700 mb-2">Valores Iniciais</h3>
        <div className="bg-gray-50 p-3 rounded">
          <pre className="text-sm">
            {JSON.stringify(currentValues, null, 2)}
          </pre>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Valor Total Inicial:{' '}
          {currentValues.reduce((sum, val) => sum + val, 0)}
        </p>
      </div>
    </div>
  );
};
