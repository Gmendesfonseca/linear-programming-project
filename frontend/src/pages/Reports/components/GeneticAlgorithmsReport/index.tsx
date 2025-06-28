import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FC } from 'react';
import { GAReportData } from '../../types';

interface GeneticAlgorithmsReportProps {
  loading: boolean;
  reportData: GAReportData | null;
  onGenerateReport: () => void;
}

export const GeneticAlgorithmsReport: FC<GeneticAlgorithmsReportProps> = ({
  loading,
  reportData,
  onGenerateReport,
}) => {
  const formatNumber = (num: number) => num.toFixed(2);

  return (
    <div className="space-y-6 !px-4">
      <div className="flex justify-between items-center !my-4">
        <h2 className="text-2xl font-bold">
          Relatório de Algoritmos Genéticos
        </h2>
      </div>

      {loading && (
        <div className="text-center !py-8 justify-center align-items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">
            Executando experimentos com AG...
          </p>
        </div>
      )}

      {reportData && reportData.summary && reportData.bestConfiguration && (
        <div className="space-y-6">
          {/* Summary */}
          <Card className="p-4 bg-blue-50">
            <h3 className="text-lg font-semibold mb-2">Resumo Executivo</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total de Configurações</p>
                <p className="text-xl font-bold">
                  {reportData.summary.totalExperiments || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Melhor Valor Geral</p>
                <p className="text-xl font-bold">
                  {reportData.summary.bestOverallValue
                    ? formatNumber(reportData.summary.bestOverallValue)
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Melhoria Média</p>
                <p className="text-xl font-bold">
                  {reportData.summary.averageImprovement
                    ? formatNumber(reportData.summary.averageImprovement)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          {/* Best Configuration */}
          <Card className="p-4 bg-green-50">
            <h3 className="text-lg font-semibold mb-2">Melhor Configuração</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>População:</strong>{' '}
                  {reportData.bestConfiguration.population_size || 'N/A'}
                </p>
                <p>
                  <strong>Gerações:</strong>{' '}
                  {reportData.bestConfiguration.generations || 'N/A'}
                </p>
                <p>
                  <strong>Taxa de Cruzamento:</strong>{' '}
                  {reportData.bestConfiguration.cross_over_rate || 'N/A'}
                </p>
              </div>
              <div>
                <p>
                  <strong>Taxa de Mutação:</strong>{' '}
                  {reportData.bestConfiguration.mutation_rate || 'N/A'}
                </p>
                <p>
                  <strong>Elite:</strong>{' '}
                  {reportData.bestConfiguration.keep_individuals || 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          {/* Detailed Results Table */}
          {reportData.experiments && reportData.experiments.length > 0 && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Resultados Detalhados
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">
                        Config
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        População
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Gerações
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Cruzamento
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Mutação
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Elite
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Média
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Melhor
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Pior
                      </th>
                      <th className="border border-gray-300 p-2 text-center">
                        Desvio
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.experiments.map((experiment, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="border border-gray-300 p-2 font-medium">
                          #{index + 1}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {experiment.config?.population_size || 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {experiment.config?.generations || 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {experiment.config?.cross_over_rate || 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {experiment.config?.mutation_rate || 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {experiment.config?.keep_individuals || 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {experiment.averageValue
                            ? formatNumber(experiment.averageValue)
                            : 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center font-semibold text-green-600">
                          {experiment.bestValue
                            ? formatNumber(experiment.bestValue)
                            : 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {experiment.worstValue
                            ? formatNumber(experiment.worstValue)
                            : 'N/A'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center">
                          {experiment.standardDeviation
                            ? formatNumber(experiment.standardDeviation)
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Analysis */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Análise dos Resultados
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Impacto dos Parâmetros:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    <strong>População:</strong> Populações maiores tendem a
                    encontrar melhores soluções, mas com maior custo
                    computacional.
                  </li>
                  <li>
                    <strong>Gerações:</strong> Mais gerações permitem maior
                    refinamento das soluções.
                  </li>
                  <li>
                    <strong>Taxa de Cruzamento:</strong> Valores entre 0.7-0.9
                    mostraram melhor desempenho.
                  </li>
                  <li>
                    <strong>Taxa de Mutação:</strong> Valores baixos (0.01-0.05)
                    evitam convergência prematura.
                  </li>
                  <li>
                    <strong>Elite:</strong> Manter 10-30% dos melhores
                    indivíduos acelera a convergência.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Recomendações:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Use a configuração #
                    {reportData.experiments && reportData.experiments.length > 0
                      ? reportData.experiments.findIndex(
                          (exp) =>
                            exp.config &&
                            JSON.stringify(exp.config) ===
                              JSON.stringify(reportData.bestConfiguration),
                        ) + 1
                      : 'N/A'}{' '}
                    para obter os melhores resultados.
                  </li>
                  <li>
                    Para problemas maiores, considere aumentar a população e o
                    número de gerações.
                  </li>
                  <li>
                    Monitore a convergência para ajustar os parâmetros
                    dinamicamente.
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Comparison Analysis */}
          {reportData.comparisonAnalysis && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Análise Comparativa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">População:</h4>
                  <p className="text-sm">
                    {reportData.comparisonAnalysis.populationImpact}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Gerações:</h4>
                  <p className="text-sm">
                    {reportData.comparisonAnalysis.generationImpact}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cruzamento:</h4>
                  <p className="text-sm">
                    {reportData.comparisonAnalysis.crossoverImpact}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Mutação:</h4>
                  <p className="text-sm">
                    {reportData.comparisonAnalysis.mutationImpact}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Elite:</h4>
                  <p className="text-sm">
                    {reportData.comparisonAnalysis.eliteImpact}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !reportData && (
        <div className="p-8 text-center" style={{ padding: '20px' }}>
          <div className="text-gray-400 text-6xl mb-4">🧬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum relatório de AG disponível
          </h3>
          <p className="text-gray-600 mb-4">
            Execute os experimentos com algoritmos genéticos para visualizar os
            resultados
          </p>
          <Button
            onClick={onGenerateReport}
            disabled={loading}
            className="!px-4 !mt-2"
          >
            Gerar Relatório de AG
          </Button>
        </div>
      )}

      {/* Partial Data State */}
      {!loading &&
        reportData &&
        (!reportData.bestConfiguration || !reportData.summary) && (
          <Card
            className="p-6 bg-yellow-50 border-yellow-200"
            style={{ padding: '20px' }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-yellow-600">⚠️</span>
              <h3 className="text-lg font-medium text-yellow-800">
                Dados incompletos
              </h3>
            </div>
            <p className="text-yellow-700 text-sm">
              Os dados do relatório estão incompletos. Tente executar os
              experimentos novamente.
            </p>
            <Button
              onClick={onGenerateReport}
              disabled={loading}
              className="mt-3"
              variant="outline"
            >
              Executar Novamente
            </Button>
          </Card>
        )}
    </div>
  );
};
