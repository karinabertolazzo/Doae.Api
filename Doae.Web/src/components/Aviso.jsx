import './Aviso.css';

function Aviso({ tipo, mensagem, aoFechar }) {
  if (!mensagem) return null;

  return (
    <div className={`aviso aviso-${tipo}`} role="alert">
      <span>{mensagem}</span>
      {aoFechar && (
        <button className="aviso-fechar" onClick={aoFechar} aria-label="Fechar aviso">
          ×
        </button>
      )}
    </div>
  );
}

export default Aviso;