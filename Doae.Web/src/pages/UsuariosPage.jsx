import { useEffect, useState } from 'react';
import { usuariosApi } from '../services/api';
import Aviso from '../components/Aviso';
import './UsuariosPage.css';

const formularioInicial = { nome: '', email: '', telefone: '', cidade: '' };

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(formularioInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState({ tipo: '', mensagem: '' });

  const carregar = () =>
    usuariosApi
      .listar()
      .then(setUsuarios)
      .catch((e) => setAviso({ tipo: 'erro', mensagem: e.message }));

  useEffect(() => {
    carregar();
  }, []);

  const alterar = (campo) => (evento) =>
    setForm({ ...form, [campo]: evento.target.value });

  const cancelarEdicao = () => {
    setEditandoId(null);
    setForm(formularioInicial);
  };

  const iniciarEdicao = (usuario) => {
    setEditandoId(usuario.id);
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone ?? '',
      cidade: usuario.cidade,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      if (editandoId) {
        await usuariosApi.atualizar(editandoId, form);
        setAviso({ tipo: 'sucesso', mensagem: 'Usuário atualizado com sucesso!' });
      } else {
        await usuariosApi.criar(form);
        setAviso({ tipo: 'sucesso', mensagem: 'Usuário cadastrado com sucesso!' });
      }
      cancelarEdicao();
      await carregar();
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    } finally {
      setEnviando(false);
    }
  };

  const excluir = async (usuario) => {
    if (!window.confirm(`Excluir o usuário "${usuario.nome}"?`)) return;
    try {
      await usuariosApi.remover(usuario.id);
      setAviso({ tipo: 'sucesso', mensagem: 'Usuário excluído com sucesso!' });
      if (editandoId === usuario.id) cancelarEdicao();
      await carregar();
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    }
  };

  return (
    <section>
      <h2>Usuários</h2>

      <Aviso
        tipo={aviso.tipo}
        mensagem={aviso.mensagem}
        aoFechar={() => setAviso({ tipo: '', mensagem: '' })}
      />

      <form className="formulario" onSubmit={enviar}>
        <h3>{editandoId ? 'Editar usuário' : 'Novo usuário'}</h3>
        <label>
          Nome
          <input value={form.nome} onChange={alterar('nome')} required />
        </label>
        <label>
          E-mail
          <input type="email" value={form.email} onChange={alterar('email')} required />
        </label>
        <label>
          Telefone
          <input value={form.telefone} onChange={alterar('telefone')} />
        </label>
        <label>
          Cidade
          <input value={form.cidade} onChange={alterar('cidade')} required />
        </label>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : editandoId ? 'Salvar alterações' : 'Cadastrar usuário'}
        </button>
        {editandoId && (
          <button type="button" className="btn-secundario" onClick={cancelarEdicao}>
            Cancelar edição
          </button>
        )}
      </form>

      <h3 className="usuarios-titulo-lista">Usuários cadastrados</h3>
      {usuarios.length === 0 && <p>Nenhum usuário cadastrado.</p>}
      <ul className="usuarios-lista">
        {usuarios.map((u) => (
          <li key={u.id}>
            <div className="usuario-dados">
              <strong>{u.nome}</strong>
              <span>{u.email}</span>
              <span>{u.cidade}</span>
            </div>
            <div className="usuario-acoes">
              <button onClick={() => iniciarEdicao(u)}>Editar</button>
              <button className="btn-excluir" onClick={() => excluir(u)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default UsuariosPage;