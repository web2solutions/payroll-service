/* eslint-disable no-unreachable */


import { useState, useContext, useMemo } from "react";
import {ReactComponent as LoadinSVG} from "../loading.svg";
import { UserContextData  } from '../UserContext';

function UnpaidJobs ({ unpaidJobs }) {
  
    const { user, setUser } = useContext(UserContextData);
    const [ data, setData ] = useState([]);

    async function payForJob (button, id, amount ) {
      try {
        // disable button
        button.disabled = 'disabled';
        const { data, error } = await doPayment(id);
        
        if(error) { 
          button.disabled = false;
          return alert(error);
        }
        setData([...unpaidJobs.filter(j => {
          if(+j.id === +id) return false
          return true;
        })])

        setUser({...user, balance: user.balance - amount });
        
        alert(`Paid the amount ${(new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD'
        }).format(amount))} to ${data.contractor.firstName}  ${data.contractor.lastName}`);

        button.disabled = false;
      } catch (error) {
        console.log(error);
        button.disabled = false;
      }
    }

    async function doPayment(job_id) {
      try {
        const response = await fetch(`http://localhost:3001/jobs/${job_id}/pay`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "profile_id": user.id,
          },
        });
        const { data, error } = await response.json();
        // console.log(data)
        return { data, error };
      } catch (error) {
        return { error }
      }
    }

    useMemo(() => {
      setData([...unpaidJobs])
    }, [unpaidJobs]);
    return (
      <div className="table-responsive">
        <div className="card">
          <div className="card-header">
            Unpaid Jobs
          </div>
          <div className="card-body">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Price</th>
                  { user.type === 'client' ? <th>Pay</th> : <></> }
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? data.map(c => {
                  return <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.description}</td>
                    <td>{c.price}</td>
                    { user.type === 'client' ? 
                      <td>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={(event) => payForJob(event.target, c.id, c.price)}
                        >pay</button>
                      </td>
                      : <></> 
                    }
                  </tr>
                }) : <tr><td colSpan={4}  className='text-center'><LoadinSVG style={{
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

export default UnpaidJobs;
