
function PropertyDisplayPhotoForm ({ property }) { 
  return (
    <>
      <div className="row pt-3">
        <div className="col-md-8">
            <div className="row">
            
                <div className="col-md-12">
                  <img 
                      className="card-img-top" 
                      alt={property.Title}
                      src={property.PictureURL}
                      style={{height: 'auto',  width: 100 + '%', display: 'block'}} 
                  />
                </div>

            </div>
            <div className="row pl-3  pr-3">
              <div className="col-md-2 bg-light border-left border-top  border-bottom  border-secondary">
                <div className="card-body text-center">
                  <h5 className="card-title">{ property.Bedrooms }</h5>
                  <h6 className="card-subtitle text-muted">BED</h6>
                </div>
              </div>
              <div className="col-md-2 bg-light border-top  border-bottom  border-secondary">
                <div className="card-body text-center">
                  <h5 className="card-title">{ property.Bathrooms }</h5>
                  <h6 className="card-subtitle text-muted">BATH</h6>
                </div>
              </div>
              <div className="col-md-2 bg-light border-top  border-bottom  border-secondary">
                <div className="card-body text-center">
                  <h5 className="card-title">{ property.Parking }</h5>
                  <h6 className="card-subtitle text-muted">PARKING</h6>
                </div>
              </div>
              <div className="col-md-3 bg-light border-top  border-bottom  border-secondary">
                <div className="card-body text-center">
                  <h5 className="card-title">{ property.Sqft }</h5>
                  <h6 className="card-subtitle text-muted">SQFT</h6>
                </div>
              </div>
              <div className="col-md-3 bg-light border-top border-right border-bottom border-secondary">
                <div className="card-body text-center">
                  <h5 className="card-title">{ property.YearBuilt }</h5>
                  <h6 className="card-subtitle text-muted">YEAR BUILT</h6>
                </div>
              </div>
            </div>
        </div>


        <div className="col-md-4 text-center bg-light pt-3 border border-secondary">
          <form className="needs-validation">
            
            <div className="mb-3 mt-5">
              <h3>Contact Agent</h3>
            </div>

            <div className="mb-3 mt-5">
              <input type="text" className="form-control" id="name" placeholder="Full name" />
              <div className="invalid-feedback">
                Please provide your name
              </div>
            </div>

            <div className="mb-3">
              <input type="email" className="form-control" id="email" placeholder="Email" />
              <div className="invalid-feedback">
                Please enter a valid email address.
              </div>
            </div>

            <div className="mb-3">
              <input type="text" className="form-control" id="phone" placeholder="Phone" />
              <div className="invalid-feedback">
                Please provide phone number
              </div>
            </div>

            <div className="mb-3">
              <textarea  rows={10} className="form-control" id="comments" placeholder="Comments" />
              <div className="invalid-feedback">
                Please provide your name
              </div>
            </div>

            <button className="btn btn-primary btn-lg btn-block" type="submit">Contact now</button>
          </form>
        </div>
      </div>
      <div className="row pt-3">
        <div className="col-md-8">
          <p className="text-muted">
            { property.Description }
          </p>
        </div>
      </div>
    </>
  );
}

export default PropertyDisplayPhotoForm;