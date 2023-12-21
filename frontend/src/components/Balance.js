


function Balance ({ user }) {
  
    return (
      <div className="table-responsive">
        <div className="card">
          <div className="card-header">
            My balance
          </div>
          <div className="card-body">
          {  (new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(user.balance)) }
          </div>
        </div>
      </div>
    )
}

export default Balance;
