
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api';

const Index = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [apiStatus, setApiStatus] = useState('');

  useEffect(() => {
    console.log('Verificando conexão com a API...');
    
    const checkApiConnection = async () => {
      try {
        await api.get('/health');
        console.log('API conectada com sucesso!');
        setApiStatus('API conectada com sucesso!');
        toast.success('API conectada com sucesso!');
        
        // Aguarda 2 segundos antes de redirecionar
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        setApiStatus('Falha na conexão com a API');
        toast.error('Não foi possível conectar à API. Verifique se o servidor está rodando na porta 5000 com HTTP (não HTTPS).');
      } finally {
        setChecking(false);
      }
    };

    checkApiConnection();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="logo-text mb-2">
          <span>Sistema </span>
          <span>de Fidelidade</span>
        </h1>
        <p className="text-gray-600">
          {checking ? 'Verificando conexão com a API...' : apiStatus}
        </p>
        {checking ? (
          <div className="mt-4">
            <div className="animate-spin h-8 w-8 border-4 border-brand-green border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <div className="mt-4">
            {apiStatus.includes('sucesso') ? (
              <p className="text-green-600">Redirecionando para o login em instantes...</p>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600">Verifique se:</p>
                <ul className="text-left text-sm list-disc ml-8">
                  <li>A API está rodando na porta 5000</li>
                  <li>O comando <code className="bg-gray-100 px-2 py-1 rounded">dotnet run</code> foi executado na pasta <code className="bg-gray-100 px-2 py-1 rounded">public/csharp_api</code></li>
                  <li>Nenhum firewall está bloqueando a conexão</li>
                </ul>
                <button 
                  onClick={() => navigate('/login')} 
                  className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Ir para o Login mesmo assim
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
