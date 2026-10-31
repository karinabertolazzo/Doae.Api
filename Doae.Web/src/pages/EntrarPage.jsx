
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, usuariosApi } from '../services/api';
import { useSessao } from '../contexts/SessaoContext';
import Aviso from '../components/Aviso';
import './EntrarPage.css';

const cadastroInicial = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  senha: '',
};

function EntrarPage() {
  const { entrar } = useSessao();
  const navegar = useNavigate();

  const [modo, setModo] = useState('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cadastro, setCadastro] = useState(cadastroInicial);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState({
    tipo: '',
    mensagem: '',
  });

  const trocarModo = (novoModo) => {
    setModo(novoModo);
    setAviso({ tipo: '', mensagem: '' });
  };

  const alterar = (campo) => (evento) => {
    setCadastro((atual) => ({
      ...atual,
      [campo]: evento.target.value,
    }));
  };

  // LOGIN REAL COM JWT
  const fazerLogin = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setAviso({ tipo: '', mensagem: '' });

    try {
      const resposta = await authApi.login({
        email: email.trim(),
        senha,
      });

      // Guarda o usuário e o JWT na sessão.
      entrar(resposta);

      navegar('/');
    } catch (e) {
      setAviso({
        tipo: 'erro',
        mensagem: e.message,
      });
    } finally {
      setEnviando(false);
    }
  };

  // CADASTRO REAL COM SENHA
  const criarConta = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setAviso({ tipo: '', mensagem: '' });

    try {
      // Cadastra o usuário no banco de dados.
      await usuariosApi.criar(cadastro);

      // Depois faz login para receber o JWT.
      const resposta = await authApi.login({
        email: cadastro.email.trim(),
        senha: cadastro.senha,
      });

      entrar(resposta);

      navegar('/');
    } catch (e) {
      setAviso({
        tipo: 'erro',
        mensagem: e.message,
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="entrar">
      <h2>Bem-vindo ao Doaê</h2>

      <p className="entrar-subtitulo">
        Entre para doar itens ou solicitar o que você precisa.
      </p>

      <div className="entrar-abas">
        <button
          type="button"
          className={modo === 'entrar' ? 'aba ativa' : 'aba'}
          onClick={() => trocarModo('entrar')}
        >
          Entrar
        </button>

        <button
          type="button"
          className={modo === 'cadastro' ? 'aba ativa' : 'aba'}
          onClick={() => trocarModo('cadastro')}
        >
          Criar conta
        </button>
      </div>

      <Aviso
        tipo={aviso.tipo}
        mensagem={aviso.mensagem}
        aoFechar={() =>
          setAviso({ tipo: '', mensagem: '' })
        }
      />

      {modo === 'entrar' ? (
        <form className="formulario" onSubmit={fazerLogin}>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      ) : (
        <form className="formulario" onSubmit={criarConta}>
          <label>
            Nome
            <input
              value={cadastro.nome}
              onChange={alterar('nome')}
              autoComplete="name"
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              value={cadastro.email}
              onChange={alterar('email')}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Telefone
            <input
              value={cadastro.telefone}
              onChange={alterar('telefone')}
              autoComplete="tel"
            />
          </label>

          <label>
            Cidade
            <input
              value={cadastro.cidade}
              onChange={alterar('cidade')}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={cadastro.senha}
              onChange={alterar('senha')}
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />
          </label>

          <button type="submit" disabled={enviando}>
            {enviando ? 'Criando...' : 'Criar conta e entrar'}
          </button>
        </form>
      )}
    </section>
  );
}

export default EntrarPage;
