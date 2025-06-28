import React, { useState } from 'react';
import { GAReportData, MethodResult, ProblemConfig, ReportTab } from '../types';
import { ConfigurationPanel } from '../components/ConfigurationPanel';
import { BasicMethodsReport } from '../components/BasicMethodsReport';
import { GeneticAlgorithmsReport } from '../components/GeneticAlgorithmsReport';
import { ComparisonReport } from '../components/ComparisonReport';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReportsViewProps {
  loading: boolean;
  hasResults: boolean;
  config: ProblemConfig;
  methodResults: MethodResult[];
  gaReportData: GAReportData | null;
  onConfigChange: (field: keyof ProblemConfig, value: string | number) => void;
  onRunExperiments: () => Promise<void>;
  onRunAllMethods: () => Promise<void>;
  onRunGeneticAlgorithm: () => Promise<void>;
  onExportReport: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  loading,
  config,
  methodResults,
  hasResults,
  gaReportData,
  onConfigChange,
  onRunExperiments,
  onRunAllMethods,
  onRunGeneticAlgorithm,
  onExportReport,
}) => {
  const [activeTab, setActiveTab] = useState<ReportTab>('genetic');

  const tabs = [
    { id: 'basic' as ReportTab, label: 'Métodos Básicos', icon: '📈' },
    { id: 'genetic' as ReportTab, label: 'Algoritmos Genéticos', icon: '🧬' },
    { id: 'comparison' as ReportTab, label: 'Comparação', icon: '📊' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Relatórios de Experimentos
          </h1>
          <p className="text-gray-600">
            Análise comparativa de algoritmos de otimização para problemas da
            mochila
          </p>
        </div>

        {/* Configuration Panel */}
        <div className="mb-6">
          <ConfigurationPanel
            loading={loading}
            config={config}
            onConfigChange={onConfigChange}
            onRunExperiments={onRunExperiments}
            onRunAllMethods={onRunAllMethods}
          />
          {/* Export Button */}
          <div className="!py-2 !my-4 bg-gray-50 border-y !px-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {hasResults || gaReportData
                  ? 'Dados disponíveis para exportação'
                  : 'Execute experimentos para gerar relatórios'}
              </div>
              <Button
                onClick={onExportReport}
                disabled={!hasResults && !gaReportData}
                variant="outline"
                className="flex items-center space-x-2 !px-6"
              >
                <span>📄</span>
                <span>Exportar Relatório</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Card className="mb-6 !gap-0">
          <div className="border-b border-gray-200 flex items-center justify-between">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors !px-6 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'basic' && (
              <div style={{ padding: '0 20px' }}>
                {hasResults ? (
                  <BasicMethodsReport methodResults={methodResults} />
                ) : (
                  <Card className="p-8 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📈</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum resultado de métodos básicos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Execute os experimentos com métodos básicos para
                      visualizar os resultados
                    </p>
                    <Button onClick={onRunExperiments} disabled={loading}>
                      {loading ? 'Executando...' : 'Executar Métodos Básicos'}
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'genetic' && (
              <GeneticAlgorithmsReport
                loading={loading}
                reportData={gaReportData}
                onGenerateReport={onRunGeneticAlgorithm}
              />
            )}

            {activeTab === 'comparison' && (
              <div>
                {hasResults && gaReportData ? (
                  <ComparisonReport
                    methodResults={methodResults}
                    gaReportData={gaReportData}
                  />
                ) : (
                  <Card className="p-8 text-center" style={{ padding: '20px' }}>
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Dados insuficientes para comparação
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Execute tanto os métodos básicos quanto os algoritmos
                      genéticos para comparar os resultados
                    </p>
                    <div className="flex space-x-4 justify-center gap-6">
                      <Button
                        onClick={onRunExperiments}
                        disabled={loading}
                        className="!px-6"
                      >
                        Métodos Básicos
                      </Button>
                      <Button
                        onClick={onRunGeneticAlgorithm}
                        disabled={loading}
                        className="!px-6"
                      >
                        Algoritmos Genéticos
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
