// import PropertiesListingItem from './PropertiesListingItem';
import { useContext, useMemo, useState } from 'react';
import { UserContextData  } from '../UserContext';

import Contracts from "./Contracts";
import UnpaidJobs from './UnpaidJobs';
import DepositForm from './DepositForm';
import Balance from './Balance';
import BestClients from './BestClients';
import BestProfessions from './BestProfessions';

function Dashboard () {
  const { user/*, setUser*/ } = useContext(UserContextData);
  const [contracts, setContracts] = useState([]);
  const [unpaidJobs, setUnpaidJobs] = useState([]);
  const [profiles, setProfiles] = useState([]);

  async function getContracts() {
    try {
      const response = await fetch('http://localhost:3001/contracts', {
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

  async function getUnpaidjobs() {
    try {
      const response = await fetch('http://localhost:3001/jobs/unpaid', {
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

  function changeContracts (data) {
    setContracts(data)
  }

  function changeUnpaidJobs (data) {
    setUnpaidJobs(data)
  }

  function changeProfiles (data) {
    setProfiles(data)
  }

  useMemo(() => {
    (async () => {
      const { data, error } = await getContracts();
      const jobsUnpaid = await getUnpaidjobs();
      const profiles = await getProfiles();
      if(error) return alert(error.message);
      if(jobsUnpaid.error) return alert(jobsUnpaid.error.message);
      if(profiles.error) return alert(profiles.error.message);

      changeContracts(data);
      changeUnpaidJobs(jobsUnpaid.data);
      changeProfiles(profiles.data);
    })()
  }, []);

    function showDepositForm () {
      if(user.type === 'client' || user.type === 'admin') {
        return <DepositForm contracts={contracts} user={user} profiles={profiles} />;
      }
      return <></>;
    }

    function showAdminContent () {
      if(user.type === 'admin') {
        return (
          <div className="row">
            <div className="col-md-7">
              <BestClients user={user} />
            </div>
            <div className="col-md-5">
              <BestProfessions unpaidJobs={unpaidJobs} user={user} profiles={profiles} />
            </div>
          </div>
        );
      }
      return <></>;
    }
  
    return (
        <div className="container">
          { showAdminContent() }
          <div className="row pt-2">
            <div className="col-md-7">
              <Contracts contracts={contracts} user={user} profiles={profiles} />
            </div>
            <div className="col-md-5">
              <UnpaidJobs unpaidJobs={unpaidJobs} user={user} profiles={profiles} />
            </div>
            
          </div>
          { user.type !== 'admin' ? 
            <div className="row pt-2">
              <div className="col-md-7">
                { showDepositForm() }
              </div>
              <div className="col-md-5">
                <Balance unpaidJobs={unpaidJobs} user={user} profiles={profiles} />
              </div>
            </div> : <></>
          }
        </div>
    )
}

export default Dashboard;
