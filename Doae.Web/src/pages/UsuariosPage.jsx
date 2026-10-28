import { useEffect, useState } from 'react';
import { usuariosApi } from '../services/api';
import Aviso from '../components/Aviso';
import './UsuariosPage.css';

const formularioInicial = { nome: '', email: '', telefone: '', cidade: '' };

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(formularioInicial);
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

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await usuariosApi.criar(form);
      setAviso({ tipo: 'sucesso', mensagem: 'Usuário cadastrado com sucesso!' });
      setForm(formularioInicial);
      await carregar();
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    } finally {
      setEnviando(false);
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
          {enviando ? 'Enviando...' : 'Cadastrar usuário'}
        </button>
      </form>

      <h3 className="usuarios-titulo-lista">Usuários cadastrados</h3>
      {usuarios.length === 0 && <p>Nenhum usuário cadastrado.</p>}
      <ul className="usuarios-lista">
        {usuarios.map((u) => (
          <li key={u.id}>
            <strong>{u.nome}</strong>
            <span>{u.email}</span>
            <span>{u.cidade}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default UsuariosPage;