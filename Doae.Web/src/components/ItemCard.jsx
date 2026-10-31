import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css';

const estadosConservacao = ['Novo', 'Bom estado', 'Marcas de uso', 'Reparo'];

function ItemCard({ item, usuario, categorias = [], aoEditar, aoExcluir, aoSolicitar }) {
  const [editando, setEditando] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [form, setForm] = useState({});
  const doado = item.status === 'Doado';
  const ehDono = usuario && usuario.id === item.usuarioId;

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

  const enviarSolicitacao = async (evento) => {
    evento.preventDefault();
    const sucesso = await aoSolicitar(item.id, mensagem);
    if (sucesso) {
      setSolicitando(false);
      setMensagem('');
    }
  };

  if (editando) {
    const opcoesEstado = estadosConservacao.includes(form.estadoConservacao)
      ? estadosConservacao
      : [form.estadoConservacao, ...estadosConservacao];

    return (
      <form className="item-card item-card-form" onSubmit={salvar}>
        <input value={form.titulo} onChange={alterar('titulo')} required />
        <textarea value={form.descricao} onChange={alterar('descricao')} rows={2} required />
        <select value={form.estadoConservacao} onChange={alterar('estadoConservacao')} required>
          {opcoesEstado.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
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
        <li><strong>Doador:</strong> {ehDono ? 'Você' : item.usuarioNome}</li>
      </ul>

      {solicitando ? (
        <form className="item-card-solicitar" onSubmit={enviarSolicitacao}>
          <textarea
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Mensagem para o doador (opcional)"
            rows={2}
            maxLength={300}
          />
          <div className="item-card-acoes">
            <button type="submit" className="btn-principal">Enviar pedido</button>
            <button type="button" onClick={() => setSolicitando(false)}>Cancelar</button>
          </div>
        </form>
      ) : (
        <div className="item-card-acoes">
          <Link to={`/itens/${item.id}`} className="link-detalhes">Ver detalhes</Link>
          {ehDono && !doado && <button onClick={iniciarEdicao}>Editar</button>}
          {ehDono && (
            <button className="btn-excluir" onClick={confirmarExclusao}>Excluir</button>
          )}
          {!ehDono && !doado && usuario && (
            <button className="btn-principal" onClick={() => setSolicitando(true)}>
              Solicitar
            </button>
          )}
          {!usuario && !doado && (
            <Link to="/entrar" className="link-detalhes">Entre para solicitar</Link>
          )}
        </div>
      )}
    </article>
  );
}

export default ItemCard;