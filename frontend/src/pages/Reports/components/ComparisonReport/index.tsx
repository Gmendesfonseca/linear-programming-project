import { FC } from 'react';
import { GAReportData, MethodResult } from '../../types';
import { Card } from '@/components/ui/card';

export const ComparisonReport: FC<{
  methodResults: MethodResult[];
  gaReportData: GAReportData;
}> = ({ methodResults, gaReportData }) => {
  const bestGA = gaReportData.experiments.reduce((best, current) =>
    current.averageValue > best.averageValue ? current : best,
  );

  const bestBasic = methodResults.reduce((best, current) =>
    current.stats.avg > best.stats.avg ? current : best,
  );

  return (
    <div className="space-y-6">
      <Card style={{ padding: '20px', marginBottom: '20px' }}>
        <h2 className="text-2xl font-bold mb-4">Comparação de Desempenho</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4 bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-2">
              Melhor Método Básico
            </h3>
            <p className="text-xl font-bold text-blue-600">{bestBasic.name}</p>
            <p className="text-sm text-gray-600">
              Média: {bestBasic.stats.avg.toFixed(2)}
            </p>
          </Card>

          <Card className="p-4 bg-green-50">
            <h3 className="font-semibold text-green-800 mb-2">
              Melhor Algoritmo Genético
            </h3>
            <p className="text-sm text-gray-600">
              Pop: {bestGA.config.population_size} | Gen:{' '}
              {bestGA.config.generations}
            </p>
            <p className="text-sm text-gray-600">
              Média: {bestGA.averageValue.toFixed(2)}
            </p>
          </Card>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Método</th>
                <th className="border border-gray-300 p-3 text-center">
                  Média
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  Melhor
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  Desvio
                </th>
                <th className="border border-gray-300 p-3 text-center">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {methodResults.map((method, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="border border-gray-300 p-3 font-medium">
                    {method.name}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {method.stats.avg.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {method.stats.max.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    {method.stats.std.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (method.stats.avg / bestBasic.stats.avg) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-green-50 font-semibold">
                <td className="border border-gray-300 p-3">Melhor AG</td>
                <td className="border border-gray-300 p-3 text-center">
                  {bestGA.averageValue.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {bestGA.bestValue.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  {bestGA.standardDeviation.toFixed(2)}
                </td>
                <td className="border border-gray-300 p-3 text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (bestGA.averageValue /
                            Math.max(
                              bestBasic.stats.avg,
                              bestGA.averageValue,
                            )) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 className="text-lg font-semibold mb-4">Análise Comparativa</h3>
        <div className="space-y-3 text-sm">
          <p>
            <strong>Vencedor Geral:</strong>{' '}
            {bestGA.averageValue > bestBasic.stats.avg
              ? 'Algoritmo Genético'
              : `Método Básico (${bestBasic.name})`}
          </p>
          <p>
            <strong>Diferença de Performance:</strong>{' '}
            {Math.abs(bestGA.averageValue - bestBasic.stats.avg).toFixed(2)} (
            {(
              (Math.max(bestGA.averageValue, bestBasic.stats.avg) /
                Math.min(bestGA.averageValue, bestBasic.stats.avg) -
                1) *
              100
            ).toFixed(1)}
            % melhor)
          </p>
          <p>
            <strong>Recomendação:</strong>{' '}
            {bestGA.averageValue > bestBasic.stats.avg
              ? 'Use algoritmos genéticos para problemas complexos com tempo disponível para otimização.'
              : 'Métodos básicos podem ser suficientes para este tipo de problema.'}
          </p>
        </div>
      </Card>
    </div>
  );
};
