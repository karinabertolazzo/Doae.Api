const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5053/api';

function extrairMensagemDeErro(dados, status) {
  if (dados?.errors) {
    return Object.values(dados.errors).flat().join(' ');
  }
  if (dados?.detail) return dados.detail;
  if (dados?.title) return dados.title;
  return `Erro inesperado (código ${status}).`;
}

async function requisicao(caminho, opcoes = {}) {
  let resposta;

  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se ela está rodando.');
  }

  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(extrairMensagemDeErro(dados, resposta.status));
  }

  return dados;
}

function montarQuery(filtros = {}) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== '' && valor !== null && valor !== undefined) {
      params.append(chave, valor);
    }
  });
  const texto = params.toString();
  return texto ? `?${texto}` : '';
}

const enviar = (metodo, corpo) => ({
  method: metodo,
  body: corpo ? JSON.stringify(corpo) : undefined,
});

export const categoriasApi = {
  listar: () => requisicao('/categorias'),
};

export const usuariosApi = {
  listar: () => requisicao('/usuarios'),
  criar: (dados) => requisicao('/usuarios', enviar('POST', dados)),
  atualizar: (id, dados) => requisicao(`/usuarios/${id}`, enviar('PUT', dados)),
  remover: (id) => requisicao(`/usuarios/${id}`, enviar('DELETE')),
};

export const itensApi = {
  listar: (filtros) => requisicao(`/itens${montarQuery(filtros)}`),
  buscar: (id) => requisicao(`/itens/${id}`),
  criar: (dados) => requisicao('/itens', enviar('POST', dados)),
  atualizar: (id, dados) => requisicao(`/itens/${id}`, enviar('PUT', dados)),
  remover: (id) => requisicao(`/itens/${id}`, enviar('DELETE')),
};

export const solicitacoesApi = {
  listar: (filtros) => requisicao(`/solicitacoes${montarQuery(filtros)}`),
  criar: (dados) => requisicao('/solicitacoes', enviar('POST', dados)),
  aceitar: (id) => requisicao(`/solicitacoes/${id}/aceitar`, enviar('PATCH')),
  recusar: (id) => requisicao(`/solicitacoes/${id}/recusar`, enviar('PATCH')),
  cancelar: (id) => requisicao(`/solicitacoes/${id}/cancelar`, enviar('PATCH')),
};