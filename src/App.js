
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import ScrollToTop from './components/ScrollToTop'; 
import './assets/css/style.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
