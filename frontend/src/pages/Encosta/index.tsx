import { MainLayout } from '@/components/MainLayout';

export default function Encosta() {
  function evaluate(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const tmax = parseFloat(
      (document.getElementById('tmax') as HTMLInputElement).value
    );
    const weight = parseFloat(
      (document.getElementById('weigth') as HTMLInputElement).value
    );
    const cost = parseFloat(
      (document.getElementById('cost') as HTMLInputElement).value
    );
    console.log('Tmax:', tmax, 'Weight:', weight, 'Cost:', cost);
  }

  return (
    <MainLayout>
      <div className='h-screen flex flex-col content-between space-between'>
        <h1>Encosta</h1>
        <form className='flex gap-2' onSubmit={evaluate}>
          <label htmlFor='max_weights'>Max Weigths</label>
          <input
            className='border-2 p-16 h-8 w-16 text-center'
            type='text'
            name='Max Weigths'
            placeholder='max_weights'
            id='max_weights'
            defaultValue='1'
          ></input>
          <label htmlFor='weights'>Weights</label>
          <input
            className='border-2 p-16 h-8 w-16 text-center'
            type='text'
            name='weights'
            placeholder='weights'
            id='weights'
            defaultValue='1'
          ></input>
          <label htmlFor='cost'>Costs</label>
          <input
            className='border-2 p-16 h-8 w-16 text-center'
            type='text'
            name='cost'
            placeholder='Cost'
            id='cost'
            defaultValue='1'
          ></input>
          <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
            Avaliar
          </button>
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
