/* eslint-disable no-unreachable */
import { useContext, useState, useMemo } from 'react';
import { UserContextData  } from './UserContext';
import './login.css';

function Login() {
  const { user, setUser } = useContext(UserContextData);
  const [inputFirstName, setFirstName] = useState('');
  const [inputLastName, setLastName] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState('Please select an user to login');


  const handleSelectedUser = (event) => {
    if(event.target.value === 'Please select an user to login') return;
    const id = +event.target.value;
    setSelectedUser(id);
    const selectedProfile = profiles.filter(p => {
      if(+p.id === +id) return true;
      return false;;
    })[0];
    if(selectedProfile) {
      setFirstName(selectedProfile.firstName);
      setLastName(selectedProfile.lastName);
    }
  }

  async function getProfiles() {
    try {
      const response = await fetch('http://localhost:3001/profiles', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "profile_id": user.id,
        },
      });
      const data = await response.json();
      // console.log(data)
      return { data };
    } catch (error) {
      return { error }
    }
  }
  function changeProfiles (data) {
    setProfiles(data)
  }

  async function doLogin (event) {
    
    try {
      event.preventDefault();
      
      if(inputFirstName === '' || inputLastName === '') return alert('Please select a profile to do login.');
      event.nativeEvent.target.elements['submit'].disabled = true;
      event.nativeEvent.submitter.disabled = true
      const response = await fetch('http://localhost:3001/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName: inputFirstName, lastName: inputLastName }), 
      })
      const body = await response.json();
    
      const { id, firstName, lastName, type, balance, profession } = body.data;
      setUser({ id, firstName, lastName, type, balance, profession, isOnline: true });
      event.nativeEvent.submitter.disabled = false;
      event.nativeEvent.target.elements['submit'].disabled = false;
    } catch (error) {
      alert(error.message);
      event.nativeEvent.submitter.disabled = false
      event.nativeEvent.target.elements['submit'].disabled = false;
    }
  }

  useMemo(() => {
    
    (async () => {
      const {data, error} = await getProfiles();
    
      if(error) return alert(error.message);
      changeProfiles(data);
    })()
  }, []);

  return (
      <div className="Login" onSubmit={doLogin}>
        <form className="form-signin">
          <div className="text-center mb-4">
            <img className="mb-4 rounded" src="img/payrollb.png" alt="" height="100" />
            <h1 className="h3 mb-3 font-weight-normal">Payroll System</h1>
            <label htmlFor="profile-selection">Profile selection</label>
            <select
              id="profile-selection"
              className="form-control"
              value={selectedUser} 
              onChange={handleSelectedUser}
            >
              <option key={''}>Please select an user to login</option>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} - {p.type}</option>)}
            </select>
          </div>

          <div className="form-label-group">
            
            <input 
              type="text" 
              id="inputFirstName" 
              className="form-control" 
              placeholder="First name" 
              value={inputFirstName}
              readOnly
              required
            />
            <label htmlFor="inputFirstName">First name</label>
          </div>

          <div className="form-label-group">
            <input 
              type="text" 
              id="inputLastName" 
              className="form-control" 
              placeholder="Last Name"
              readOnly
              required
              value={inputLastName}
            />
            <label htmlFor="inputLastName">Last Name</label>
          </div>
          <button className="btn btn-primary btn-block" name="submit" type="submit">Sign in</button>
        </form>
      </div>
  );
}

export default Login;
