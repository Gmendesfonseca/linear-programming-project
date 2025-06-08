import './styles.css';
import Encosta from '@/pages/Encosta';
import Tempera from '@/pages/Tempera';
import { MethodsProps, Method } from '@/pages/BasicMethods';

export interface Option {
  value: string;
  label: string;
}

interface MethodsComponentProps extends MethodsProps {
  options: Option[];
  method: Method | 'default';
  setMethod: React.Dispatch<React.SetStateAction<Method | 'default'>>;
}

export const Methods = ({
  options,
  method,
  setMethod,
  ...rest
}: MethodsComponentProps) => {
  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(event.target.value as Method);
  };

  return (
    <div className="methods">
      <h1>Métodos Básicos</h1>
      <select onChange={handleMethodChange} value={method}>
        <option value={'default'}>Selecione um método</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {method === 'slope_climbing' && (
        <Encosta method={Method.SLOPE_CLIMBING} {...rest} />
      )}
      {method === 'slope_climbing_try_again' && (
        <Encosta method={Method.SLOPE_CLIMBING_TRY_AGAIN} {...rest} />
      )}
      {method === 'tempera' && <Tempera {...rest} />}
      {method === 'all' && <div>Fiquei devendo!</div>}
    </div>
  );
};
