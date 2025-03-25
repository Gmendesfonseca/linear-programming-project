import './styles.css';

interface DataViewProps {
  data: string;
}

export const DataView = ({ data }: DataViewProps) => {
  return (
    <div className='data-view'>
      <h1>Visualização dos Dados</h1>
      <input type='text' defaultValue={data} disabled />
    </div>
  );
};
