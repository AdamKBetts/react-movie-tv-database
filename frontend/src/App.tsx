import Search from './components/Search';
import Details from './components/Details';
import './styles/global.css';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie/TV Database</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/details/:mediaType/:id" element={<Details />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;