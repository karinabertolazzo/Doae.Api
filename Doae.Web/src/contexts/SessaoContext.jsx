import { createContext, useContext, useState } from 'react';

const CHAVE = 'doae-usuario';
const SessaoContext = createContext(null);

function lerUsuarioSalvo() {
  try {
    const texto = localStorage.getItem(CHAVE);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}

export function SessaoProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuarioSalvo);

  const entrar = (dados) => {
    setUsuario(dados);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch {
      // sem armazenamento disponível: a sessão vale só até recarregar a página
    }
  };

  const sair = () => {
    setUsuario(null);
    try {
      localStorage.removeItem(CHAVE);
    } catch {
      // ignora
    }
  };

  return (
    <SessaoContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </SessaoContext.Provider>
  );
}

export function useSessao() {
  return useContext(SessaoContext);
}