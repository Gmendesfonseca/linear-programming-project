import { useState } from 'react';
import { DataView } from '../../components/DataView';
import { MainLayout } from '../../components/MainLayout';
import { Methods } from '../../components/Methods';
import { ProblemDefinition } from '../../components/ProblemDefinition';
import {
  evaluateBagSolution,
  generateKnapsackProblem,
  initialBagSolution,
} from '../../service/requests';

const BasicMethods = () => {
  const methodOptions = [
    { value: 'method1', label: 'Método 1' },
    { value: 'method2', label: 'Método 2' },
    { value: 'method3', label: 'Método 3' },
  ];
  const [, setLoading] = useState(false);
  const [problemLength, setProblemLength] = useState(10);
  const [max, setMax] = useState(100);
  const [knapsackProblem, setKnapsackProblem] = useState([]);
  const [initialSolution, setInitialSolution] = useState([]);
  const [evaluateSolution, setEvaluationSolution] = useState({
    weight: 0,
    cost: 0,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    generateKnapsackProblem({
      n: problemLength,
      min: 1,
      max,
    }).then((response) => {
      setKnapsackProblem(response.weight);
      initialBagSolution({
        n: problemLength,
        max,
        weight: response.weight,
      }).then((solution) => {
        setInitialSolution(solution.bag);
        evaluateBagSolution({
          n: problemLength,
          solution: solution.bag,
          max,
        }).then((evaluationResponse) => {
          setEvaluationSolution(evaluationResponse);
          setLoading(false);
        });
      });
    });
    console.log('knapsackProblem', knapsackProblem);
    console.log('initialSolution', initialSolution);
    console.log('evaluateSolution', evaluateSolution);
  };

  return (
    <MainLayout>
      <form onSubmit={handleSubmit}>
        <ProblemDefinition
          setProblemLength={setProblemLength}
          setMax={setMax}
          initialOption="FIXED"
          onOptionChange={(option) => console.log(option)}
        />
        <Methods options={methodOptions} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
          }}
        >
          <button
            style={{
              width: '200px',
              padding: '12px 16px',
              backgroundColor: '#3d3d3d',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Gerar
          </button>
        </div>
      </form>
      <DataView
        data={{
          knapsackProblem,
          initialSolution,
          weight: evaluateSolution.weight,
          cost: evaluateSolution.cost,
        }}
      />
    </MainLayout>
  );
};

export default BasicMethods;
