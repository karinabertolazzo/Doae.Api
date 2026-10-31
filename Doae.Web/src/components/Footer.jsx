
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const voltarAoTopo = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  };

  return (
    <footer className="doae-footer">
      <div className="doae-footer-container">
        <div className="doae-footer-convite">
          <div className="doae-footer-convite-texto">
            <span className="doae-footer-etiqueta">
              PEQUENOS GESTOS, GRANDES MUDANÇAS
            </span>

            <h2>
              Um novo destino para o que você não usa.
              <span> Uma nova oportunidade para alguém.</span>
            </h2>

            <p>
              Faça parte de uma comunidade que transforma
              objetos em solidariedade e sustentabilidade.
            </p>
          </div>

          <Link
            to="/doar"
            className="doae-footer-botao"
            onClick={voltarAoTopo}
          >
            Quero fazer uma doação
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="doae-footer-conteudo">
          <div className="doae-footer-marca">
            <Link
              to="/"
              aria-label="Doaê - Página inicial"
              onClick={voltarAoTopo}
            >
              <img
                src="/imagens/logo.png"
                alt="Doaê"
                className="doae-footer-logo"
              />
            </Link>

            <p>
              Conectando pessoas, incentivando a reutilização
              e construindo um futuro mais solidário.
            </p>

            <span className="doae-footer-mensagem">
              ♡ Doe. Compartilhe. Transforme.
            </span>
          </div>

          <nav
            className="doae-footer-coluna"
            aria-label="Navegação do rodapé"
          >
            <h3>Navegação</h3>

            <Link to="/" onClick={voltarAoTopo}>
              Início
            </Link>

            <Link to="/sobre" onClick={voltarAoTopo}>
              Sobre o Doaê
            </Link>

            <Link to="/itens" onClick={voltarAoTopo}>
              Explorar itens
            </Link>
          </nav>

          <div className="doae-footer-sustentabilidade">
            <span className="doae-footer-ods">
              <span aria-hidden="true">✦</span>
              ODS 11
            </span>

            <h3>Cidades e comunidades sustentáveis</h3>

            <p>
              Menos desperdício, mais reutilização
              e novas oportunidades para todos.
            </p>
          </div>
        </div>

        <div className="doae-footer-inferior">
          <p>
            © {new Date().getFullYear()} Doaê.
            Todos os direitos reservados.
          </p>

          <p>
            Feito para conectar pessoas e transformar vidas.
            <span aria-hidden="true"> ♡</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
