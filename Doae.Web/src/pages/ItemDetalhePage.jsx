import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { itensApi, solicitacoesApi } from '../services/api';
import SolicitacaoCard from '../components/SolicitacaoCard';
import Aviso from '../components/Aviso';
import './ItemDetalhePage.css';

function ItemDetalhePage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState({ tipo: '', mensagem: '' });

  const carregar = async () => {
    try {
      const [dadosItem, dadosSolicitacoes] = await Promise.all([
        itensApi.buscar(id),
        solicitacoesApi.listar({ itemId: id }),
      ]);
      setItem(dadosItem);
      setSolicitacoes(dadosSolicitacoes);
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, [id]);

  const executar = (acao, textoSucesso) => async (solicitacaoId) => {
    try {
      await acao(solicitacaoId);
      setAviso({ tipo: 'sucesso', mensagem: textoSucesso });
      await carregar();
    } catch (e) {
      setAviso({ tipo: 'erro', mensagem: e.message });
    }
  };

  if (carregando) return <p>Carregando...</p>;

  return (
    <section>
      <Link to="/" className="detalhe-voltar">← Voltar para os itens</Link>

      <Aviso
        tipo={aviso.tipo}
        mensagem={aviso.mensagem}
        aoFechar={() => setAviso({ tipo: '', mensagem: '' })}
      />

      {item && (
        <>
          <div className="detalhe-topo">
            <h2>{item.titulo}</h2>
            <span className={item.status === 'Doado' ? 'selo selo-doado' : 'selo selo-disponivel'}>
              {item.status === 'Doado' ? 'Doado' : 'Disponível'}
            </span>
          </div>

          <p>{item.descricao}</p>
          <ul className="detalhe-info">
            <li><strong>Categoria:</strong> {item.categoriaNome}</li>
            <li><strong>Estado de conservação:</strong> {item.estadoConservacao}</li>
            <li><strong>Cidade:</strong> {item.cidade}</li>
            <li><strong>Doador:</strong> {item.usuarioNome}</li>
            <li><strong>Cadastrado em:</strong> {new Date(item.criadoEm).toLocaleDateString('pt-BR')}</li>
          </ul>

          <h3>Solicitações para este item</h3>
          {solicitacoes.length === 0 && <p>Ninguém solicitou este item ainda.</p>}
          <div className="detalhe-solicitacoes">
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
        </>
      )}
    </section>
  );
}

export default ItemDetalhePage;