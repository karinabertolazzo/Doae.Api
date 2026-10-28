import { useEffect, useState } from 'react';
import { itensApi, categoriasApi, usuariosApi } from '../services/api';
import Aviso from '../components/Aviso';
import './DoarPage.css';

const formularioInicial = {
  titulo: '',
  descricao: '',
  estadoConservacao: '',
  cidade: '',
  usuarioId: '',
  categoriaId: '',
};

function DoarPage() {
  const [form, setForm] = useState(formularioInicial);
  const [categorias, setCategorias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState({ tipo: '', mensagem: '' });

  useEffect(() => {
    Promise.all([categoriasApi.listar(), usuariosApi.listar()])
      .then(([cats, usus]) => {
        setCategorias(cats);
        setUsuarios(usus);
      })
      .catch((e) => setAviso({ tipo: 'erro', mensagem: e.message }));
  }, []);

  const alterar = (campo) => (evento) =>
    setForm({ ...form, [campo]: evento.target.value });

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await itensApi.criar({
        ...form,
        usuarioId: Number(form.usuarioId),
        categoriaId: Number(form.categoriaId),
      });
      setAviso({ tipo: 'sucesso', mensagem: 'Item cadastrado com sucesso!' });
      setForm(formularioInicial);
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section>
      <h2>Doar um item</h2>

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
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </label>

        <label>
          Doador
          <select value={form.usuarioId} onChange={alterar('usuarioId')} required>
            <option value="">Selecione</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>{u.nome}</option>
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