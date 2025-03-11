interface DataViewProps {
  data: string;
}

export const DataView = ({ data }: DataViewProps) => {
  return (
    <div>
      <h3>Visualização dos Dados</h3>
      <input type="text" defaultValue={data} disabled />
    </div>
  );
};
