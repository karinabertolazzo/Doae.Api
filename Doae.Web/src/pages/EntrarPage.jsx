import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, usuariosApi } from '../services/api';
import { useSessao } from '../contexts/SessaoContext';
import Aviso from '../components/Aviso';
import './EntrarPage.css';

const CHAVE_EMAIL = 'doae-email-lembrado';

const cadastroInicial = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  senha: '',
};

const caminhos = {
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  cadeado: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  telefone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  olho: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  olhoFechado: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.6A17 17 0 0 0 2 12s4 7 10 7a10 10 0 0 0 4.4-1" />
    </>
  ),
};

function Icone({ nome }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {caminhos[nome]}
    </svg>
  );
}

function Campo({ icone, children, className = '' }) {
  return (
    <div className={`entrar-campo ${className}`}>
      <span className="entrar-campo-icone">
        <Icone nome={icone} />
      </span>
      {children}
    </div>
  );
}

function lerEmailLembrado() {
  try {
    return localStorage.getItem(CHAVE_EMAIL) ?? '';
  } catch {
    return '';
  }
}

function EntrarPage() {
  const { entrar } = useSessao();
  const navegar = useNavigate();

  const emailLembrado = lerEmailLembrado();

  const [modo, setModo] = useState('entrar');
  const [email, setEmail] = useState(emailLembrado);
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(Boolean(emailLembrado));
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [cadastro, setCadastro] = useState(cadastroInicial);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState({ tipo: '', mensagem: '' });

  const trocarModo = (novoModo) => {
    setModo(novoModo);
    setMostrarSenha(false);
    setAviso({ tipo: '', mensagem: '' });
  };

  const alterar = (campo) => (evento) => {
  setCadastro((atual) => ({
    ...atual,
    [campo]: evento.target.value,
  }));
};

 const alterarTelefone = (evento) => {
  const numeros = evento.target.value
    .replace(/\D/g, '')
    .slice(0, 11);

  setCadastro((atual) => ({
    ...atual,
    telefone: numeros,
  }));
};

  const guardarEmail = (valor) => {
    try {
      if (lembrar) localStorage.setItem(CHAVE_EMAIL, valor);
      else localStorage.removeItem(CHAVE_EMAIL);
    } catch {
      // sem armazenamento disponível: ignora
    }
  };

  const esqueciSenha = () => {
    setAviso({
      tipo: 'erro',
      mensagem: 'A recuperação de senha ainda não está disponível.',
    });
  };

  const fazerLogin = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    setAviso({ tipo: '', mensagem: '' });

    try {
      const resposta = await authApi.login({ email: email.trim(), senha });
      guardarEmail(email.trim());
      entrar(resposta);
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
    setAviso({ tipo: '', mensagem: '' });

    try {
      await usuariosApi.criar(cadastro);

      const resposta = await authApi.login({
        email: cadastro.email.trim(),
        senha: cadastro.senha,
      });

      entrar(resposta);
      navegar('/');
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    } finally {
      setEnviando(false);
    }
  };

  const botaoSenha = (
    <button
      type="button"
      className="entrar-mostrar-senha"
      onClick={() => setMostrarSenha((atual) => !atual)}
      aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
    >
      <Icone nome={mostrarSenha ? 'olhoFechado' : 'olho'} />
    </button>
  );

  return (
    <section className="entrar">
      <div className="entrar-layout">
        <div className="entrar-apresentacao">
          <div className="entrar-apresentacao-conteudo">
            <h1>
              Doe o que <br />
              não usa. <br />
              <span>Transforme vidas.</span>
            </h1>

            <p className="entrar-descricao">
              Uma comunidade que conecta pessoas e dá novos destinos aos objetos.
              Juntos, construímos um mundo mais solidário e sustentável.
            </p>

            <div className="entrar-beneficios">
              <div className="entrar-beneficio">
                <span className="entrar-beneficio-icone">♻</span>
                <div>
                  <h3>Mais reutilização</h3>
                  <p>Um novo destino para o que ainda tem valor.</p>
                </div>
              </div>

              <div className="entrar-beneficio">
                <span className="entrar-beneficio-icone">♡</span>
                <div>
                  <h3>Mais solidariedade</h3>
                  <p>Conectando quem doa a quem precisa.</p>
                </div>
              </div>

              <div className="entrar-beneficio">
                <span className="entrar-beneficio-icone">✦</span>
                <div>
                  <h3>Mais impacto positivo</h3>
                  <p>Pequenas atitudes transformam vidas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="entrar-painel">
          <div className="entrar-painel-conteudo">
            <div className="entrar-cabecalho">
              <h2>
                {modo === 'entrar' ? 'Bem-vindo de volta!' : 'Faça parte do Doaê'}
              </h2>
              <p>
                {modo === 'entrar'
                  ? 'Entre na sua conta para continuar fazendo parte dessa rede de boas ações.'
                  : 'Crie sua conta e comece a transformar objetos em novas oportunidades.'}
              </p>
            </div>

            <div className="entrar-abas">
              <button
                type="button"
                className={modo === 'entrar' ? 'aba ativa' : 'aba'}
                onClick={() => trocarModo('entrar')}
                aria-pressed={modo === 'entrar'}
              >
                Entrar
              </button>

              <button
                type="button"
                className={modo === 'cadastro' ? 'aba ativa' : 'aba'}
                onClick={() => trocarModo('cadastro')}
                aria-pressed={modo === 'cadastro'}
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
              <form className="entrar-formulario" onSubmit={fazerLogin}>
                <label>
                  E-mail
                  <Campo icone="email">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Digite seu e-mail"
                      autoComplete="email"
                      required
                    />
                  </Campo>
                </label>

                <label>
                  Senha
                  <Campo icone="cadeado" className="entrar-senha-campo">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                      required
                    />
                    {botaoSenha}
                  </Campo>
                </label>

                <div className="entrar-opcoes">
                  <label className="entrar-lembrar">
                    <input
                      type="checkbox"
                      checked={lembrar}
                      onChange={(e) => setLembrar(e.target.checked)}
                    />
                    Lembrar de mim
                  </label>
                  <button
                    type="button"
                    className="entrar-esqueci"
                    onClick={esqueciSenha}
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button type="submit" className="entrar-botao" disabled={enviando}>
                  {enviando ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
            ) : (
              <form
                className="entrar-formulario entrar-formulario-cadastro"
                onSubmit={criarConta}
              >
                <label>
                  Nome
                  <Campo icone="usuario">
                    <input
                      type="text"
                      value={cadastro.nome}
                      onChange={alterar('nome')}
                      placeholder="Seu nome completo"
                      autoComplete="name"
                      required
                    />
                  </Campo>
                </label>

                <label>
                  E-mail
                  <Campo icone="email">
                    <input
                      type="email"
                      value={cadastro.email}
                      onChange={alterar('email')}
                      placeholder="seu@email.com"
                      autoComplete="email"
                      required
                    />
                  </Campo>
                </label>

                <label>
                  Telefone
                 
<Campo icone="telefone">
  <input
    type="tel"
    value={cadastro.telefone}
    onChange={alterarTelefone}
    placeholder="21999999999"
    autoComplete="tel"
    inputMode="numeric"
    minLength={10}
    maxLength={11}
    pattern="[0-9]{10,11}"
    title="Digite o DDD e o telefone com 10 ou 11 números."
    required
  />
</Campo>

                </label>

                <label>
                  Cidade
                  <Campo icone="pin">
                    <input
                      type="text"
                      value={cadastro.cidade}
                      onChange={alterar('cidade')}
                      placeholder="Sua cidade"
                      required
                    />
                  </Campo>
                </label>

                <label>
                  Senha
                  <Campo icone="cadeado" className="entrar-senha-campo">
                    <input
                      type={mostrarSenha ? 'text' : 'password'}
                      value={cadastro.senha}
                      onChange={alterar('senha')}
                      placeholder="Mínimo de 8 caracteres"
                      autoComplete="new-password"
                      minLength={8}
                      maxLength={128}
                      required
                    />
                    {botaoSenha}
                  </Campo>
                </label>

                <button type="submit" className="entrar-botao" disabled={enviando}>
                  {enviando ? 'Criando conta...' : 'Criar minha conta'}
                </button>
              </form>
            )}

            <div className="entrar-divisor">
              <span>ou</span>
            </div>

            <p className="entrar-rodape">
              {modo === 'entrar' ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
              <button
                type="button"
                onClick={() => trocarModo(modo === 'entrar' ? 'cadastro' : 'entrar')}
              >
                {modo === 'entrar' ? 'Criar conta' : 'Entrar'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EntrarPage;