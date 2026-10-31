import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { itensApi, categoriasApi } from '../services/api';
import { useSessao } from '../contexts/SessaoContext';
import Aviso from '../components/Aviso';
import './DoarPage.css';

const formularioInicial = {
  titulo: '',
  descricao: '',
  estadoConservacao: '',
  cidade: '',
  categoriaId: '',
};

function DoarPage() {
  const { usuario } = useSessao();
  const [form, setForm] = useState(formularioInicial);
  const [categorias, setCategorias] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState({ tipo: '', mensagem: '' });

  useEffect(() => {
    categoriasApi
      .listar()
      .then(setCategorias)
      .catch((e) => setAviso({ tipo: 'erro', mensagem: e.message }));
  }, []);

  useEffect(() => {
    if (usuario) {
      setForm((atual) => ({ ...atual, cidade: atual.cidade || usuario.cidade }));
    }
  }, [usuario]);

  if (!usuario) {
    return (
      <section>
        <h2>Doar um item</h2>
        <p>
          Para doar um item, você precisa estar logado.{' '}
          <Link to="/entrar">Entre ou crie sua conta.</Link>
        </p>
      </section>
    );
  }

  const alterar = (campo) => (evento) =>
    setForm({ ...form, [campo]: evento.target.value });

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await itensApi.criar({
        ...form,
        usuarioId: usuario.id,
        categoriaId: Number(form.categoriaId),
      });
      setAviso({ tipo: 'sucesso', mensagem: 'Item cadastrado com sucesso!' });
      setForm({ ...formularioInicial, cidade: usuario.cidade });
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section>
      <h2>Doar um item</h2>
      <p>
        Você está doando como <strong>{usuario.nome}</strong>.
      </p>

      <Aviso
        tipo={aviso.tipo}
        mensagem={aviso.mensagem}
        aoFechar={() => setAviso({ tipo: '', mensagem: '' })}
      />

      <form className="formulario" onSubmit={enviar}>
        <label>
          Título
          <input value={form.titulo} onChange={alterar('titulo')} required />
        </label>

        <label>
          Descrição
          <textarea
            value={form.descricao}
            onChange={alterar('descricao')}
            rows={3}
            required
          />
        </label>

        <label>
          Estado de conservação
          <input
            value={form.estadoConservacao}
            onChange={alterar('estadoConservacao')}
            placeholder="Ex.: Bom, Novo, Usado"
            required
          />
        </label>

        <label>
          Cidade
          <input value={form.cidade} onChange={alterar('cidade')} required />
        </label>

        <label>
          Categoria
          <select value={form.categoriaId} onChange={alterar('categoriaId')} required>
            <option value="">Selecione</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Cadastrar item'}
        </button>
      </form>
    </section>
  );
}

export default DoarPage;