import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './data';
import Layout from './components/Layout';
import Overzicht from './pages/Overzicht';
import Inkomsten from './pages/Inkomsten';
import Uitgaven from './pages/Uitgaven';
import Schulden from './pages/Schulden';
import Contacten from './pages/Contacten';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Overzicht />} />
            <Route path="/inkomsten" element={<Inkomsten />} />
            <Route path="/uitgaven" element={<Uitgaven />} />
            <Route path="/schulden" element={<Schulden />} />
            <Route path="/contacten" element={<Contacten />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
