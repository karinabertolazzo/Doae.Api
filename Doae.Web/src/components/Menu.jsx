import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSessao } from '../contexts/SessaoContext';
import './Menu.css';

function Logo() {
  return (
    <Link to="/" className="menu-logo" aria-label="Doaê, ir para a página inicial">
      <img src="/imagens/logo.png" alt="Doaê" />
    </Link>
  );
}

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
        <Logo />

        <nav className="menu-links">
          <NavLink to="/" end className={classe}>
            Início
          </NavLink>
          <NavLink to="/sobre" className={classe}>
            Sobre
          </NavLink>
          <NavLink to="/itens" end className={classe}>
            Explorar itens
          </NavLink>
          {usuario && (
            <NavLink to="/minha-conta" className={classe}>
              Minha conta
            </NavLink>
          )}
        </nav>

        <div className="menu-acoes">
          <Link to="/doar" className="menu-doar">
            + Quero doar
          </Link>

          {usuario ? (
            <div className="menu-usuario">
              <span className="menu-avatar">{usuario.nome.charAt(0).toUpperCase()}</span>
              <span className="menu-nome">{usuario.nome}</span>
              <button className="menu-sair" onClick={aoSair}>
                Sair
              </button>
            </div>
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