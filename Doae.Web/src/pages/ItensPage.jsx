
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  itensApi,
  categoriasApi,
  solicitacoesApi,
} from '../services/api';
import { useSessao } from '../contexts/SessaoContext';
import ItemCard from '../components/ItemCard';
import Aviso from '../components/Aviso';
import './ItensPage.css';

const filtrosIniciais = {
  busca: '',
  categoriaId: '',
  cidade: '',
  status: '',
};

function cidadesUnicas(itens) {
  const mapa = new Map();

  itens.forEach((i) => {
    const chave = i.cidade.trim().toLowerCase();

    if (chave && !mapa.has(chave)) {
      mapa.set(chave, i.cidade.trim());
    }
  });

  return [...mapa.values()].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  );
}

function ItensPage() {
  const { usuario } = useSessao();
  const [parametros] = useSearchParams();

  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cidades, setCidades] = useState([]);

  // Guarda os IDs dos itens já solicitados pelo usuário.
  const [idsSolicitados, setIdsSolicitados] = useState(
    () => new Set()
  );

  const [filtros, setFiltros] = useState({
    ...filtrosIniciais,
    categoriaId: parametros.get('categoriaId') ?? '',
    status: parametros.get('status') ?? '',
  });

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [versao, setVersao] = useState(0);

  // Carrega as categorias.
  useEffect(() => {
    categoriasApi
      .listar()
      .then(setCategorias)
      .catch((e) => setErro(e.message));
  }, []);

  // Carrega as cidades disponíveis.
  useEffect(() => {
    itensApi
      .listar()
      .then((todos) => {
        setCidades(cidadesUnicas(todos));
      })
      .catch((e) => setErro(e.message));
  }, [versao]);

  // Carrega os itens e as solicitações do usuário.
  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      setCarregando(true);

      try {
        const [listaItens, minhasSolicitacoes] =
          await Promise.all([
            itensApi.listar(filtros),

            usuario
              ? solicitacoesApi.listar({
                  solicitanteId: usuario.id,
                })
              : Promise.resolve([]),
          ]);

        if (!ativo) return;

        setItens(listaItens);

        // Considera somente pedidos pendentes.
        const pendentes = minhasSolicitacoes.filter(
          (s) => s.status === 'Pendente'
        );

        const ids = new Set(
          pendentes.map((s) => s.itemId)
        );

        setIdsSolicitados(ids);
        setErro('');
      } catch (e) {
        if (ativo) {
          setErro(e.message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    carregar();

    return () => {
      ativo = false;
    };
  }, [filtros, versao, usuario?.id]);

  const alterarFiltro = (campo) => (evento) => {
    setFiltros((atual) => ({
      ...atual,
      [campo]: evento.target.value,
    }));
  };

  const executar = async (acao, textoSucesso) => {
    try {
      await acao();

      setSucesso(textoSucesso);
      setErro('');

      // Atualiza os itens e as solicitações.
      setVersao((v) => v + 1);

      return true;
    } catch (e) {
      setErro(e.message);
      setSucesso('');

      return false;
    }
  };

  const editar = (id, dados) =>
    executar(
      () => itensApi.atualizar(id, dados),
      'Item atualizado com sucesso!'
    );

  const excluir = (id) =>
    executar(
      () => itensApi.remover(id),
      'Item excluído com sucesso!'
    );

  const solicitar = (itemId, mensagem) =>
    executar(
      () =>
        solicitacoesApi.criar({
          itemId,
          solicitanteId: usuario.id,
          mensagem,
        }),
      'Pedido enviado! Acompanhe em Minha conta.'
    );

  return (
    <section>
      <h2>Itens para doação</h2>

      <Aviso
        tipo="erro"
        mensagem={erro}
        aoFechar={() => setErro('')}
      />

      <Aviso
        tipo="sucesso"
        mensagem={sucesso}
        aoFechar={() => setSucesso('')}
      />

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por título ou descrição"
          value={filtros.busca}
          onChange={alterarFiltro('busca')}
        />

        <select
          value={filtros.categoriaId}
          onChange={alterarFiltro('categoriaId')}
        >
          <option value="">Todas as categorias</option>

          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>

        <select
          value={filtros.cidade}
          onChange={alterarFiltro('cidade')}
        >
          <option value="">Todas as cidades</option>

          {cidades.map((cidade) => (
            <option key={cidade} value={cidade}>
              {cidade}
            </option>
          ))}
        </select>

        <select
          value={filtros.status}
          onChange={alterarFiltro('status')}
        >
          <option value="">Todos os status</option>
          <option value="Disponivel">Disponível</option>
          <option value="Reservado">Reservado</option>
          <option value="Doado">Doado</option>
        </select>

        <button
          type="button"
          onClick={() => setFiltros({ ...filtrosIniciais })}
        >
          Limpar
        </button>
      </div>

      {carregando && <p>Carregando...</p>}

      {!carregando && itens.length === 0 && !erro && (
        <p>Nenhum item encontrado.</p>
      )}

      {!carregando && (
        <div className="itens-grade">
          {itens.map((item) => (
            <ItemCard
              key={`${usuario?.id ?? 'anon'}-${item.id}`}
              item={item}
              usuario={usuario}
              categorias={categorias}
              aoEditar={editar}
              aoExcluir={excluir}
              aoSolicitar={solicitar}

              // Informa ao card se já existe pedido pendente.
              jaSolicitou={idsSolicitados.has(item.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ItensPage;
