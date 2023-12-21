
import { useState } from 'react';

import { UserContextData  } from './UserContext';

import App from './App';
import Login from './Login';
function AppWrapper() {
  const [user, setUser] = useState(false);
  return (
    <UserContextData.Provider value={ { user, setUser } }>
      { user && user.isOnline ? <App /> : <Login />}
    </UserContextData.Provider>
  );
}

export default AppWrapper;
