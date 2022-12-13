import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Messanger from './components/Messanger';
import Register from './components/Register';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='messanger/login' element={<Login />} />
          <Route path='messanger/register' element={<Register />} />
          <Route path='/' element={<Messanger />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
