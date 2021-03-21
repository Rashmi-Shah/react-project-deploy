import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string'; //package
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            mealtype: undefined,
            location: undefined,
            cuisine: [],
            lcost: undefined,
            hcost: undefined,
            sort: undefined,
            page: undefined,
            pageArr: [],
            pageCount:undefined,
            cuisineId:undefined
        }
    }

    handleClick = (resId) => {
        this.props.history.push(`/Details/?restaurant=${resId}`);
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const mealtype = qs.mealtype;
        const area = qs.area;
        //Call filter API
        axios({
            method: 'POST',
            url: 'http://localhost:2021/filterRestaurants',
            headers: { 'Content-Type': 'application/json' },
            data: {
                mealtype_id: mealtype,
                location_id: area
            }
        }).then(res => {
            this.setState({ restaurants: res.data.restaurant, mealtype: mealtype, location: area, pageArr: res.data.pageCount })

        }).catch(err => console.log(err))
       // Call location API
        axios({
            url: 'http://localhost:2021/location',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({ locations: res.data.location })
            }).catch(err => console.log(err))
           

    }
    handleSortChange = (sort) => {
        const { mealtype, location, cuisine, lcost, hcost, page } = this.state;
        axios({
            method: 'POST',
            url: 'http://localhost:2021/filterRestaurants',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype_id: mealtype,
                location_id: location,
                cuisine: cuisine.length == 0 ? undefined : cuisine,
                lcost: lcost,
                hcost: hcost,
                page: page
            }
        }).then(res => {
            this.setState({ restaurants: res.data.restaurant, location: location, sort: sort, pageArr: res.data.pageCount })

        }).catch(err => console.log(err))

    }
    handleChange = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);

    }
    handleCostChange = (lcost, hcost) => {
        const { mealtype, location, cuisine, sort, page, pageArr } = this.state;
        axios({
            method: 'POST',
            url: 'http://localhost:2021/filterRestaurants',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype_id: mealtype,
                location_id: location,
                cuisine: cuisine.length == 0 ? undefined : cuisine,
                lcost: lcost,
                hcost: hcost,
                page: page,
                pageArr:pageArr

            }
        }).then(res => {
            this.setState({ restaurants: res.data.restaurant, location: location, lcost: lcost, hcost: hcost, pageArr: res.data.pageCount })

        }).catch(err => console.log(err))


    }
    handleCuisineChange = (cuisineId) => {
        const { cuisine } = this.state;
        const { mealtype, location, sort, page, lcost, hcost,  pageArr } = this.state;
        if (cuisine.indexOf(cuisineId) == -1) {
            cuisine.push(cuisineId);
        }
        else {
            var index = cuisine.indexOf(cuisineId);
            cuisine.splice(index, 1);
        }
        axios({
            method: 'POST',
            url: 'http://localhost:2021/filterRestaurants',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype_id: mealtype,
                location_id: location,
                cuisine: cuisine.length == 0 ? undefined : cuisine,
                lcost: lcost,
                hcost: hcost,
                page: page,
                pageArr:pageArr

            }
        }).then(res => {
            this.setState({ restaurants: res.data.restaurant, location: location, cuisine: cuisine, pageArr: res.data.pageCount })

        }).catch(err => console.log(err))
    }
    handleLocationChange = (event) => {
     const location = event.target.value;
       const { mealtype,  cuisine, sort, page, lcost, hcost, pageArr } = this.state; 
        axios({
            method: 'POST',
            url: 'http://localhost:2021/filterRestaurants',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype_id: mealtype,
                cuisine: cuisine.length == 0 ? undefined : cuisine,
                lcost: lcost,
                hcost: hcost,
                page: page,
                location_id: location,
                pageArr:pageArr
            }
        }).then(res => {
            this.setState({ restaurants: res.data.restaurant,location:location, cuisine: cuisine, pageArr:res.data.pageCount })

        }).catch(err => console.log(err))
    }
    handlePageChange = () => {
        const { mealtype, location, cuisine, sort, page, lcost, hcost,pageArr } = this.state;
      
        axios({
            method: 'POST',
            url: 'http://localhost:2021/filterRestaurants',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype_id: mealtype,
                location_id: location,
                cuisine: cuisine.length == 0 ? undefined : cuisine,
                lcost: lcost,
                hcost: hcost,
                page: page,
                pageArr:pageArr

            }
        }).then(res => {
            this.setState({ restaurants: res.data.restaurant, location: location, cuisine: cuisine, page:page, pageArr:res.data.pageCount })

        }).catch(err => console.log(err))

    }
   
    render() {
        const { restaurants, pageArr } = this.state;
        const { locations } = this.state;
        return (
            <div>
                <div id="myId" className="heading" style={{ fontSize: "22px" }}>Search Results..</div>
                <div className="container"></div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-lg-4 filter-options">
                            <div className="filter-heading">Filters / Sort</div>
                            <span className="glyphicon glyphicon-chevron-down toggle-span" data-toggle="collapse"
                                data-target="#filter"></span>
                            <div id="filter" className="collapse show">
                                <div className="Select-Location">Select Location</div>

                                <select className="Rectangle-2236" onChange={ this.handleLocationChange }>
                                    <option value="0" >Select</option>
                                     {locations.length != 0 ? locations.map((item) => {
                                        return <option value={item.location_id} >{`${ item.name }, ${ item.city }`}</option>
                                    }) : null}
                                </select>
                                <div className="Cuisine">Cuisine</div>
                                <div>
                                    <input type="checkbox" name="check" onChange={() => { this.handleCuisineChange(1) }} />
                                    <span className="checkbox-items" >&nbsp;North Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="check" onChange={() => { this.handleCuisineChange(2) }} />
                                    <span className="checkbox-items" >&nbsp;South Indian</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="check"  onChange={() => { this.handleCuisineChange(3) }} />
                                    <span className="checkbox-items" >&nbsp;Chinese</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="check" onChange={() => { this.handleCuisineChange(4) }} />
                                    <span className="checkbox-items" >&nbsp;Fast Food</span>
                                </div>
                                <div>
                                    <input type="checkbox" name="check" onChange={() => { this.handleCuisineChange(5) }} />
                                    <span className="checkbox-items" >&nbsp;Street Food</span>
                                </div>
                                <div className="Cuisine">Cost For Two</div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCostChange(1, 500) }} />
                                    <span className="checkbox-items">&nbsp;Less than ₹ 500</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCostChange(500, 1000) }} />
                                    <span className="checkbox-items">&nbsp;₹ 500 to ₹ 1000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCostChange(1000, 1500) }} />
                                    <span className="checkbox-items">&nbsp;₹ 1000 to &#8377; 1500</span>
                                </div>
                                <div style={{ display: 'block' }}>
                                    <input type="radio" name="cost" onChange={() => { this.handleCostChange(1500, 2000) }} />
                                    <span className="checkbox-items">&nbsp;₹ 1500 to ₹ 2000</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCostChange(2000, 50000) }} />
                                    <span className="checkbox-items">&nbsp;₹ 2000 +</span>
                                </div>
                                <div>
                                    <input type="radio" name="cost" onChange={() => { this.handleCostChange(1, 50000) }} />
                                    <span className="checkbox-items">&nbsp;All</span>
                                </div>
                                <div className="Cuisine">Sort</div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => { this.handleSortChange(1) }} />
                                    <span className="checkbox-items">&nbsp;Price low to high</span>
                                </div>
                                <div>
                                    <input type="radio" name="sort" onChange={() => { this.handleSortChange(-1) }} />
                                    <span className="checkbox-items">&nbsp;Price high to low</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-8 col-md-8 col-lg-8">
                            {restaurants.length != 0 ? restaurants.map((item) => {
                                return <div className="Item" onClick={() => { this.handleClick(item._id) }}>
                                    <div>
                                        <div className="small-item vertical">
                                            <img className="img" src={`../${ item.image }`} />
                                        </div>
                                        <div className="big-item">
                                            <div className="rest-name">{item.name}</div>
                                            <div className="rest-location">{item.locality}</div>
                                            <div className="rest-address">{item.city}</div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div>
                                        <div className="margin-left">
                                            <div className="Bakery">CUISINES : {item && item.cuisine ? item.cuisine.map(i => { return `${ i.name }, ` }) : null}</div>
                                            <div className="Bakery">COST FOR TWO : &#8377; {item.min_price} </div>
                                        </div>
                                    </div>
                                </div>
                            }) : <div className="no-record">No Records Found..</div>}

                            {restaurants.length != 0 ? <div className="pagination">
                                <a href="#">&laquo;</a>
                             {pageArr ? pageArr.map (i => {return <a onClick={()=>this.handlePageChange(i)}>{i}</a>}):null}
                                <a href="#">&raquo;</a>
                            </div> : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Filter);


