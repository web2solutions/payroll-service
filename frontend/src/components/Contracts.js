

import { useMemo, useState } from "react";
import {ReactComponent as LoadinSVG} from "../loading.svg";
function Contracts ({contracts, user, profiles}) {
    const [data, setData] = useState([]);

    function getProfile(id){
      
      return profiles.filter( c => {
        if((id+"") === (c.id+"")) return true
        return false
      })[0];
    }

    function filterData (contracts, profiles){
      const _data = [...contracts.map(c => {
        // get profile name
        const id = user.type === 'client' ? c.ContractorId : c.ClientId;
        const profile = getProfile(id, profiles);
        const resp = { ...c }
        if(user.type === 'client') resp.ContractorId = `${profile.firstName} ${profile.lastName}`;
        if(user.type === 'contractor') resp.ClientId = `${profile.firstName} ${profile.lastName}`;
        if(user.type === 'admin') {
          const profileClient = getProfile(c.ClientId, profiles);
          resp.ClientId = `${profileClient.firstName} ${profileClient.lastName}`;
          const profileContractor = getProfile(c.ContractorId, profiles);
          resp.ContractorId = `${profileContractor.firstName} ${profileContractor.lastName}`;
        }
        return resp;
      })]
      setData(_data)
      return _data
    }

    useMemo(() => {
      if(contracts) filterData(contracts, profiles)
    }, [contracts, profiles])




    return (
      <div className="table-responsive">
        <div className="card">
          <div className="card-header">
            Contracts
          </div>
          <div className="card-body">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Terms</th>
                  <th>Status</th>
                  <th>{user.type === 'client' ? 'Contractor' : 'Client'}</th>
                  {user.type === 'admin' ? <th>Contractor</th> : ''}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? data.map(c => {
                  return <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.terms}</td>
                    <td>{c.status}</td>
                    <td>{user.type === 'client' ? c.ContractorId : c.ClientId}</td>
                    {user.type === 'admin' ? <td>{c.ContractorId}</td> : ''}
                    
                  </tr>
                }) : <tr><td colSpan={5} className="text-center"><LoadinSVG style={{
                  width: 100 + 'px',
                  height: 100 + 'px',
                  display: 'inline-block',
                } }/></td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
}

export default Contracts;
