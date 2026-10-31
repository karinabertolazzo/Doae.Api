import './SolicitacaoCard.css';

function SolicitacaoCard({ solicitacao, aoAceitar, aoRecusar, aoCancelar }) {
  const pendente = solicitacao.status === 'Pendente';
  const temAcoes = aoAceitar || aoRecusar || aoCancelar;

  return (
    <article className="solicitacao-card">
      <div className="solicitacao-topo">
        <h3>{solicitacao.itemTitulo}</h3>
        <span className={`selo-status status-${solicitacao.status.toLowerCase()}`}>
          {solicitacao.status}
        </span>
      </div>
      <p>
        <strong>Solicitante:</strong> {solicitacao.solicitanteNome}
      </p>
      {solicitacao.mensagem && <p>"{solicitacao.mensagem}"</p>}

      {pendente && temAcoes && (
        <div className="solicitacao-acoes">
          {aoAceitar && (
            <button className="btn-aceitar" onClick={() => aoAceitar(solicitacao.id)}>
              Aceitar
            </button>
          )}
          {aoRecusar && (
            <button onClick={() => aoRecusar(solicitacao.id)}>Recusar</button>
          )}
          {aoCancelar && (
            <button onClick={() => aoCancelar(solicitacao.id)}>Cancelar pedido</button>
          )}
        </div>
      )}
    </article>
  );
}

export default SolicitacaoCard;