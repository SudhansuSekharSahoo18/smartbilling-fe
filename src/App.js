import './App.css';
import MenuBar from './components/menubar/menubar';
import Billing from './components/billing/billing';

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <MenuBar />
        <div className="content">
          <Billing />
        </div>
      </div>
    </div>
    
    
  );
}

export default App;
