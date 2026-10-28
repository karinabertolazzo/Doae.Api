import { NavLink } from 'react-router-dom';
import './Menu.css';

const links = [
  { para: '/', texto: 'Itens' },
  { para: '/doar', texto: 'Doar um item' },
  { para: '/solicitacoes', texto: 'Solicitações' },
  { para: '/usuarios', texto: 'Usuários' },
];

function Menu() {
  return (
    <header className="menu">
      <div className="menu-conteudo">
        <span className="menu-logo">Doaê</span>
        <nav className="menu-links">
          {links.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              end={link.para === '/'}
              className={({ isActive }) =>
                isActive ? 'menu-link ativo' : 'menu-link'
              }
            >
              {link.texto}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Menu;