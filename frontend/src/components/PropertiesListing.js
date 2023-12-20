import { useContext, useEffect, useState } from 'react';
import { PropertiesContextData  } from '../PropertiesContext';

import PropertiesListingItem from './PropertiesListingItem';

import {ReactComponent as LoadinSVG} from "../loading.svg";

function PropertiesListing () {
    const [ bedOptions, setBedOptions ] = useState([]);
    const [ bathOptions, setBathOptions ] = useState([]);
    const [ parkOptions, setParkOptions ] = useState([]);

    const [ Bedrooms, setSelectedBed ] = useState('');
    const [ Bathrooms, setSelectedBath ] = useState('');
    const [ Parking, setSelectedPark ] = useState('');

    const [ maxPrice, setMaxPrice ] = useState(0);
    const [ minPrice, setMinPrice ] = useState(0);
    const [ maxAllowedPrice, setMaxAllowedPrice ] = useState(0);

    const [ searchOperator, setSearchOperator ] = useState('one');
    
    const { properties } = useContext(PropertiesContextData);
    const [data, setData] = useState([])

    function handleSelectBed(event) {
      setSelectedBed(event.target.value === '' ? '' : +event.target.value);
    } 

    function handleSelectBath(event) {
      setSelectedBath(event.target.value === '' ? '' : +event.target.value);
    }

    function handleSelectPark(event) {
      setSelectedPark(event.target.value === '' ? '': +event.target.value);
    } 

    function minPriceOnInput (event) {
      setMinPrice(+event.target.value);
    }

    function maxPriceOnInput (event) {
      setMaxPrice(+event.target.value);
    }

    function setFilterData(properties) {
      const nBeds = [];
      const nBaths = [];
      const nParking = [];
      let maxAllowprice = 0; // Sale Price
      for(const property of properties) {
        if(nBeds.indexOf(property.Bedrooms) === -1) nBeds.push(property.Bedrooms);
        if(nBaths.indexOf(property.Bathrooms) === -1) nBaths.push(property.Bathrooms);
        if(nParking.indexOf(property.Parking) === -1) nParking.push(property.Parking);
        if(property["Sale Price"] > maxAllowprice) maxAllowprice = property["Sale Price"];
      }
      setBedOptions(nBeds.toSorted());
      setBathOptions(nBaths.toSorted());
      setParkOptions(nParking.toSorted());
      setMaxAllowedPrice(maxAllowprice);
    }

    function isMatchingOne(record, _filters) {
      let filters = {..._filters};
      delete filters.maxPrice;
      delete filters.minPrice;
      let isMatching = false
      Object.keys(record).forEach(key => {
        if(record[key] === filters[key]) isMatching = true;
      })

      if(_filters.maxPrice > 0) {
        if(+record['Sale Price'] <= _filters.maxPrice) isMatching = true;
      }

      if(_filters.minPrice > 0) {
        if(+record['Sale Price'] >= _filters.minPrice) isMatching = true;
      }

      return isMatching;
    }


    function isMatchingAll(record, _filters) {
      let filters = {..._filters};
      delete filters.maxPrice;
      delete filters.minPrice;
      const totalTarget = Object.keys( _filters).length - 1;
      let isMatching = 0;
      Object.keys(record).forEach(key => {
        if(filters[key] === '') {
          isMatching += 1;
          return;
        }
        if(record[key] === filters[key]) isMatching += 1;
      })

      if(_filters.maxPrice > 0) {
        if(+record['Sale Price'] <= _filters.maxPrice) isMatching += 1;
      } else {
        isMatching += 1;
      }

      if(_filters.minPrice > 0) {
        if(+record['Sale Price'] >= _filters.minPrice) isMatching += 1;
      } else {
        isMatching += 1;
      }
      return isMatching === totalTarget;
    }


    function doFiltering() {
      console.log({ Bedrooms, Bathrooms, Parking, maxPrice, minPrice, searchOperator });
      if(Bedrooms === '' && Bathrooms === '' && Parking === '' && maxPrice === 0 && minPrice === 0) {
        console.log(properties)
        setData(properties);
        return;
      }
      if(searchOperator === 'one') {
        const filtered = properties.filter(p => isMatchingOne(p, { Bedrooms, Bathrooms, Parking, maxPrice, minPrice, searchOperator }));
        setData(filtered);
        return;
      }
      const filtered = properties.filter(p => isMatchingAll(p, { Bedrooms, Bathrooms, Parking, maxPrice, minPrice, searchOperator }));
      setData(filtered);
    }

    useEffect(() => {
        if(properties && properties.length > 0) {
          setFilterData(properties);
          setData([...properties]);
        }
    }, [properties]);

    return (
        <div className="container">
          <div className="row ml-1 mr-1">
            
            <div className="col-md-2">
              <label htmlFor="Bedrooms">Bedrooms</label>
              <select className='form-control' id="Bedrooms" data-testid="Bedrooms" value={Bedrooms} onChange={handleSelectBed}>
                <option key="" data-testid="Bedrooms-option" />
                { bedOptions.map(n => <option data-testid="Bedrooms-option" key={n}>{n}</option>) }
              </select>
            </div>

            <div className="col-md-2">
              <label htmlFor="Bathrooms" className="form-label">Bathrooms</label>
              <select className='form-control' id="Bathrooms" data-testid="Bathrooms" value={Bathrooms} onChange={handleSelectBath}>
                <option data-testid="Bathrooms-option" key="" />
                { bathOptions.map(n => <option data-testid="Bathrooms-option" key={n}>{n}</option>) }
              </select>
            </div>

            <div className="col-md-2">
              <label htmlFor="Parking" className="form-label">Parking</label>
              <select className='form-control' id="Parking" data-testid="Parking" value={Parking} onChange={handleSelectPark}>
                <option key="" data-testid="Parking-option" />
                { parkOptions.map(n => <option data-testid="Parking-option" key={n}>{n}</option>) }
              </select>
            </div>

            <div className="col-md-4 pt-2">
              <div className="row">
                <label htmlFor="MinPrice" className="form-label">Min Price</label>
                <input type="range" className="form-range ml-1" id="MinPrice" data-testid="MinPrice" step="500" max={maxAllowedPrice} value={minPrice} onChange={ minPriceOnInput } />
                <small>{(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minPrice))}</small>
              </div>
              <div className="row">
                <label htmlFor="MaxPrice" className="form-label">Max Price</label>
                <input type="range" className="form-range ml-1" id="MaxPrice" data-testid="MaxPricet" step="500" max={maxAllowedPrice} value={maxPrice} onChange={ maxPriceOnInput } />
                <small>{(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(maxPrice))}</small>
              </div>
            </div>

            <div className="col-md-1 pt-2">
              <div className="form-check">
                <input className="form-check-input" type="radio" name="searchOperator" id="searchOperatorOne" onChange={() => { setSearchOperator('one') }} checked={ searchOperator === 'one' ? true : false } />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  One
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="searchOperator" id="searchOperatorAll" onChange={() => { setSearchOperator('all') }} checked={ searchOperator === 'all' ? true : false } />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  All
                </label>
              </div>
            </div>

            <div className="col-md-1 pt-3">
              <button className="btn btn-outline-primary" onClick={doFiltering}>search</button>
            </div>
            
          </div>
          <div className="row mt-5">
            { 
              data.length > 0 
                ? 
                  data.map(property => <PropertiesListingItem key={property.Id} property={ property } />) 
                :
                  <div className="col text-center bg-light">
                    <LoadinSVG style={{
                      width: 100 + 'px',
                      height: 100 + 'px',
                      margin: '20px',
                      display: 'inline-block',
                    }} />
                  </div>
              }
          </div>
        </div>
    )
}

export default PropertiesListing;