import { Link } from 'react-router-dom';
import './SobrePage.css';

const realidades = [
  { imagem: '/imagens/sofa.png', titulo: 'Móveis nas ruas', texto: 'Sofás e outros móveis em bom estado são abandonados, prejudicando a cidade.' },
  { imagem: '/imagens/residuo.png', titulo: 'Acúmulo de resíduos', texto: 'O descarte incorreto gera entulho, atrai pragas e causa problemas de saúde.' },
  { imagem: '/imagens/cidade.png', titulo: 'Uma cidade mais limpa', texto: 'Com a doação e o reaproveitamento, construímos cidades mais organizadas e acolhedoras.' },
];

const impactos = [
  { icone: '🚯', titulo: 'Descarte irregular', texto: 'Muitos itens em bom estado são descartados nas ruas e terrenos baldios, causando poluição e entupimento de bueiros.' },
  { icone: '♻️', titulo: 'Reaproveitamento', texto: 'Objetos que não são mais úteis para uma pessoa podem ser muito valiosos para outra, e o reuso prolonga a vida útil dos itens.' },
  { icone: '🍃', titulo: 'Cidade mais limpa', texto: 'Menos lixo nas ruas significa uma cidade mais bonita, segura e saudável para todos.' },
];

const valores = [
  { icone: '💚', titulo: 'Solidariedade', texto: 'Conectar pessoas e oportunidades.' },
  { icone: '🌱', titulo: 'Sustentabilidade', texto: 'Incentivar o reaproveitamento.' },
  { icone: '🤝', titulo: 'Comunidade', texto: 'Construir cidades mais unidas.' },
  { icone: '🛡️', titulo: 'Respeito', texto: 'Valorizar pessoas e objetos.' },
];

function SobrePage() {
  return (
    <>
      <section className="sobre-hero">
        <h1>
          Sobre o <span className="destaque">Doaê</span>
        </h1>
        <p className="sobre-lead">
          Conectando doações, reduzindo o descarte irregular e cuidando da cidade.
        </p>
        <p className="sobre-texto">
          O Doaê é uma plataforma que aproxima pessoas, incentiva o reaproveitamento
          de itens e contribui para cidades mais limpas, solidárias e sustentáveis.
        </p>
        <div className="hero-botoes">
          <Link to="/itens" className="btn btn-primario">Explorar itens</Link>
          <Link to="/doar" className="btn btn-contorno">Quero doar</Link>
        </div>
      </section>

      <section className="secao">
        <p className="secao-etiqueta">Nossa missão</p>
        <h2>Reutilizar mais, descartar menos.</h2>
        <p className="sobre-paragrafo">
          Facilitar o reaproveitamento de itens, conectando pessoas que desejam doar
          com quem precisa, contribuindo para a redução do descarte irregular e para
          a construção de cidades mais sustentáveis.
        </p>
      </section>

      <section className="secao">
        <h2>Realidades que podemos transformar</h2>
        <p className="sobre-paragrafo">
          O descarte irregular de móveis e outros itens ainda é um grande desafio nas
          nossas cidades. Veja como essa realidade se transforma com a doação.
        </p>
        <div className="realidades">
          {realidades.map((r) => (
            <figure
              key={r.titulo}
              className="realidade-card"
              style={{ backgroundImage: `url(${r.imagem})` }}
            >
              <figcaption>
                <h3>{r.titulo}</h3>
                <p>{r.texto}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="secao">
        <h2>O impacto na cidade</h2>
        <div className="sobre-grade">
          {impactos.map((i) => (
            <div key={i.titulo} className="sobre-card">
              <span className="sobre-icone">{i.icone}</span>
              <h3>{i.titulo}</h3>
              <p>{i.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="secao">
        <h2>Alinhado aos Objetivos de Desenvolvimento Sustentável</h2>
        <div className="sobre-ods">
          <div className="ods-selo">
            <strong>11</strong>
            <span>Cidades e comunidades sustentáveis</span>
          </div>
          <p>
            O Doaê está alinhado ao ODS 11 da ONU, que visa tornar as cidades e os
            assentamentos humanos inclusivos, seguros, resilientes e sustentáveis,
            com foco na redução do impacto ambiental e na gestão de resíduos
            (meta 11.6).
          </p>
        </div>
      </section>

      <section className="secao">
        <h2>Nossos valores</h2>
        <div className="sobre-valores">
          {valores.map((v) => (
            <div key={v.titulo} className="sobre-card">
              <span className="sobre-icone">{v.icone}</span>
              <h3>{v.titulo}</h3>
              <p>{v.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default SobrePage;