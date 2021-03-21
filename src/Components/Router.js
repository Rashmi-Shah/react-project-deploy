import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './Home';
import Filter from './Filter';
import Details from './Details';
import App from '../App';
import Header from './Header';


const Router = () => {
    return (
        <BrowserRouter>
        <Header/>
            <Route exact path="/" component={Home} />
            <Route path="/Filter" component={Filter} />
            <Route path="/Details" component={Details} />
            <Route path="/App" component={App} /> 
        </BrowserRouter>
    )
}

export default Router;