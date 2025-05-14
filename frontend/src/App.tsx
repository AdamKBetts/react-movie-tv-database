import Search from './components/Search';
import './styles/global.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Movie/TV Database</h1>
      </header>
      <main>
        <Search />
      </main>
    </div>
  );
}

export default App;