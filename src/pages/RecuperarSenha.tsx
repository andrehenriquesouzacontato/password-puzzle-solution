
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import InputMask from '../components/InputMask';
import { ArrowLeft, Check } from 'lucide-react';

const RecuperarSenha: React.FC = () => {
  const [step, setStep] = useState(1);
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSolicitarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to send verification code
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Código de verificação enviado para seu email');
      setStep(2);
    }, 1500);
  };

  const handleVerificarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to verify code
    setTimeout(() => {
      setIsLoading(false);
      if (codigo === '123456' || codigo.length >= 4) {
        toast.success('Código verificado com sucesso');
        setStep(3);
      } else {
        toast.error('Código inválido');
      }
    }, 1500);
  };

  const handleResetarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (novaSenha !== confirmarSenha) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSolicitarCodigo} className="space-y-5">
            <div>
              <label htmlFor="cpf" className="form-label">CPF</label>
              <InputMask
                type="cpf"
                value={cpf}
                onChange={setCpf}
                placeholder="000.000.000-00"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">E-mail cadastrado</label>
              <InputMask
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="seu@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enviaremos um código de verificação para este email
              </p>
            </div>

            <button 
              type="submit" 
              className="green-button"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar código de verificação'}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerificarCodigo} className="space-y-5">
            <div>
              <label htmlFor="codigo" className="form-label">Código de verificação</label>
              <InputMask
                type="text"
                value={codigo}
                onChange={setCodigo}
                placeholder="Digite o código recebido por email"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enviamos um código de 6 dígitos para {email}
              </p>
            </div>

            <button 
              type="submit" 
              className="green-button"
              disabled={isLoading}
            >
              {isLoading ? 'Verificando...' : 'Verificar código'}
            </button>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => handleSolicitarCodigo}
                className="text-brand-green hover:underline text-sm"
              >
                Não recebeu o código? Enviar novamente
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetarSenha} className="space-y-5">
            <div>
              <label htmlFor="novaSenha" className="form-label">Nova senha</label>
              <InputMask
                type="password"
                value={novaSenha}
                onChange={setNovaSenha}
                placeholder="Digite sua nova senha"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="form-label">Confirmar senha</label>
              <InputMask
                type="password"
                value={confirmarSenha}
                onChange={setConfirmarSenha}
                placeholder="Confirme sua nova senha"
                required
              />
            </div>

            <button 
              type="submit" 
              className="green-button"
              disabled={isLoading}
            >
              {isLoading ? 'Atualizando...' : 'Atualizar senha'}
            </button>
          </form>
        );

      case 4:
        return (
          <div className="text-center py-6">
            <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-brand-green" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Senha atualizada com sucesso!</h3>
            <p className="text-gray-600 mb-6">
              Sua senha foi redefinida. Agora você pode acessar sua conta com a nova senha.
            </p>
            <button 
              type="button" 
              className="green-button"
              onClick={() => navigate('/')}
            >
              Voltar para o login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="logo-text mb-2">
            <span>Sistema </span>
            <span>de Fidelidade</span>
          </h1>
          <p className="text-gray-600">Recuperação de senha</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          {step < 4 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Recuperar senha</h2>
              <p className="text-gray-600 text-sm">
                {step === 1 && "Informe seu CPF e e-mail para receber um código de verificação."}
                {step === 2 && "Digite o código de verificação enviado para seu e-mail."}
                {step === 3 && "Crie uma nova senha para sua conta."}
              </p>
            </div>
          )}

          {renderStep()}
        </div>

        {step < 4 && (
          <div className="text-center">
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          Sistema de Fidelidade por Pontos • Versão 1.0
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
