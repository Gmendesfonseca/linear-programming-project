import { MainLayout } from '../../components/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl !mx-auto !px-4 !py-8">
        {/* Header Section */}
        <div className="text-center !mb-12">
          <h1 className="text-4xl font-bold text-gray-800 !mb-4">
            Sistema de Otimização para Problemas da Mochila
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl !mx-auto">
            Plataforma completa para resolver problemas de otimização
            combinatória utilizando métodos heurísticos avançados e algoritmos
            genéticos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 !lg:grid-cols-3 gap-6 !mb-12">
          <Card className="!p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center !mx-auto !mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold !mb-2">Métodos Básicos</h3>
              <p className="text-gray-600 !mb-4">
                Implementação de algoritmos clássicos como Subida de Encosta e
                Têmpera Simulada para otimização local.
              </p>
              <Link to="/basic-methods">
                <Button variant="outline" className="w-full">
                  Explorar Métodos
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="!p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center !mx-auto !mb-4">
                <span className="text-2xl">🧬</span>
              </div>
              <h3 className="text-lg font-semibold !mb-2">
                Algoritmos Genéticos
              </h3>
              <p className="text-gray-600 !mb-4">
                Solução evolutiva com configurações personalizáveis de
                população, cruzamento, mutação e análise comparativa.
              </p>
              <Link to="/genetic-algorithms">
                <Button variant="outline" className="w-full">
                  Executar Algoritmos
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="!p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center !mx-auto !mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold !mb-2">Relatórios</h3>
              <p className="text-gray-600 !mb-4">
                Análises estatísticas detalhadas, comparação de desempenho entre
                métodos e visualização de resultados.
              </p>
              <Link to="/reports">
                <Button variant="outline" className="w-full">
                  Ver Relatórios
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Problem Description */}
        <Card className="!p-8 !mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold !mb-4 text-center">
            O Problema da Mochila
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold !mb-3">📝 Descrição</h3>
              <p className="text-gray-700 !mb-4">
                O problema da mochila é um problema clássico de otimização
                combinatória onde se deve selecionar itens com diferentes pesos
                e valores para maximizar o valor total sem exceder a capacidade
                da mochila.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Cada item possui peso e valor específicos</li>
                <li>Capacidade limitada da mochila</li>
                <li>Objetivo: maximizar valor total</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold !mb-3">
                ⚡ Funcionalidades
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Geração automática de problemas</li>
                <li>Configuração manual de parâmetros</li>
                <li>Múltiplos métodos de solução</li>
                <li>Análise comparativa de desempenho</li>
                <li>Visualização interativa de resultados</li>
                <li>Exportação de relatórios estatísticos</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Getting Started */}
        <Card className="!p-6">
          <h2 className="text-2xl font-bold !mb-4 text-center">Como Começar</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center !mx-auto !mb-3">
                1
              </div>
              <h3 className="font-semibold !mb-2">Configure o Problema</h3>
              <p className="text-sm text-gray-600">
                Defina os parâmetros do problema ou use a geração automática
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center !mx-auto !mb-3">
                2
              </div>
              <h3 className="font-semibold !mb-2">Escolha o Método</h3>
              <p className="text-sm text-gray-600">
                Selecione entre métodos básicos ou algoritmos genéticos
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center !mx-auto !mb-3">
                3
              </div>
              <h3 className="font-semibold !mb-2">Analise os Resultados</h3>
              <p className="text-sm text-gray-600">
                Visualize as soluções e compare o desempenho dos algoritmos
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="text-center !mt-8">
          <h3 className="text-lg font-semibold !mb-4">Comece Agora</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/basic-methods">
              <Button className="!px-6 !py-3">Métodos Básicos</Button>
            </Link>
            <Link to="/genetic-algorithms">
              <Button variant="outline" className="!px-6 !py-3">
                Algoritmos Genéticos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
