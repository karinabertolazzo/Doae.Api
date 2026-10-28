import { useEffect, useState } from 'react';
import { solicitacoesApi } from '../services/api';
import SolicitacaoCard from '../components/SolicitacaoCard';
import Aviso from '../components/Aviso';
import './SolicitacoesPage.css';

function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [status, setStatus] = useState('');
  const [aviso, setAviso] = useState({ tipo: '', mensagem: '' });

  const carregar = () =>
    solicitacoesApi
      .listar({ status })
      .then(setSolicitacoes)
      .catch((e) => setAviso({ tipo: 'erro', mensagem: e.message }));

  useEffect(() => {
    carregar();
  }, [status]);

  const executar = (acao, textoSucesso) => async (id) => {
    try {
      await acao(id);
      setAviso({ tipo: 'sucesso', mensagem: textoSucesso });
      await carregar();
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    }
  };

  return (
    <section>
      <h2>Solicitações</h2>

      <Aviso
        tipo={aviso.tipo}
        mensagem={aviso.mensagem}
        aoFechar={() => setAviso({ tipo: '', mensagem: '' })}
      />

      <div className="solicitacoes-filtro">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Aceita">Aceita</option>
          <option value="Recusada">Recusada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      {solicitacoes.length === 0 && <p>Nenhuma solicitação encontrada.</p>}

      <div className="solicitacoes-lista">
        {solicitacoes.map((s) => (
          <SolicitacaoCard
            key={s.id}
            solicitacao={s}
            aoAceitar={executar(solicitacoesApi.aceitar, 'Solicitação aceita! O item foi marcado como doado.')}
            aoRecusar={executar(solicitacoesApi.recusar, 'Solicitação recusada.')}
            aoCancelar={executar(solicitacoesApi.cancelar, 'Solicitação cancelada.')}
          />
        ))}
      </div>
    </section>
  );
}

export default SolicitacoesPage;