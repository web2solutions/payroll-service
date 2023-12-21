

import { useMemo, useState } from "react";
function BestProfessions ({ user }) {
  const [data, setData] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

    
  async function getBestProfessions() {
    try {
      let url = `http://localhost:3001/admin/best-profession`;
      if(start !== ''&& end !== '')
      {
        url = url + `?start=${start}&end=${end}`
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

  function clearFilters () {
    setStart('')
    setEnd('');
    getProfessions();
  }

  function changeProfessions(_data) {
    setData(_data);
  }

  async function doFiltering(event) {
    event.preventDefault();
    const professions = await getBestProfessions();
    changeProfessions(professions.data.data);
  }

  async function getProfessions () {
    const professions = await getBestProfessions();
    changeProfessions(professions.data.data);
  }

  useMemo(() => {
    getProfessions ();
  }, []);

  return (
      <div className="table-responsive">
        <div className="card">
          <div className="card-header">
            Best Profession
          </div>
          <div className="card-body">
            <h3>{ data }</h3>
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

export default BestProfessions;
