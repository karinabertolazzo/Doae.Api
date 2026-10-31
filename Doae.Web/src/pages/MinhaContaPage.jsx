
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

  // Carrega os itens e as solicitações do usuário.
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

  // Executa ações e atualiza a página.
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

  // Busca os contatos autorizados pela API.
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

  // Confirma que a entrega foi realizada.
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
      <section>
        <h2>Minha conta</h2>

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
    <section>
      <h2>Minha conta</h2>

      <p className="conta-info">
        <strong>{usuario.nome}</strong>
        {' · '}
        {usuario.email}
        {' · '}
        {usuario.cidade}
      </p>

      <Aviso
        tipo={aviso.tipo}
        mensagem={aviso.mensagem}
        aoFechar={() =>
          setAviso({ tipo: '', mensagem: '' })
        }
      />

      {/* PEDIDOS QUE RECEBI */}
      <h3>Pedidos que recebi</h3>

      {recebidas.length === 0 && (
        <p>Ninguém pediu seus itens ainda.</p>
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

            aoFecharContato={() => setContato(null)}
          />
        ))}
      </div>

      {/* PEDIDOS QUE FIZ */}
      <h3 className="conta-titulo">
        Pedidos que fiz
      </h3>

      {feitas.length === 0 && (
        <p>Você ainda não pediu nenhum item.</p>
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

            aoFecharContato={() => setContato(null)}
          />
        ))}
      </div>

      {/* MEUS ITENS */}
      <h3 className="conta-titulo">
        Meus itens para doação
      </h3>

      {meusItens.length === 0 && (
        <p>
          Você ainda não cadastrou itens.{' '}
          <Link to="/doar">Doar um item.</Link>
        </p>
      )}

      <ul className="conta-itens">
        {meusItens.map((i) => (
          <li key={i.id}>
            <Link to={`/itens/${i.id}`}>
              {i.titulo}
            </Link>

            <span
              className={
                i.status === 'Doado'
                  ? 'selo selo-doado'
                  : 'selo selo-disponivel'
              }
            >
              {i.status === 'Doado'
                ? 'Doado'
                : i.status === 'Reservado'
                  ? 'Reservado'
                  : 'Disponível'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MinhaContaPage;
