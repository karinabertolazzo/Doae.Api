import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import './App.css';
import ItensPage from './pages/ItensPage';
import DoarPage from './pages/DoarPage';
import UsuariosPage from './pages/UsuariosPage';

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
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;