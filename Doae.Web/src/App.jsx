import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import './App.css';

const Provisoria = ({ titulo }) => <h2>{titulo}</h2>;

function App() {
  return (
    <>
      <Menu />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Provisoria titulo="Itens" />} />
          <Route path="/doar" element={<Provisoria titulo="Doar um item" />} />
          <Route path="/solicitacoes" element={<Provisoria titulo="Solicitações" />} />
          <Route path="/usuarios" element={<Provisoria titulo="Usuários" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;