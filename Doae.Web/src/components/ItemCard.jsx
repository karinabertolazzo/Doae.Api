import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icone from './Icone';
import './ItemCard.css';

const estadosConservacao = ['Novo', 'Bom estado', 'Marcas de uso', 'Reparo'];

const imagensCategoria = {
  Móveis: '/imagens/moveis.png',
  Roupas: '/imagens/roupas.png',
  Livros: '/imagens/livros.png',
  Eletrodomésticos: '/imagens/eletro.png',
  Outros: '/imagens/outros.png',
};

function ItemCard({
  item,
  usuario,
  categorias = [],
  aoEditar,
  aoExcluir,
  aoSolicitar,
  jaSolicitou = false,
}) {
  const [editando, setEditando] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [form, setForm] = useState({});

  const doado = item.status === 'Doado';
  const reservado = item.status === 'Reservado';
  const disponivel = item.status === 'Disponivel';

  const ehDono = usuario?.id === item.usuarioId;
  const pedidoJaFeito = jaSolicitou || pedidoEnviado;

  const classeSelo = doado
    ? 'selo selo-doado'
    : reservado
      ? 'selo selo-reservado'
      : 'selo selo-disponivel';

  const textoSelo = doado ? 'Doado' : reservado ? 'Reservado' : 'Disponível';

  const imagem = imagensCategoria[item.categoriaNome];

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

  const alterar = (campo) => (evento) => {
    setForm({ ...form, [campo]: evento.target.value });
  };

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
      setPedidoEnviado(true);
    }
  };

  if (editando) {
    const opcoesEstado = estadosConservacao.includes(form.estadoConservacao)
      ? estadosConservacao
      : [form.estadoConservacao, ...estadosConservacao];

    return (
      <form className="item-card item-card-form" onSubmit={salvar}>
        <input value={form.titulo} onChange={alterar('titulo')} required />

        <textarea
          value={form.descricao}
          onChange={alterar('descricao')}
          rows={2}
          required
        />

        <select
          value={form.estadoConservacao}
          onChange={alterar('estadoConservacao')}
          required
        >
          {opcoesEstado.map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>

        <input value={form.cidade} onChange={alterar('cidade')} required />

        <select value={form.categoriaId} onChange={alterar('categoriaId')} required>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <div className="item-card-acoes">
          <button type="submit" className="btn-confirmar">
            Salvar
          </button>
          <button type="button" onClick={() => setEditando(false)}>
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <article className="item-card">
      <div
        className="item-card-imagem"
        style={imagem ? { backgroundImage: `url(${imagem})` } : undefined}
        role="img"
        aria-label={`Categoria ${item.categoriaNome}`}
      />

      <div className="item-card-corpo">
        <div className="item-card-topo">
          <h3>{item.titulo}</h3>
          <span className={classeSelo}>{textoSelo}</span>
        </div>

        <p className="item-card-descricao">{item.descricao}</p>

        <ul className="item-card-detalhes">
          <li>
            <Icone nome="pasta" tamanho={16} />
            <span>
              <strong>Categoria:</strong> {item.categoriaNome}
            </span>
          </li>
          <li>
            <Icone nome="escudo" tamanho={16} />
            <span>
              <strong>Estado:</strong> {item.estadoConservacao}
            </span>
          </li>
          <li>
            <Icone nome="pin" tamanho={16} />
            <span>
              <strong>Cidade:</strong> {item.cidade}
            </span>
          </li>
          <li>
            <Icone nome="pessoa" tamanho={16} />
            <span>
              <strong>Doador:</strong> {ehDono ? 'Você' : item.usuarioNome}
            </span>
          </li>
        </ul>
      </div>

      <div className="item-card-rodape">
        {solicitando && disponivel && !pedidoJaFeito ? (
          <form className="item-card-solicitar" onSubmit={enviarSolicitacao}>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Mensagem para o doador (opcional)"
              rows={2}
              maxLength={300}
            />

            <div className="item-card-acoes">
              <button type="submit" className="btn-confirmar">
                Enviar pedido
              </button>
              <button type="button" onClick={() => setSolicitando(false)}>
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="item-card-acoes">
            <Link to={`/itens/${item.id}`} className="link-detalhes">
              <Icone nome="olho" tamanho={17} />
              Ver detalhes
            </Link>

            {ehDono && disponivel && aoEditar && (
              <button type="button" onClick={iniciarEdicao}>
                Editar
              </button>
            )}

            {ehDono && aoExcluir && (
              <button type="button" className="btn-excluir" onClick={confirmarExclusao}>
                Excluir
              </button>
            )}

            {!ehDono &&
              disponivel &&
              usuario &&
              (pedidoJaFeito ? (
                <button type="button" className="btn-solicitar" disabled>
                  Já solicitado
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-solicitar"
                  onClick={() => setSolicitando(true)}
                >
                  <Icone nome="enviar" tamanho={17} />
                  Solicitar
                </button>
              ))}

            {!usuario && disponivel && (
              <Link to="/entrar" className="link-solicitar">
                <Icone nome="enviar" tamanho={17} />
                Entre para solicitar
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default ItemCard;