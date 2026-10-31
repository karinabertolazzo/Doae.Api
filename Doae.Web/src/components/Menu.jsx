
import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSessao } from '../contexts/SessaoContext';
import './Menu.css';

function Logo() {
  return (
    <Link
      to="/"
      className="menu-logo"
      aria-label="Doaê, ir para a página inicial"
    >
      <img src="/imagens/logo.png" alt="Doaê" />
    </Link>
  );
}

function Menu() {
  const { usuario, sair } = useSessao();
  const navegar = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);

  const classe = ({ isActive }) =>
    isActive ? 'menu-link ativo' : 'menu-link';

  const classeMobile = ({ isActive }) =>
    isActive ? 'menu-mobile-link ativo' : 'menu-mobile-link';

  const fecharMenu = () => {
    setMenuAberto(false);
    window.scrollTo(0, 0);
  };

  const aoSair = () => {
    sair();
    setMenuAberto(false);
    navegar('/');
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!menuAberto) return;

    const verificarTecla = (evento) => {
      if (evento.key === 'Escape') {
        setMenuAberto(false);
      }
    };

    window.addEventListener('keydown', verificarTecla);

    return () => {
      window.removeEventListener('keydown', verificarTecla);
    };
  }, [menuAberto]);

  return (
    <header className="menu">
      <div className="menu-conteudo">
        <Logo />

        <nav
          className="menu-links"
          aria-label="Navegação principal"
        >
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
              <span className="menu-avatar">
                {usuario.nome.charAt(0).toUpperCase()}
              </span>

              <span className="menu-nome">
                {usuario.nome}
              </span>

              <button
                type="button"
                className="menu-sair"
                onClick={aoSair}
              >
                Sair
              </button>
            </div>
          ) : (
            <NavLink to="/entrar" className="menu-entrar">
              Entrar
            </NavLink>
          )}
        </div>

        <div className="menu-mobile-acoes">
          <Link
            to="/doar"
            className="menu-mobile-doar"
            onClick={fecharMenu}
          >
            + Doar
          </Link>

          <button
            type="button"
            className="menu-hamburguer"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label={
              menuAberto ? 'Fechar menu' : 'Abrir menu'
            }
            aria-expanded={menuAberto}
            aria-controls="navegacao-mobile"
          >
            {menuAberto ? (
              <span className="menu-fechar-icone">
                ✕
              </span>
            ) : (
              <>
                <span />
                <span />
                <span />
              </>
            )}
          </button>
        </div>

        {menuAberto && (
          <nav
            id="navegacao-mobile"
            className="menu-mobile"
            aria-label="Navegação no celular"
          >
            <NavLink
              to="/"
              end
              className={classeMobile}
              onClick={fecharMenu}
            >
              Início
              <span>›</span>
            </NavLink>

            <NavLink
              to="/sobre"
              className={classeMobile}
              onClick={fecharMenu}
            >
              Sobre
              <span>›</span>
            </NavLink>

            <NavLink
              to="/itens"
              end
              className={classeMobile}
              onClick={fecharMenu}
            >
              Explorar itens
              <span>›</span>
            </NavLink>

            {usuario && (
              <NavLink
                to="/minha-conta"
                className={classeMobile}
                onClick={fecharMenu}
              >
                Minha conta
                <span>›</span>
              </NavLink>
            )}

            <Link
              to="/doar"
              className="menu-mobile-doar-grande"
              onClick={fecharMenu}
            >
              + Quero doar
            </Link>

            <div className="menu-mobile-rodape">
              {usuario ? (
                <>
                  <Link
                    to="/minha-conta"
                    className="menu-mobile-perfil"
                    onClick={fecharMenu}
                  >
                    <span className="menu-avatar">
                      {usuario.nome.charAt(0).toUpperCase()}
                    </span>

                    <span className="menu-mobile-perfil-dados">
                      <strong>{usuario.nome}</strong>
                      <small>Ver minha conta</small>
                    </span>
                  </Link>

                  <button
                    type="button"
                    className="menu-mobile-sair"
                    onClick={aoSair}
                  >
                    Sair da conta
                  </button>
                </>
              ) : (
                <Link
                  to="/entrar"
                  className="menu-mobile-entrar"
                  onClick={fecharMenu}
                >
                  Entrar ou criar conta
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Menu;
