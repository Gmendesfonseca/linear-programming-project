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
  const [problemLength] = useState(10);
  const [max] = useState(100);
  const [knapsackProblem, setKnapsackProblem] = useState('a');
  const [initialSolution, setInitialSolution] = useState('b');
  const [evaluateSolution, setEvaluationSolution] = useState('c');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    generateKnapsackProblem({
      n: problemLength,
      min: 1,
      max,
    }).then((response) => {
      setKnapsackProblem(response);
      initialBagSolution({
        n: problemLength,
        max,
        weight: response.weight,
      }).then((solution) => {
        setInitialSolution(solution);
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
          initialOption="FIXED"
          onOptionChange={(option) => console.log(option)}
        />
        <Methods options={methodOptions} />
        <button
          style={{
            width: '100px',
            paddingTop: '8px',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingBottom: '8px',
            backgroundColor: '#3d3d3d',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '32px',
          }}
        >
          Gerar
        </button>
      </form>
      <DataView data={evaluateSolution} />
    </MainLayout>
  );
};

export default BasicMethods;
