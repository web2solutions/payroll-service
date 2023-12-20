import { Link } from "react-router-dom";

function PropertiesListingItem ({ property }) {
    const { Id, ThumbnailURL, Title, Location, Bathrooms, Bedrooms } = property;
    return (
        <div className="col-md-3 rounded">
              <div className="card mb-3 box-shadow">
                <img 
                    className="card-img-top" 
                    alt={Title}
                    src={ThumbnailURL}
                    style={{height: 150 + 'px',  width: 100 + '%', display: 'block'}} 
                />
                <div className="card-body">
                    <h6 className="card-title">{ Title < 22 ? Title : Title.slice(0, 21) + ' ...' }</h6>
                    <h6 className="card-subtitle text-muted">{ Location }</h6>
                    <small className="text-muted">{ Bedrooms } beds | { Bathrooms } baths</small>
                    <p className="card-text"> 
                        {  (new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(property['Sale Price'])).replace(/,/, ' ').split('.')[0] }
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                        <Link to={'/property/' + Id } className="btn btn-primary">View Details</Link>
                    </div>
                </div>
              </div>
        </div>
    )
}

export default PropertiesListingItem;