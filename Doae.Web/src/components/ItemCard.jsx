import './ItemCard.css';

function ItemCard({ item }) {
  const doado = item.status === 'Doado';

  return (
    <article className="item-card">
      <div className="item-card-topo">
        <h3>{item.titulo}</h3>
        <span className={doado ? 'selo selo-doado' : 'selo selo-disponivel'}>
          {doado ? 'Doado' : 'Disponível'}
        </span>
      </div>
      <p className="item-card-descricao">{item.descricao}</p>
      <ul className="item-card-detalhes">
        <li><strong>Categoria:</strong> {item.categoriaNome}</li>
        <li><strong>Estado:</strong> {item.estadoConservacao}</li>
        <li><strong>Cidade:</strong> {item.cidade}</li>
        <li><strong>Doador:</strong> {item.usuarioNome}</li>
      </ul>
    </article>
  );
}

export default ItemCard;