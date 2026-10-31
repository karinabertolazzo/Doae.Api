
import { createContext, useContext, useState } from 'react';

const CHAVE = 'doae-sessao';
const CHAVE_ANTIGA = 'doae-usuario';

const SessaoContext = createContext(null);

function lerSessaoSalva() {
  try {
    const texto = sessionStorage.getItem(CHAVE);
    const sessao = texto ? JSON.parse(texto) : null;

    if (!sessao?.token || !sessao?.usuario?.id) {
      return null;
    }

    return sessao;
  } catch {
    return null;
  }
}

export function SessaoProvider({ children }) {
  const [sessao, setSessao] = useState(lerSessaoSalva);

  const entrar = (dados) => {
    if (!dados?.token || !dados?.usuario?.id) {
      throw new Error('Resposta de login inválida.');
    }

    const novaSessao = {
      usuario: dados.usuario,
      token: dados.token,
    };

    setSessao(novaSessao);

    try {
      sessionStorage.setItem(
        CHAVE,
        JSON.stringify(novaSessao)
      );

      localStorage.removeItem(CHAVE_ANTIGA);
    } catch {
      // Sessão continua funcionando em memória.
    }
  };

  const sair = () => {
    setSessao(null);

    try {
      sessionStorage.removeItem(CHAVE);
      localStorage.removeItem(CHAVE_ANTIGA);
    } catch {
      // Ignora falhas de armazenamento.
    }
  };

  return (
    <SessaoContext.Provider
      value={{
        usuario: sessao?.usuario ?? null,
        token: sessao?.token ?? null,
        entrar,
        sair,
      }}
    >
      {children}
    </SessaoContext.Provider>
  );
}

export function useSessao() {
  return useContext(SessaoContext);
}
