export const ResultsSection = ({
  result,
  calculateBestValue,
  calculateTotalValue,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        Resultado do Algoritmo Genético
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700 mb-2">
            Soluções Encontradas
          </h3>
          <div className="bg-gray-50 p-3 rounded max-h-48 overflow-auto">
            <div className="space-y-2">
              {result.solutions.map((solution, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="text-sm font-medium">Mochila {index + 1}:</p>
                  <p className="text-xs text-gray-600">
                    Solução Inicial: [{solution.initial_solution.join(', ')}]
                    (Valor: {solution.initial_value})
                  </p>
                  <p className="text-xs text-gray-600">
                    Solução Final: [{solution.final_solution.join(', ')}]
                    (Valor: {solution.final_value})
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Melhoria: {solution.final_value - solution.initial_value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result.analysis && (
          <div>
            <h3 className="font-medium text-gray-700 mb-2">
              Análise Comparativa
            </h3>
            <div className="bg-gray-50 p-3 rounded max-h-64 overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">População</th>
                    <th className="text-left py-2">Taxa Cruzamento</th>
                    <th className="text-left py-2">Taxa Mutação</th>
                    <th className="text-left py-2">Gerações</th>
                    <th className="text-left py-2">Melhor Valor</th>
                    <th className="text-left py-2">Valor Total</th>
                    <th className="text-left py-2">Melhoria</th>
                  </tr>
                </thead>
                <tbody>
                  {result.analysis.map((item, index) => {
                    const initialTotal = item.result.solutions.reduce(
                      (sum, sol) => sum + sol.initial_value,
                      0,
                    );
                    const finalTotal = calculateTotalValue(
                      item.result.solutions,
                    );
                    const improvement = finalTotal - initialTotal;

                    return (
                      <tr key={index} className="border-b">
                        <td className="py-2">{item.config.populationSize}</td>
                        <td className="py-2">{item.config.crossoverRate}</td>
                        <td className="py-2">{item.config.mutationRate}</td>
                        <td className="py-2">{item.config.generations}</td>
                        <td className="py-2">
                          {calculateBestValue(item.result.solutions)}
                        </td>
                        <td className="py-2">{finalTotal}</td>
                        <td className="py-2 text-green-600 font-medium">
                          +{improvement}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h3 className="font-medium text-blue-800 mb-2">Estatísticas</h3>
          <p className="text-sm text-blue-700">
            Valor Total: {calculateTotalValue(result.solutions)}
          </p>
          <p className="text-sm text-blue-700">
            Melhor Valor: {calculateBestValue(result.solutions)}
          </p>
          <p className="text-sm text-blue-700">
            Número de Mochilas: {result.solutions.length}
          </p>
          <p className="text-sm text-blue-700">
            Melhoria Média:{' '}
            {(
              result.solutions.reduce(
                (sum, sol) => sum + (sol.final_value - sol.initial_value),
                0,
              ) / result.solutions.length
            ).toFixed(2)}
          </p>
          <p className="text-sm text-blue-700">
            Valor Inicial Total:{' '}
            {result.solutions.reduce((sum, sol) => sum + sol.initial_value, 0)}
          </p>
          <p className="text-sm text-green-700 font-medium">
            Melhoria Total: +
            {result.solutions.reduce(
              (sum, sol) => sum + (sol.final_value - sol.initial_value),
              0,
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
