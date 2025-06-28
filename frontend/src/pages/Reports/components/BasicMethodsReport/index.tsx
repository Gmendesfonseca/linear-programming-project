import { Card } from '@/components/ui/card';
import { MethodResult } from '../../types';

interface ResultsDisplayProps {
  methodResults: MethodResult[];
}

export const BasicMethodsReport: React.FC<ResultsDisplayProps> = ({
  methodResults,
}) => {
  const formatNumber = (num: number) => num.toFixed(2);

  const validResults = methodResults.filter(
    (method) => !Object.values(method.stats).every((value) => value === 0),
  );

  if (validResults.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-gray-400 text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum resultado disponível
        </h3>
        <p className="text-gray-600">
          Execute os experimentos para visualizar os resultados
        </p>
      </Card>
    );
  }

  const bestMethod = validResults.reduce((best, current) =>
    current.stats.avg > best.stats.avg ? current : best,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 !my-6">
          Resultados dos Métodos Básicos
        </h2>
        <div className="text-sm text-gray-500">
          🏆 Melhor: {bestMethod.name}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card
          className="p-4 bg-blue-50"
          style={{ padding: '20px', marginBottom: '20px' }}
        >
          <h3 className="font-semibold text-blue-800 mb-1">Métodos Testados</h3>
          <p className="text-2xl font-bold text-blue-600">
            {validResults.length}
          </p>
        </Card>

        <Card
          className="p-4 bg-green-50"
          style={{ padding: '20px', marginBottom: '20px' }}
        >
          <h3 className="font-semibold text-green-800 mb-1">
            Melhor Resultado
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {formatNumber(bestMethod.stats.max)}
          </p>
        </Card>

        <Card
          className="p-4 bg-purple-50"
          style={{ padding: '20px', marginBottom: '20px' }}
        >
          <h3 className="font-semibold text-purple-800 mb-1">Media Geral</h3>
          <p className="text-2xl font-bold text-purple-600">
            {formatNumber(
              validResults.reduce((sum, method) => sum + method.stats.avg, 0) /
                validResults.length,
            )}
          </p>
        </Card>
      </div>

      {/* Detailed Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold">
                Método
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold">
                Mínimo
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold">
                Máximo
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold">
                Média
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold">
                Desvio Padrão
              </th>
              <th className="border border-gray-300 p-3 text-center font-semibold">
                Performance
              </th>
            </tr>
          </thead>
          <tbody>
            {validResults.map((method, index) => (
              <tr
                key={method.name}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${
                  method.name === bestMethod.name
                    ? 'ring-2 ring-green-200 bg-green-50'
                    : ''
                }`}
              >
                <td className="border border-gray-300 p-3 font-medium">
                  <div className="flex items-center space-x-2">
                    <span>{method.name}</span>
                    {method.name === bestMethod.name && (
                      <span className="text-green-600 text-sm">🏆</span>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {formatNumber(method.stats.min)}
                </td>
                <td className="border border-gray-300 p-3 text-center font-semibold text-green-600">
                  {formatNumber(method.stats.max)}
                </td>
                <td className="border border-gray-300 p-3 text-center font-medium">
                  {formatNumber(method.stats.avg)}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {formatNumber(method.stats.std)}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        method.name === bestMethod.name
                          ? 'bg-green-600'
                          : 'bg-blue-600'
                      }`}
                      style={{
                        width: `${
                          (method.stats.avg / bestMethod.stats.avg) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {((method.stats.avg / bestMethod.stats.avg) * 100).toFixed(
                      0,
                    )}
                    %
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analysis */}
      <Card
        className="!mt-6 p-4 bg-gray-50"
        style={{ padding: '20px', marginBottom: '20px' }}
      >
        <h3 className="font-semibold mb-2">Análise dos Resultados</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            • <strong>Melhor método:</strong> {bestMethod.name} com média de{' '}
            {formatNumber(bestMethod.stats.avg)}
          </p>
          <p>
            • <strong>Maior variabilidade:</strong>{' '}
            {
              validResults.reduce((max, method) =>
                method.stats.std > max.stats.std ? method : max,
              ).name
            }{' '}
            (maior desvio padrão)
          </p>
          <p>
            • <strong>Mais consistente:</strong>{' '}
            {
              validResults.reduce((min, method) =>
                method.stats.std < min.stats.std ? method : min,
              ).name
            }{' '}
            (menor desvio padrão)
          </p>
        </div>
      </Card>
    </div>
  );
};
