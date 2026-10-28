import './SolicitacaoCard.css';

function SolicitacaoCard({ solicitacao, aoAceitar, aoRecusar, aoCancelar }) {
  const pendente = solicitacao.status === 'Pendente';

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

      {pendente && (
        <div className="solicitacao-acoes">
          <button className="btn-aceitar" onClick={() => aoAceitar(solicitacao.id)}>
            Aceitar
          </button>
          <button onClick={() => aoRecusar(solicitacao.id)}>Recusar</button>
          <button onClick={() => aoCancelar(solicitacao.id)}>Cancelar</button>
        </div>
      )}
    </article>
  );
}

export default SolicitacaoCard;