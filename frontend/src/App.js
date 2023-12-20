import { useState, useMemo } from 'react';
import {  Routes, Route, HashRouter } from "react-router-dom";



import './album.css';

import  Header from './components/Header';
// import  Banner from './components/Banner';
import Footer from './components/Footer';

import PropertiesListing from "./components/PropertiesListing";
import PropertyDisplay from './components/PropertyDisplay';
import { PropertiesContextData  } from './PropertiesContext';
import { UserContextData  } from './UserContext';


const userData = {
  firstName: 'Jose Eduardo',
  lastName: 'de Almeida',
  email: 'eduardo@xpertminds.dev',
  phone: '+55 27 99805-4033',
  whishList: [],
};

function App() {
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(userData);


  const addToWishList = (Id) => {
    if(user.whishList.indexOf(Id) < 0) {
      user.whishList.push(Id);
    }
    setUser({...user});
  }

  const removeFromWishList = (Id) => {
    if(user.whishList.indexOf(Id) > -1) {
      user.whishList.splice(user.whishList.indexOf(Id), 1);
      setUser({...user});
    }
  }

  async function getProperties() {
    try {
      const response = await fetch('http://localhost:3000/listings.json'); // https://s3.us-west-2.amazonaws.com/cdn.number8.com/LA/listings.json
      const data = await response.json();
      // console.log(data)
      return { data };
    } catch (error) {
      return { error }
    }
  }

  function changeProperties (data) {
    setProperties(data)
    console.log(data)
  }

  useMemo(() => {
    console.log('--`-- ser efects');
    (async () => {
      const { data, error } = await getProperties();
      if(error) {
        
        return alert(error.message);
      }
      changeProperties(data);
    })()
  }, []);

  return (
    <div className="App">
      <HashRouter>
          <Header />
          <main role="main">
            <div className="album py-5">
            <Routes>              
              <Route path="/" 
                element={
                  <PropertiesContextData.Provider value={{ properties, setProperties }}>
                    <UserContextData.Provider value={ { user, setUser, addToWishList, removeFromWishList } }>
                      <PropertiesListing />
                    </UserContextData.Provider>
                  </PropertiesContextData.Provider>
                } 
              />
              <Route path="/property/:Id" 
                  element={
                    <PropertiesContextData.Provider value={{ properties, setProperties }}>
                      <UserContextData.Provider value={ { user, setUser, addToWishList, removeFromWishList } }>
                        <PropertyDisplay />
                      </UserContextData.Provider>
                    </PropertiesContextData.Provider>
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
