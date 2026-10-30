import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import './App.css';
import ItensPage from './pages/ItensPage';
import ItemDetalhePage from './pages/ItemDetalhePage';
import DoarPage from './pages/DoarPage';
import UsuariosPage from './pages/UsuariosPage';
import SolicitacoesPage from './pages/SolicitacoesPage';
import EntrarPage from './pages/EntrarPage';

function App() {
  return (
    <>
      <Menu />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<ItensPage />} />
          <Route path="/itens/:id" element={<ItemDetalhePage />} />
          <Route path="/doar" element={<DoarPage />} />
          <Route path="/solicitacoes" element={<SolicitacoesPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/entrar" element={<EntrarPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;