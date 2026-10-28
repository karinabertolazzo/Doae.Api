import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import './App.css';
import ItensPage from './pages/ItensPage';
import DoarPage from './pages/DoarPage';

const Provisoria = ({ titulo }) => <h2>{titulo}</h2>;

function App() {
  return (
    <>
      <Menu />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<ItensPage />} />
          <Route path="/doar" element={<DoarPage />} />
          <Route path="/solicitacoes" element={<Provisoria titulo="Solicitações" />} />
          <Route path="/usuarios" element={<Provisoria titulo="Usuários" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;