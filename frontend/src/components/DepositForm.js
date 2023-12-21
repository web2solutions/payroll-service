
import { useState, useContext } from "react";
import { UserContextData  } from '../UserContext';

function DepositForm () {
    const [deposit, setDeposit] = useState(0);
    const { user, setUser } = useContext(UserContextData);

    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    function displaySuccess(msg) {
      setSuccessMessage(msg);
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false);
      },800);
    }

    function sucessComponent() {
      if(showSuccess)
        return(
          <div className="col-md-12">
            <div className="alert alert-success" role="alert">
              { successMessage }
            </div>
          </div>
        );
      else
        return <></>
    };

    let executing = false;
    async function handleSubmitForm (event) {
      try {
        if(executing) return;
        event.target.disabled = true;
        executing = true;
        event.preventDefault();
        const { data, error } = await doDeposit();
        console.log({ data, error })
        if(error) {
          event.target.disabled = false;
          return displaySuccess(error);
        }

        setUser({...user, balance: user.balance + deposit });
        
        displaySuccess(`Deposited the amount ${(new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD'
        }).format(deposit))}`);

        event.target.disabled = false;
        executing = false;
      } catch (error) {
        console.log(error)
      }
    }

    async function doDeposit() {
      try {
        if( (+deposit) < 1 ) {
          return { error: 'The minimum amount allowed to deposit is 1' };
        }
        const response = await fetch(`http://localhost:3001/balances/deposit/${user.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "profile_id": user.id,
          },
          body: JSON.stringify({ deposit: +deposit }), 
        });
        const { data, error } = await response.json();
        // console.log(data)
        return { data, error };
      } catch (error) {
        return { error }
      }
    }

    return (
      <div className="table-responsive">
        <div className="card">
          <div className="card-header">
            Deposit funds
          </div>
          <div className="card-body">
            <div className="row">
              
            { sucessComponent() }


            </div>
            <div className="row">
              <div className="col-md-12">
                <form onSubmit={handleSubmitForm}>
                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="deposit">Amount to deposit</label>
                      <input 
                        type="number"
                        className="form-control input-sm" 
                        id="deposit" 
                        value={deposit}
                        onChange={(event) => setDeposit(+event.target.value)}
                      />
                    </div>
                    <div className="col-md-6 pt-4">
                      <button className="btn btn-danger btn-sm btn-block" type="submit">deposit</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default DepositForm;
