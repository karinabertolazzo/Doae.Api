import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuariosApi } from '../services/api';
import { useSessao } from '../contexts/SessaoContext';
import Aviso from '../components/Aviso';
import './EntrarPage.css';

const cadastroInicial = { nome: '', email: '', telefone: '', cidade: '' };

function EntrarPage() {
  const { entrar } = useSessao();
  const navegar = useNavigate();
  const [modo, setModo] = useState('entrar');
  const [email, setEmail] = useState('');
  const [cadastro, setCadastro] = useState(cadastroInicial);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState({ tipo: '', mensagem: '' });

  const trocarModo = (novoModo) => {
    setModo(novoModo);
    setAviso({ tipo: '', mensagem: '' });
  };

  const alterar = (campo) => (evento) =>
    setCadastro({ ...cadastro, [campo]: evento.target.value });

  const fazerLogin = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      const usuarios = await usuariosApi.listar();
      const encontrado = usuarios.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
      );
      if (!encontrado) {
        setAviso({
          tipo: 'erro',
          mensagem: 'Não encontramos uma conta com este e-mail. Crie uma conta.',
        });
        return;
      }
      entrar(encontrado);
      navegar('/');
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    } finally {
      setEnviando(false);
    }
  };

  const criarConta = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      const novo = await usuariosApi.criar(cadastro);
      entrar(novo);
      navegar('/');
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
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
          className={modo === 'entrar' ? 'aba ativa' : 'aba'}
          onClick={() => trocarModo('entrar')}
        >
          Entrar
        </button>
        <button
          className={modo === 'cadastro' ? 'aba ativa' : 'aba'}
          onClick={() => trocarModo('cadastro')}
        >
          Criar conta
        </button>
      </div>

      <Aviso
        tipo={aviso.tipo}
        mensagem={aviso.mensagem}
        aoFechar={() => setAviso({ tipo: '', mensagem: '' })}
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
            <input value={cadastro.nome} onChange={alterar('nome')} required />
          </label>
          <label>
            E-mail
            <input
              type="email"
              value={cadastro.email}
              onChange={alterar('email')}
              required
            />
          </label>
          <label>
            Telefone
            <input value={cadastro.telefone} onChange={alterar('telefone')} />
          </label>
          <label>
            Cidade
            <input value={cadastro.cidade} onChange={alterar('cidade')} required />
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