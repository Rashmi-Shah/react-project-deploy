import React from 'react';
import { withRouter } from 'react-router-dom';
class ImageGallery extends React.Component {
    handleClick= () =>{
        this.props.history.push('./Assets/Idli.jpg');
    }
    render() {
      
        return (
            <div  style={{backgroundColor:"black"}}>
                <div className="container">
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
  <ol className="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1" ></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div className="carousel-inner">
    <div className="carousel-item active">
      <img className="d-block w-100" src="./Assets/pizza.jpg" width="450" height="450" alt="First slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src=".Assets/h1.jpg" width="450" height="450" alt="Second slide"/>
    </div>
    <div className="carousel-item">
      <img className="d-block w-100" src=".Assets/pizza.jpg" width="450" height="450" alt="Third slide"/>
    </div>
  </div>
  <a className="carousel-control-prev" href="#carouselExample" role="button"  data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only" onChange={this.handleClick}>Next</span>
  </a>
</div>

</div>
</div>
           
            )

        }
    }
    export default withRouter(ImageGallery);