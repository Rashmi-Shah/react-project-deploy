import React from 'react';
import '../Styles/Home.css';
import axios from 'axios';
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {
       // sessionStorage.setItem('locationId', undefined);//It clears the session variable
        sessionStorage.clear(); //another method to clear session variable
        axios({
            url: 'https://sheltered-plains-34833.herokuapp.com/location',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({ locations: res.data.location })
            }).catch(err => console.log(err))

        axios({
            url: 'https://sheltered-plains-34833.herokuapp.com/mealtypes',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                this.setState({ mealtypes: res.data.mealtypes })
            }).catch(err => console.log(err))
    }

    render() {
        const { locations, mealtypes } = this.state;
        return (
            <div>
                <Wallpaper locations={locations} />
                <QuickSearch quicksearches={mealtypes} />
              
            </div >
        )
    }
}
export default Home;


