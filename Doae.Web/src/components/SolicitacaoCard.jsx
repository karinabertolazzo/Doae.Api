
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { itensApi } from '../services/api';
import './SolicitacaoCard.css';

function SolicitacaoCard({
  solicitacao,
  aoAceitar,
  aoRecusar,
  aoCancelar,
  aoCombinar,
  aoConcluir,
  textoCombinar,
  contato = null,
  aoFecharContato,
}) {
  const [detalhes, setDetalhes] = useState(null);
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const location = useLocation();

  const pendente = solicitacao.status === 'Pendente';
  const aceita = solicitacao.status === 'Aceita';

  const naPaginaDoItem =
    location.pathname === `/itens/${solicitacao.itemId}`;

  const alternarDetalhes = async () => {
    if (detalhesAbertos) {
      setDetalhesAbertos(false);
      return;
    }

    if (detalhes) {
      setDetalhesAbertos(true);
      return;
    }

    setCarregando(true);
    setErro('');

    try {
      const item = await itensApi.buscar(solicitacao.itemId);

      setDetalhes(item);
      setDetalhesAbertos(true);
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <article className="solicitacao-card">
      <div className="solicitacao-topo">
        <h3>{solicitacao.itemTitulo}</h3>

        <span
          className={`selo-status status-${solicitacao.status.toLowerCase()}`}
        >
          {solicitacao.status}
        </span>
      </div>

      <p>
        <strong>Solicitante:</strong>{' '}
        {solicitacao.solicitanteNome}
      </p>

      {solicitacao.mensagem && (
        <p>"{solicitacao.mensagem}"</p>
      )}

      <div className="solicitacao-acoes">
        {!naPaginaDoItem && (
          <button
            type="button"
            onClick={alternarDetalhes}
            disabled={carregando}
            aria-expanded={detalhesAbertos}
          >
            {carregando
              ? 'Carregando...'
              : detalhesAbertos
                ? 'Ocultar detalhes'
                : 'Ver detalhes'}
          </button>
        )}

        {pendente && aoAceitar && (
          <button
            type="button"
            className="btn-aceitar"
            onClick={() => aoAceitar(solicitacao.id)}
          >
            Aceitar
          </button>
        )}

        {pendente && aoRecusar && (
          <button
            type="button"
            onClick={() => aoRecusar(solicitacao.id)}
          >
            Recusar
          </button>
        )}

        {pendente && aoCancelar && (
          <button
            type="button"
            onClick={() => aoCancelar(solicitacao.id)}
          >
            Cancelar pedido
          </button>
        )}

        {aceita && aoCombinar && !contato && (
          <button
            type="button"
            className="btn-aceitar"
            onClick={() => aoCombinar(solicitacao.id)}
          >
            {textoCombinar}
          </button>
        )}

        {aceita && aoConcluir && (
          <button
            type="button"
            onClick={() => aoConcluir(solicitacao.id)}
          >
            Confirmar entrega
          </button>
        )}
      </div>

      {/* Contato aparece dentro do próprio pedido */}
      {aceita && contato && (
        <div
          className="conta-contato"
          role="region"
          aria-label="Contato da doação"
        >
          <h3>Contato para combinar a doação</h3>

          <p>
            <strong>{contato.tipoContato}</strong>
            {contato.nome}
          </p>

          <p>
            <strong>E-mail</strong>
            {contato.email}
          </p>

          <p>
            <strong>Telefone</strong>
            {contato.telefone || 'Não informado'}
          </p>

          <p>
            <strong>Cidade</strong>
            {contato.cidade}
          </p>

          <button
            type="button"
            onClick={aoFecharContato}
          >
            Fechar contato
          </button>
        </div>
      )}

      {erro && (
        <p role="alert" className="solicitacao-erro">
          {erro}
        </p>
      )}

      {detalhesAbertos && detalhes && (
        <div className="solicitacao-detalhes">
          <h4>Detalhes do item</h4>

          <div className="solicitacao-detalhes-grid">
            <p>
              <strong>Categoria</strong>
              {detalhes.categoriaNome}
            </p>

            <p>
              <strong>Estado</strong>
              {detalhes.estadoConservacao}
            </p>

            <p>
              <strong>Cidade</strong>
              {detalhes.cidade}
            </p>

            <p>
              <strong>Doador</strong>
              {detalhes.usuarioNome}
            </p>
          </div>

          <p>
            <strong>Descrição</strong>
            {detalhes.descricao}
          </p>
        </div>
      )}
    </article>
  );
}

export default SolicitacaoCard;
