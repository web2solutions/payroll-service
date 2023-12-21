import { useContext } from 'react';
import {  Routes, Route, HashRouter } from "react-router-dom";



import './album.css';

import  Header from './components/Header';
// import  Banner from './components/Banner';
import Footer from './components/Footer';

import Dashboard from "./components/Dashboard";
import { ContractsContextData  } from './ContractsContext';
import { UserContextData  } from './UserContext';

function App() {
  const [contracts, setContracts] = useContext(ContractsContextData);
  const { user, setUser } = useContext(UserContextData);

  return (
    <div className="App">
      <HashRouter>
          <Header />
          <main role="main">
            <div className="album py-5">
            <Routes>              
              <Route path="/" 
                element={
                  <ContractsContextData.Provider value={{ contracts, setContracts }}>
                    <UserContextData.Provider value={ { user, setUser } }>
                      <Dashboard />
                    </UserContextData.Provider>
                  </ContractsContextData.Provider>
                } 
              />
            </Routes>
            </div>
          </main>
          <Footer />
        </HashRouter>
    </div>
  );
}

export default App;
