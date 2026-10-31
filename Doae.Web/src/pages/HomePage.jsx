import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriasApi, itensApi } from '../services/api';
import './HomePage.css';

const iconesCategoria = {
  Móveis: '🛋️',
  Roupas: '👕',
  Livros: '📚',
  Eletrodomésticos: '🔌',
  Outros: '🎁',
};

const imagensCategoria = {
  Móveis: '/imagens/moveis.png',
  Roupas: '/imagens/roupas.png',
  Livros: '/imagens/livros.png',
  Eletrodomésticos: '/imagens/eletro.png',
  Outros: '/imagens/outros.png',
};

const passos = [
  { numero: 1, icone: '📦', titulo: 'Cadastre um item', texto: 'Crie sua conta e anuncie o que você não usa mais.' },
  { numero: 2, icone: '🤝', titulo: 'Conecte-se', texto: 'Quem precisa encontra o item e envia um pedido ao doador.' },
  { numero: 3, icone: '💚', titulo: 'Combine a entrega', texto: 'O doador aceita o pedido e vocês combinam a retirada.' },
];

function HomePage() {
  const [categorias, setCategorias] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    Promise.all([categoriasApi.listar(), itensApi.listar({ status: 'Disponivel' })])
      .then(([cats, itens]) => {
        setCategorias(cats);
        setDestaques(itens.slice(0, 4));
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <section className="hero">
        <span className="hero-selo">Pequenos gestos, grandes mudanças</span>
        <h1>
          Doe hoje.
          <br />
          Mais histórias <span className="destaque">amanhã.</span>
        </h1>
        <p className="hero-texto">
          O que você não usa mais pode virar oportunidade e ainda ajudar a construir
          uma cidade mais limpa, solidária e sustentável.
        </p>
        <div className="hero-botoes">
          <Link to="/itens" className="btn btn-primario">Explorar itens</Link>
          <Link to="/doar" className="btn btn-contorno">Quero doar</Link>
        </div>
        <ul className="hero-vantagens">
          <li>✔ Uso gratuito</li>
          <li>✔ Comunidade colaborativa</li>
          <li>✔ Menos desperdício</li>
        </ul>
      </section>

      <section className="secao">
        <p className="secao-etiqueta">Encontre o que precisa</p>
        <div className="secao-topo">
          <h2>Categorias de itens</h2>
          <Link to="/itens" className="secao-link">Ver todos →</Link>
        </div>
        <div className="categorias">
          {categorias.map((c) => (
            <Link
              key={c.id}
              to={`/itens?categoriaId=${c.id}`}
              className="categoria-card"
              style={
                imagensCategoria[c.nome]
                  ? { backgroundImage: `url(${imagensCategoria[c.nome]})` }
                  : undefined
              }
            >
              <span className="categoria-nome">{c.nome}</span>
              <span className="categoria-seta">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="secao">
        <p className="secao-etiqueta">Itens em destaque</p>
        <div className="secao-topo">
          <h2>Novas oportunidades</h2>
          <Link to="/itens?status=Disponivel" className="secao-link">Ver todos →</Link>
        </div>
        {erro && <p className="home-vazio">Não foi possível carregar os itens: {erro}</p>}
        {!erro && !carregando && destaques.length === 0 && (
          <p className="home-vazio">
            Nenhum item disponível no momento. <Link to="/doar">Seja o primeiro a doar.</Link>
          </p>
        )}
        <div className="destaques">
          {destaques.map((item) => (
            <Link key={item.id} to={`/itens/${item.id}`} className="destaque-card">
              <span className="destaque-icone">{iconesCategoria[item.categoriaNome] ?? '📦'}</span>
              <strong>{item.titulo}</strong>
              <span className="destaque-meta">{item.categoriaNome} · {item.cidade}</span>
              <span className="selo selo-disponivel">Disponível</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="secao">
        <p className="secao-etiqueta">Fazer o bem pode ser fácil</p>
        <h2>Como funciona?</h2>
        <div className="passos">
          {passos.map((p) => (
            <div key={p.numero} className="passo-card">
              <span className="passo-numero">{p.numero}</span>
              <span className="passo-icone">{p.icone}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ods">
        <div>
          <p className="secao-etiqueta">ODS 11 · Cidades e comunidades sustentáveis</p>
          <h2>Pequenas doações, grandes mudanças.</h2>
          <p className="ods-texto">
            Cada item reutilizado é um passo para menos descarte irregular, mais
            solidariedade e cidades mais limpas para todos.
          </p>
        </div>
        <Link to="/doar" className="btn btn-primario">Faça parte →</Link>
      </section>
    </>
  );
}

export default HomePage;