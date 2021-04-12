import React from 'react';
import '../Styles/details.css';
import queryString from 'query-string';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '3px',
        height: '90%',
        border: 'solid 2px black',
        backgroundColor: 'pink',
        zIndex: '5 !important'
    }
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: {},
            galleryModalIsOpen: false,
            orderModalIsOpen: false,
            formModalIsOpen: false,
            restaurantId: undefined,
            menuItems: [],
            subTotal: 0,
            userName: undefined,
            contactNumber: undefined,
            address: undefined,
            email: undefined
        }
    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const restaurantId = qs.restaurant;

        axios({
            url: `https://sheltered-plains-34833.herokuapp.com/getRestaurantDetailsById/${restaurantId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({ restaurants: res.data.restaurants[0], restaurantId: restaurantId })
            }).catch(err => console.log(err))

    }
    handleClick = (state, value) => {
        const { restaurantId } = this.state;
        this.setState({ [state]: value })
        if (state == 'orderModalIsOpen') {
            axios({
                url: `https://sheltered-plains-34833.herokuapp.com/item/${restaurantId}`,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }

            }).then(res => {
                this.setState({ menuItems: res.data.itemsList })
            }).catch(err => console.log(err))

        }
        else if (state == 'formModalIsOpen') {
            this.setState({ orderModalIsOpen: false });
        }
    }
    // handleClose=(state)=>{
    //     this.setState ({[state] : false})
    // }
    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];//Cloning the menuItems array
        const item = items[index];

        if (operationType == 'add') {
            item.qty = item.qty + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }
    handleInputChange = (event, state) => {
        this.setState({ [state]: event.target.value })
    }
    isDate(val) {
        // Cross realm compatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }
    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }
    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }
    getData = (data) => {
        return fetch(`https://sheltered-plains-34833.herokuapp.com/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }
    makePayment = (e) => {
        const { subTotal, email } = this.state;
        this.getData({ amount: subTotal, email: email}).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information);
        })
        e.preventDefault();
    }


    render() {
        const { restaurants, galleryModalIsOpen, orderModalIsOpen, menuItems, subTotal, formModalIsOpen, userName, address, contactNumber, email } = this.state;
        return (<div>
            <div>
                <img src={`../${restaurants.image}`} alt="No Image Found.." width="100%" height="450" />
                <button className="button " onClick={() => { this.handleClick('galleryModalIsOpen', true) }}>Image Gallery</button>
            </div>
            <div className="heading">{restaurants.name}</div>
            <button className="btn-order" onClick={() => { this.handleClick('orderModalIsOpen', true) }}>Place Online Order</button>

            <div className="tabs">
                <div className="tab">
                    <input type="radio" id="tab-1" name="tab-group-1" checked />
                    <label htmlFor="tab-1"><b>Overview</b></label>

                    <div className="content">
                        <div className="about">About this place</div>
                        <div className="head">Cuisine</div>
                        <div className="value">{restaurants && restaurants.cuisine ? restaurants.cuisine.map((item) => `${item.name}, `) : null}</div>
                        <div className="head">Average Cost</div>
                        <div className="value">&#8377; {restaurants.min_price} for two people(approx)</div>
                    </div>
                </div>

                <div className="tab">
                    <input type="radio" id="tab-2" name="tab-group-1" />
                    <label htmlFor="tab-2"><b>Contact</b></label>

                    <div className="content">
                        <div className="head">Phone Number</div>
                        <div className="value" style={{ color: "red" }}>{restaurants.contact_number}</div>
                        <div className="head">{restaurants.name}</div>
                        <div className="value">{`${restaurants.locality}, ${restaurants.city}`}</div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={galleryModalIsOpen}
                style={customStyles}

            >

                <div>
                    <div style={{ float: 'right' }} onClick={() => { this.handleClick('galleryModalIsOpen', false) }}>Close</div>
                    <Carousel showThumbs={false} showIndicators={false}>
                        {restaurants && restaurants.thumb ? restaurants.thumb.map((item) => {
                            return <div>
                                <img src={`../${item}`} />
                            </div>
                        }) : null}
                    </Carousel>
                </div>
            </Modal>
            <Modal
                isOpen={orderModalIsOpen}
                style={customStyles}

            >

                {/* <div>
                    <div style={{ float: 'right' }} onClick={() => { this.handleClick('orderModalIsOpen', false) }}>Close</div>
                    {menuItems.map((item) => {
                        return <div>{item.name}
                        </div>
                    })}
                </div> */}
                <div>
                    <div style={{ float: 'right' }} onClick={() => { this.handleClick('orderModalIsOpen', false) }}>Close</div>
                    <div className="glyphicon glyphicon-remove close" style={{ float: ' right' }} onClick={() => this.handleModalClose('itemModalIsOpen')}></div>
                    <h3 className="restaurant-name">{restaurants.name}</h3>
                    <h3 style={{textAlign:"center"}}> SubTotal : {subTotal}</h3>
                    <button className="btn btn-danger" style={{ float:"right" }} onClick={() => this.handleClick('formModalIsOpen', true)}>Pay Now</button>
                    {menuItems.map((item, index) => {
                        return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '2px solid #dbd8d8' }}>
                            <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                    <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9" style={{
                                        paddingLeft: '10px', paddingBottom: '10px'
                                    }}>
                                        <span className="card-body">
                                            <h5 className="item-name">{item.name}</h5>
                                            <h5 className="item-name">₹{item.price}</h5>
                                            <p className="card-text">{item.description}</p></span>
                                    </div>
                                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                        <img className="card-img-center title-img" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                        {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                            <div className="add-number">
                                                <button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button>
                                            </div>
                                        }</div>
                                </div>
                            </div></div>
                    })}
                    <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}></div>
                </div>

            </Modal>
            <Modal
                isOpen={formModalIsOpen}
                style={customStyles}

            >

                <div>
                    <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={() => this.handleModalClose('formModalIsOpen')}></div>
                    <form onSubmit={this.makePayment}>
                        <table>
                            <tr>
                                <td>Name</td>
                                <td><input type="text" value={userName} onChange={(event) => this.handleInputChange(event, 'userName')} /></td>
                            </tr>
                            <tr>
                                <td>Contact Number</td>
                                <td><input type="text" value={contactNumber} onChange={(event) => this.handleInputChange(event, 'contactNumber')} /></td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td><input type="text" value={address} onChange={(event) => this.handleInputChange(event, 'address')} /></td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td><input type="text" value={email} onChange={(event) => this.handleInputChange(event, 'email')} /></td>
                            </tr>
                        </table>
                        <input type="submit" className="btn btn-danger" value="Proceed" />
                    </form>
                </div>
            </Modal>
        </div>
        )
    }
}

export default withRouter(Details);