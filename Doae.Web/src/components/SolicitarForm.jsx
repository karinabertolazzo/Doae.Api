import { useEffect, useState } from 'react';
import { itensApi, usuariosApi, solicitacoesApi } from '../services/api';

const formularioInicial = { itemId: '', solicitanteId: '', mensagem: '' };

function SolicitarForm({ aoSucesso, aoErro }) {
  const [form, setForm] = useState(formularioInicial);
  const [itens, setItens] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    Promise.all([itensApi.listar({ status: 'Disponivel' }), usuariosApi.listar()])
      .then(([its, usus]) => {
        setItens(its);
        setUsuarios(usus);
      })
      .catch((e) => aoErro(e.message));
  }, []);

  const alterar = (campo) => (evento) =>
    setForm({ ...form, [campo]: evento.target.value });

  const enviar = async (evento) => {
    evento.preventDefault();
    setEnviando(true);
    try {
      await solicitacoesApi.criar({
        itemId: Number(form.itemId),
        solicitanteId: Number(form.solicitanteId),
        mensagem: form.mensagem,
      });
      setForm(formularioInicial);
      aoSucesso('Solicitação enviada com sucesso!');
    } catch (e) {
      aoErro(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="formulario" onSubmit={enviar}>
      <h3>Solicitar um item</h3>
      <label>
        Item disponível
        <select value={form.itemId} onChange={alterar('itemId')} required>
          <option value="">Selecione</option>
          {itens.map((i) => (
            <option key={i.id} value={i.id}>
              {i.titulo} ({i.cidade})
            </option>
          ))}
        </select>
      </label>
      <label>
        Solicitante
        <select value={form.solicitanteId} onChange={alterar('solicitanteId')} required>
          <option value="">Selecione</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>{u.nome}</option>
          ))}
        </select>
      </label>
      <label>
        Mensagem (opcional)
        <textarea value={form.mensagem} onChange={alterar('mensagem')} rows={2} />
      </label>
      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar solicitação'}
      </button>
    </form>
  );
}

export default SolicitarForm;