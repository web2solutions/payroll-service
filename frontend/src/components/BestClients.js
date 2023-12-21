

import { useMemo, useState } from "react";

const _DEFAULT_LIMIT_ = 2;

function BestClients ({ user }) {
  const [data, setData] = useState([])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [limit, setLimit] = useState(_DEFAULT_LIMIT_);

    
  async function getBestClients() {
    try {
      let url = `http://localhost:3001/admin/best-clients?limit=${limit}`;
      if(start !== ''&& end !== '')
      {
        url = url + `&start=${start}&end=${end}`
      }
      const response = await fetch(url, {
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

  function changeClients(_data) {
    setData(_data);
  }

  async function getProfessions () {
    const clients = await getBestClients();
    changeClients(clients.data.data);
  }

  function clearFilters() {
    setStart('')
    setEnd('');
    setLimit(_DEFAULT_LIMIT_);
    getProfessions();
  }

  async function doFiltering(event) {
    event.preventDefault();
    const clients = await getBestClients();
    changeClients(clients.data.data);
  }

  useMemo(() => {
    getProfessions ()
  }, []);

  return (
      <div className="table-responsive">
        <div className="card">
          <div className="card-header">
            Best Clients
          </div>
          <div className="card-body">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map(c => {
                    return <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.firstName}</td>
            <td>{c.lastName}</td>
            <td>{c.type}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          
          </div>
          <div className="card-footer text-muted">
            <form onSubmit={doFiltering}>
              <div className="row">
                <div className="col-md-3">
                  <label htmlFor="start">Start date</label>
                  <input 
                    type="date"
                    className="form-control input-sm" 
                    id="start" 
                    value={start}
                    onChange={(event) => setStart(event.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="end">End date</label>
                  <input 
                    type="date"
                    className="form-control input-sm" 
                    id="end" 
                    value={end}
                    onChange={(event) => setEnd(event.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="limit">Limit</label>
                  <input 
                    type="number"
                    className="form-control input-sm" 
                    id="limit" 
                    value={limit}
                    onChange={(event) => setLimit(+event.target.value)}
                  />
                </div>
                <div className="col-md-4 pt-1">
                  <button className="btn btn-primary btn-sm btn-block" type="submit">filter</button>
                  <button className="btn btn-danger btn-sm btn-block" onClick={clearFilters}>clear</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
  )
}

export default BestClients;
