import { Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import './App.css';
import HomePage from './pages/HomePage';
import SobrePage from './pages/SobrePage';
import ItensPage from './pages/ItensPage';
import ItemDetalhePage from './pages/ItemDetalhePage';
import DoarPage from './pages/DoarPage';
import MinhaContaPage from './pages/MinhaContaPage';
import EntrarPage from './pages/EntrarPage';

function App() {
  return (
    <>
      <Menu />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/itens" element={<ItensPage />} />
          <Route path="/itens/:id" element={<ItemDetalhePage />} />
          <Route path="/doar" element={<DoarPage />} />
          <Route path="/minha-conta" element={<MinhaContaPage />} />
          <Route path="/entrar" element={<EntrarPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;