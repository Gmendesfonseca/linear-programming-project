import { MainLayout } from '@/components/MainLayout';
import { sendSlopeClimbingData } from '@/service/requests';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type InputsType = {
  solutions: number[];
  weights: number[];
  costs: number[];
  max_weights: number[];
  current_values: number[];
};

export default function Encosta() {
  const [bags, setBags] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputsType>();

  function generateNewBag() {
    setBags((prev) => [...prev, prev.length + 1]);
  }

  function removeBag() {
    setBags((prev) => prev.slice(0, -1));
  }

  const onSubmit: SubmitHandler<InputsType> = (data) => {
    console.log(data);
    sendSlopeClimbingData(data);
  };

  return (
    <MainLayout>
      <div className="h-screen flex flex-col content-between space-between">
        <h1>Encosta</h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
          {bags.map((bag, index) => (
            <div key={index}>
              <h2>Mochila {bag}</h2>
              <label htmlFor="max_weight">Max Weigth</label>
              <input
                className="border-2 p-16 h-8 w-16 text-center"
                type="text"
                {...register('max_weights', { required: true })}
              />
              {errors.max_weights && <span>This field is required</span>}
              <label htmlFor="weights">Weights</label>
              <input
                className="border-2 p-16 h-8 w-16 text-center"
                type="text"
                {...register('weights', { required: true })}
              />
              {errors.weights && <span>This field is required</span>}

              <label htmlFor="costs">Costs</label>
              <input
                className="border-2 p-16 h-8 w-16 text-center"
                type="text"
                {...register('costs', { required: true })}
              />
              {errors.costs && <span>This field is required</span>}
              <button
                type="button"
                className="bg-red-500 text-white p-2 rounded"
                onClick={removeBag}
              >
                Remover
              </button>
            </div>
          ))}
          <div>
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded"
              onClick={generateNewBag}
            >
              Adicionar mochila
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Avaliar
            </button>
          </div>
        </form>
        <div>
          <p>
            <strong>Resultado: {}</strong>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
