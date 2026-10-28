import { useEffect, useState } from 'react';
import { itensApi, categoriasApi } from '../services/api';
import ItemCard from '../components/ItemCard';
import Aviso from '../components/Aviso';
import './ItensPage.css';

const filtrosIniciais = { busca: '', categoriaId: '', cidade: '', status: '' };

function ItensPage() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    categoriasApi
      .listar()
      .then(setCategorias)
      .catch((e) => setErro(e.message));
  }, []);

  useEffect(() => {
    setCarregando(true);
    itensApi
      .listar(filtros)
      .then((dados) => {
        setItens(dados);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [filtros, versao]);

  const alterarFiltro = (campo) => (evento) =>
    setFiltros({ ...filtros, [campo]: evento.target.value });

  const editar = async (id, dados) => {
    try {
      await itensApi.atualizar(id, dados);
      setSucesso('Item atualizado com sucesso!');
      setErro('');
      setVersao((v) => v + 1);
      return true;
    } catch (e) {
      setErro(e.message);
      setSucesso('');
      return false;
    }
  };

  const excluir = async (id) => {
    try {
      await itensApi.remover(id);
      setSucesso('Item excluído com sucesso!');
      setErro('');
      setVersao((v) => v + 1);
    } catch (e) {
      setErro(e.message);
      setSucesso('');
    }
  };

  return (
    <section>
      <h2>Itens para doação</h2>

      <Aviso tipo="erro" mensagem={erro} aoFechar={() => setErro('')} />
      <Aviso tipo="sucesso" mensagem={sucesso} aoFechar={() => setSucesso('')} />

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por título ou descrição"
          value={filtros.busca}
          onChange={alterarFiltro('busca')}
        />
        <select value={filtros.categoriaId} onChange={alterarFiltro('categoriaId')}>
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Cidade"
          value={filtros.cidade}
          onChange={alterarFiltro('cidade')}
        />
        <select value={filtros.status} onChange={alterarFiltro('status')}>
          <option value="">Todos os status</option>
          <option value="Disponivel">Disponível</option>
          <option value="Doado">Doado</option>
        </select>
        <button onClick={() => setFiltros(filtrosIniciais)}>Limpar</button>
      </div>

      {carregando && <p>Carregando...</p>}

      {!carregando && itens.length === 0 && !erro && (
        <p>Nenhum item encontrado.</p>
      )}

      <div className="itens-grade">
        {itens.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            categorias={categorias}
            aoEditar={editar}
            aoExcluir={excluir}
          />
        ))}
      </div>
    </section>
  );
}

export default ItensPage;