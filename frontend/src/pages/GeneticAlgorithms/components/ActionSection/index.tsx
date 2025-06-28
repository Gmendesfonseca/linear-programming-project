import { Button } from '@/components/ui/button';
import { CardAction } from '@/components/ui/card';

export const ActionSection = ({
  generateProblem,
  isGeneratingProblem,
  executeAG,
  analyzeAG,
  isLoading,
  problemGenerated,
}) => {
  return (
    <CardAction>
      <h2 className="text-xl font-semibold mb-4">Ações</h2>

      <div className="flex flex-wrap gap-4">
        <Button
          onClick={generateProblem}
          disabled={isGeneratingProblem}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGeneratingProblem ? 'Gerando...' : 'Gerar Problema'}
        </Button>

        <Button
          onClick={executeAG}
          disabled={isLoading || !problemGenerated}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Executando...' : 'Executar AG'}
        </Button>

        <Button
          onClick={analyzeAG}
          disabled={isLoading || !problemGenerated}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analisando...' : 'Analisar AG'}
        </Button>
      </div>
    </CardAction>
  );
};
