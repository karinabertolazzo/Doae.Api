import { NavLink, useNavigate } from 'react-router-dom';
import { useSessao } from '../contexts/SessaoContext';
import './Menu.css';

function Menu() {
  const { usuario, sair } = useSessao();
  const navegar = useNavigate();

  const classe = ({ isActive }) => (isActive ? 'menu-link ativo' : 'menu-link');

  const aoSair = () => {
    sair();
    navegar('/');
  };

  return (
    <header className="menu">
      <div className="menu-conteudo">
        <span className="menu-logo">Doaê</span>
        <nav className="menu-links">
          <NavLink to="/" end className={classe}>
            Itens
          </NavLink>
          {usuario && (
            <>
              <NavLink to="/doar" className={classe}>
                Doar um item
              </NavLink>
              <NavLink to="/solicitacoes" className={classe}>
                Solicitações
              </NavLink>
            </>
          )}
        </nav>
        <div className="menu-usuario">
          {usuario ? (
            <>
              <span className="menu-saudacao">Olá, {usuario.nome}</span>
              <button className="menu-sair" onClick={aoSair}>
                Sair
              </button>
            </>
          ) : (
            <NavLink to="/entrar" className="menu-entrar">
              Entrar
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

export default Menu;