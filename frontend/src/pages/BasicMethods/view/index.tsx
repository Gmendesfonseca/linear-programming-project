import { MainLayout } from '@/components/MainLayout';
import { ProblemDefinition } from '../components/ProblemDefinition';
import { Methods } from '../components/Methods';
import { Method, methodOptions } from '../helpers';
import { DataInterface, DataView } from '../components/DataView';
import { FormInputs } from '@/types';
import {
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';

interface BasicMethodsView {
  method: Method | 'default';
  setMethod: React.Dispatch<React.SetStateAction<Method | 'default'>>;
  setBiggestKnapsackLength: (length: number) => void;
  setBiggestKnapsackWeight: (weight: number) => void;
  onSubmit: SubmitHandler<FormInputs>;
  register: UseFormRegister<FormInputs>;
  handleSubmit: UseFormHandleSubmit<FormInputs, FormInputs>;
  disableButton: boolean;
  loading: boolean;
  allData: DataInterface[]; // Use appropriate type for allData
}

export const BasicMethodsView: React.FC<BasicMethodsView> = ({
  method,
  setMethod,
  setBiggestKnapsackLength,
  setBiggestKnapsackWeight,
  onSubmit,
  register,
  handleSubmit,
  disableButton,
  loading,
  allData,
}) => {
  return (
    <MainLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ProblemDefinition
          setMax={setBiggestKnapsackWeight}
          initialOption="FIXED"
          setProblemLength={setBiggestKnapsackLength}
          onOptionChange={(option) => console.log(option)}
        />
        <Methods
          method={method}
          setMethod={setMethod}
          options={methodOptions}
          register={register}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
          }}
        >
          <button
            disabled={disableButton}
            style={{
              width: '200px',
              padding: '12px 16px',
              backgroundColor: disableButton ? '#ccc' : '#3d3d3d',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              marginBottom: '16px',
            }}
            type="submit"
          >
            {loading ? 'Carregando...' : 'Gerar'}
          </button>
        </div>
      </form>
      {!loading && <DataView allData={allData} />}
    </MainLayout>
  );
};
