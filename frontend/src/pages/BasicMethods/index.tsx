import { useState } from 'react';
import { DataView } from './components/DataView';
import { MainLayout } from '../../components/MainLayout';
import { Methods } from './components/Methods';
import { ProblemDefinition } from './components/ProblemDefinition';
import {
  evaluateBagSolution,
  generateKnapsackProblem,
  initialBagSolution,
} from '../../service/requests';

const BasicMethods = () => {
  const methodOptions = [
    { value: 'slope_climbing', label: 'Subida de Encosta' },
    {
      value: 'slope_climbing_try_again',
      label: 'Subida de Encosta c/Tentativa',
    },
    { value: 'tempera', label: 'Tempera' },
    { value: 'all', label: 'Todos' },
  ];
  const [, setLoading] = useState(false);
  const [knapsackLength, setKnapsackLength] = useState([3, 2, 6]);
  const [maxKnapsackWeight, setMaxKnapsackWeight] = useState([10, 15, 20]);
  const [maxItemsWeight, setMaxItemsWeight] = useState(10);
  const [itemsCost, setItemsCost] = useState([]);
  const [itemsWeight, setItemsWeight] = useState([]);
  const [knapsackProblem, setKnapsackProblem] = useState({
    wights: [],
    costs: [],
  });
  const [initialSolution, setInitialSolution] = useState<number[]>([]);
  const [evaluateSolution, setEvaluationSolution] = useState(0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    generateKnapsackProblem({
      min_weight: 1,
      max_weight: maxItemsWeight,
      knapsacks_length: knapsackLength,
    }).then((response) => {
      setKnapsackProblem(response.data);
      setItemsCost(response.costs);
      setItemsWeight(response.weights);
      initialBagSolution({
        knapsacks_length: knapsackLength,
        max_weights: maxKnapsackWeight,
        weights: response.weights,
      }).then((solution) => {
        setInitialSolution(solution.bag);
        evaluateBagSolution({
          knapsacks: [
            {
              solution: solution.bag,
              weights: response.weights,
              costs: response.costs,
            },
          ],
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
          setMax={setMaxWeight}
          initialOption="FIXED"
          setProblemLength={setKnapsackLength}
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
