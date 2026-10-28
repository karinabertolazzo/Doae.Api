import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css';

function ItemCard({ item, categorias = [], aoEditar, aoExcluir }) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({});
  const doado = item.status === 'Doado';

  const iniciarEdicao = () => {
    setForm({
      titulo: item.titulo,
      descricao: item.descricao,
      estadoConservacao: item.estadoConservacao,
      cidade: item.cidade,
      categoriaId: item.categoriaId,
      usuarioId: item.usuarioId,
    });
    setEditando(true);
  };

  const alterar = (campo) => (evento) =>
    setForm({ ...form, [campo]: evento.target.value });

  const salvar = async (evento) => {
    evento.preventDefault();
    const sucesso = await aoEditar(item.id, {
      ...form,
      categoriaId: Number(form.categoriaId),
      usuarioId: Number(form.usuarioId),
    });
    if (sucesso) setEditando(false);
  };

  const confirmarExclusao = () => {
    if (window.confirm(`Excluir o item "${item.titulo}"?`)) {
      aoExcluir(item.id);
    }
  };

  if (editando) {
    return (
      <form className="item-card item-card-form" onSubmit={salvar}>
        <input value={form.titulo} onChange={alterar('titulo')} required />
        <textarea value={form.descricao} onChange={alterar('descricao')} rows={2} required />
        <input value={form.estadoConservacao} onChange={alterar('estadoConservacao')} required />
        <input value={form.cidade} onChange={alterar('cidade')} required />
        <select value={form.categoriaId} onChange={alterar('categoriaId')} required>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <div className="item-card-acoes">
          <button type="submit" className="btn-principal">Salvar</button>
          <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
        </div>
      </form>
    );
  }

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
      <div className="item-card-acoes">
        <Link to={`/itens/${item.id}`} className="link-detalhes">Ver detalhes</Link>
        {!doado && <button onClick={iniciarEdicao}>Editar</button>}
        <button className="btn-excluir" onClick={confirmarExclusao}>Excluir</button>
      </div>
    </article>
  );
}

export default ItemCard;