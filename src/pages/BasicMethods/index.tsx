import { DataView } from '../../components/DataView';
import { MainLayout } from '../../components/MainLayout';
import { Methods } from '../../components/Methods';
import { ProblemDefinition } from '../../components/ProblemDefinition';

const BasicMethods = () => {
  return (
    <MainLayout>
      <div>
        <ProblemDefinition />
        <Methods />
      </div>
      <DataView data="Data" />
    </MainLayout>
  );
};

export default BasicMethods;
