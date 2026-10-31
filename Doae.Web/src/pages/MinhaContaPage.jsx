
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itensApi, solicitacoesApi } from '../services/api';
import { useSessao } from '../contexts/SessaoContext';
import SolicitacaoCard from '../components/SolicitacaoCard';
import Aviso from '../components/Aviso';
import './MinhaContaPage.css';

function MinhaContaPage() {
  const { usuario } = useSessao();

  const [meusItens, setMeusItens] = useState([]);
  const [feitas, setFeitas] = useState([]);
  const [recebidas, setRecebidas] = useState([]);
  const [contato, setContato] = useState(null);

  const [aviso, setAviso] = useState({
    tipo: '',
    mensagem: '',
  });

  const carregar = async () => {
    if (!usuario) return;

    try {
      const [itens, solicitacoes] = await Promise.all([
        itensApi.listar(),
        solicitacoesApi.listar(),
      ]);

      const meus = itens.filter(
        (i) => i.usuarioId === usuario.id
      );

      const idsMeus = meus.map((i) => i.id);

      setMeusItens(meus);

      setFeitas(
        solicitacoes.filter(
          (s) => s.solicitanteId === usuario.id
        )
      );

      setRecebidas(
        solicitacoes.filter(
          (s) => idsMeus.includes(s.itemId)
        )
      );
    } catch (e) {
      setAviso({
        tipo: 'erro',
        mensagem: e.message,
      });
    }
  };

  useEffect(() => {
    setContato(null);

    if (usuario) {
      carregar();
    } else {
      setMeusItens([]);
      setFeitas([]);
      setRecebidas([]);
    }
  }, [usuario?.id]);

  const executar = (acao, textoSucesso) => async (id) => {
    try {
      await acao(id);

      setContato(null);

      setAviso({
        tipo: 'sucesso',
        mensagem: textoSucesso,
      });

      await carregar();
    } catch (e) {
      setAviso({
        tipo: 'erro',
        mensagem: e.message,
      });
    }
  };

  const combinar = async (id) => {
    try {
      setContato(null);

      const dados = await solicitacoesApi.contatos(id);

      setContato(dados);
      setAviso({ tipo: '', mensagem: '' });
    } catch (e) {
      setAviso({
        tipo: 'erro',
        mensagem: e.message,
      });
    }
  };

  const confirmarEntrega = async (id) => {
    const confirmou = window.confirm(
      'Você confirma que o item foi entregue?'
    );

    if (!confirmou) return;

    await executar(
      solicitacoesApi.concluir,
      'Doação concluída com sucesso!'
    )(id);
  };

  if (!usuario) {
    return (
      <section className="conta-pagina conta-sem-sessao">
        <h1>Minha conta</h1>
        <p>
          Você precisa estar logado.{' '}
          <Link to="/entrar">
            Entre ou crie sua conta.
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="conta-pagina">
      <div className="conta-conteudo">
        <header className="conta-hero">
          <div className="conta-hero-principal">
            <h1>
              Minha <span>conta</span>
            </h1>

            <div className="conta-identidade">
              <div className="conta-avatar" aria-hidden="true">
                {usuario.nome.trim().charAt(0).toUpperCase()}
              </div>

              <strong>{usuario.nome}</strong>

              <span
                className="conta-identidade-separador"
                aria-hidden="true"
              >
                ·
              </span>

              <span>{usuario.email}</span>

              <span
                className="conta-identidade-separador"
                aria-hidden="true"
              >
                ·
              </span>

              <span>{usuario.cidade}</span>
            </div>
          </div>

    
        </header>

        <div className="conta-faixa">
          <div className="conta-faixa-apresentacao">
            <div className="conta-faixa-icone" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.7L7.2 10a16 16 0 0 0 6.8 6.8l1.6-1.8a2 2 0 0 1 1.7-.6l3 .5a2 2 0 0 1 1.7 2z" />
              </svg>
            </div>

            <div>
              <h2>Contato para combinar a doação</h2>
              <p>
                Os contatos entre participantes são
                liberados pela API após a aceitação
                do pedido.
              </p>
            </div>
          </div>

          <div className="conta-faixa-informacoes">
            <div className="conta-dado">
              <span className="conta-dado-icone" aria-hidden="true">
                ♙
              </span>
              <div>
                <small>Meu nome</small>
                <strong>{usuario.nome}</strong>
              </div>
            </div>

            <div className="conta-dado">
              <span className="conta-dado-icone" aria-hidden="true">
                ✉
              </span>
              <div>
                <small>Meu e-mail</small>
                <strong>{usuario.email}</strong>
              </div>
            </div>
          </div>

          <div className="conta-faixa-informacoes">
            <div className="conta-dado">
              <span className="conta-dado-icone" aria-hidden="true">
                ⌖
              </span>
              <div>
                <small>Minha cidade</small>
                <strong>{usuario.cidade}</strong>
              </div>
            </div>

            {usuario.telefone && (
              <div className="conta-dado">
                <span className="conta-dado-icone" aria-hidden="true">
                  ☎
                </span>
                <div>
                  <small>Meu telefone</small>
                  <strong>{usuario.telefone}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        <Aviso
          tipo={aviso.tipo}
          mensagem={aviso.mensagem}
          aoFechar={() =>
            setAviso({ tipo: '', mensagem: '' })
          }
        />

        <div className="conta-pedidos-grid">
          <section className="conta-painel">
            <div className="conta-painel-cabecalho">
              <span
                className="conta-painel-simbolo"
                aria-hidden="true"
              >
                ⬡
              </span>

              <div className="conta-painel-titulos">
                <h2>Pedidos que recebi</h2>
                <p>
                  Solicitações de pessoas interessadas
                  nos seus itens.
                </p>
              </div>

              <span className="conta-contador">
                {recebidas.length}
              </span>
            </div>

            {recebidas.length === 0 && (
              <div className="conta-vazio">
                <strong>
                  Ninguém pediu seus itens ainda.
                </strong>
                <p>
                  Quando alguém solicitar uma doação sua,
                  ela aparecerá aqui.
                </p>
              </div>
            )}

            <div className="conta-lista">
              {recebidas.map((s) => (
                <SolicitacaoCard
                  key={s.id}
                  solicitacao={s}
                  aoAceitar={executar(
                    solicitacoesApi.aceitar,
                    'Pedido aceito! O item foi reservado.'
                  )}
                  aoRecusar={executar(
                    solicitacoesApi.recusar,
                    'Pedido recusado.'
                  )}
                  aoCombinar={combinar}
                  textoCombinar="Combinar entrega"
                  aoConcluir={confirmarEntrega}
                  contato={
                    contato?.solicitacaoId === s.id
                      ? contato
                      : null
                  }
                  aoFecharContato={() =>
                    setContato(null)
                  }
                />
              ))}
            </div>
          </section>

          <section className="conta-painel">
            <div className="conta-painel-cabecalho">
              <span
                className="conta-painel-simbolo"
                aria-hidden="true"
              >
                ➤
              </span>

              <div className="conta-painel-titulos">
                <h2>Pedidos que fiz</h2>
                <p>
                  Itens que você solicitou para receber.
                </p>
              </div>

              <span className="conta-contador">
                {feitas.length}
              </span>
            </div>

            {feitas.length === 0 && (
              <div className="conta-vazio">
                <strong>
                  Você ainda não pediu nenhum item.
                </strong>
                <p>
                  Encontre algo útil e dê uma nova história
                  a um objeto.
                </p>
                <Link to="/itens">Explorar itens</Link>
              </div>
            )}

            <div className="conta-lista">
              {feitas.map((s) => (
                <SolicitacaoCard
                  key={s.id}
                  solicitacao={s}
                  aoCancelar={executar(
                    solicitacoesApi.cancelar,
                    'Pedido cancelado.'
                  )}
                  aoCombinar={combinar}
                  textoCombinar="Combinar retirada"
                  contato={
                    contato?.solicitacaoId === s.id
                      ? contato
                      : null
                  }
                  aoFecharContato={() =>
                    setContato(null)
                  }
                />
              ))}
            </div>
          </section>
        </div>

        <section className="conta-painel conta-meus-itens">
          <div className="conta-painel-cabecalho">
            <span
              className="conta-painel-simbolo"
              aria-hidden="true"
            >
              ⬡
            </span>

            <div className="conta-painel-titulos">
              <h2>Meus itens para doação</h2>
              <p>
                Itens que você cadastrou para doar.
              </p>
            </div>

            <span className="conta-contador">
              {meusItens.length}
            </span>

            <Link to="/doar" className="conta-novo-item">
              + Cadastrar novo item
            </Link>
          </div>

          {meusItens.length === 0 ? (
            <div className="conta-vazio">
              <strong>
                Você ainda não cadastrou itens.
              </strong>
              <p>
                Uma nova doação pode transformar
                a vida de alguém.
              </p>
              <Link to="/doar">Doar um item</Link>
            </div>
          ) : (
            <div className="conta-tabela-rolagem">
              <div
                className="conta-tabela"
                role="table"
                aria-label="Meus itens para doação"
              >
                <div
                  className="conta-tabela-cabecalho"
                  role="row"
                >
                  <span role="columnheader">Item</span>
                  <span role="columnheader">Categoria</span>
                  <span role="columnheader">Cidade</span>
                  <span role="columnheader">Status</span>
                  <span role="columnheader">Ações</span>
                </div>

                {meusItens.map((i) => (
                  <div
                    className="conta-tabela-linha"
                    role="row"
                    key={i.id}
                  >
                    <div
                      className="conta-tabela-item"
                      role="cell"
                    >
                      <span
                        className="conta-tabela-miniatura"
                        aria-hidden="true"
                      >
                        ♻
                      </span>

                      <Link to={`/itens/${i.id}`}>
                        {i.titulo}
                      </Link>
                    </div>

                    <span role="cell">
                      {i.categoriaNome || 'Não informado'}
                    </span>

                    <span role="cell">
                      {i.cidade || 'Não informada'}
                    </span>

                    <span role="cell">
                      <span
                        className={`conta-item-status ${
                          i.status === 'Doado'
                            ? 'conta-item-status-doado'
                            : i.status === 'Reservado'
                              ? 'conta-item-status-reservado'
                              : 'conta-item-status-disponivel'
                        }`}
                      >
                        {i.status === 'Doado'
                          ? 'Doado'
                          : i.status === 'Reservado'
                            ? 'Reservado'
                            : 'Disponível'}
                      </span>
                    </span>

                    <div role="cell">
                      <Link
                        className="conta-item-detalhes"
                        to={`/itens/${i.id}`}
                      >
                        Ver detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default MinhaContaPage;
