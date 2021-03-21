import React from 'react';
import '../Styles/Header.css';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
const customStyles = {
    // content: {
    //     top: '50%',
    //     left: '50%',
    //     right: 'auto',
    //     bottom: 'auto',
    //     marginRight: '-50%',
    //     transform: 'translate(-50%, -50%)',
    //     padding: '3px',
    //     height: '90%',
    //     width: '85%',
    //     border: 'solid 2px black',
    //     backgroundColor: 'pink'
    // }
    content:{
        position: 'absolute',
        inset: '50% auto auto 50%',
        border: '2px solid black',
        background: 'pink',
        overflow: 'auto',
        borderRadius: '4px',
        outline: 'none',
        padding: '16px',
        marginRight: '-36%',
        transform: 'translate(-50%, -50%)',
        height: '32%',
        width: '28%'
    }

};
class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            loginModalIsOpen: false,
            isUserLoggedIn: false,
            userName: undefined
        }
    }
    handleNavigate = () => {
        this.props.history.push('/');
    }
    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }
    responseGoogle = (response) => {
        if(response && response.profileObj && response.profileObj.name){
        this.setState({ loginModalIsOpen: false, isUserLoggedIn: true, userName: response.profileObj.name })}
        else{
            this.setState({ loginModalIsOpen: false })  
        }
    }
    responseFacebook = (response) =>{
        if(response && response.name){
        this.setState({ loginModalIsOpen: false, isUserLoggedIn: true, userName: response.name });
    }
    else{
        this.setState({ loginModalIsOpen: false });
    }
    }
    handleLogout = () => {
        this.setState({ isUserLoggedIn: false, userName: undefined })
    }
    render() {
        const { loginModalIsOpen, isUserLoggedIn, userName } = this.state;
        return (

            <div style={{ backgroundColor: '#ce0505', height: '50px' }}>
                <div className="header-logo " onClick={this.handleNavigate}>
                    <p>e!</p>
                </div>
                {isUserLoggedIn ? <div style={{ float: 'right' }}>
                    <div className="Login" style={{ display: 'inline-block' }} >{userName}</div>
                    <div className="Create-an-account Rectangle" style={{ display: 'inline-block' }} onClick={this.handleLogout}>Log Out</div>
                </div> :
                    <div style={{ float: 'right' }}>
                        <div className="Login" style={{ display: 'inline-block' }} onClick={this.handleLogin}>Login</div>
                        <div className="Create-an-account Rectangle" style={{ display: 'inline-block' }}>Create an account</div>
                    </div>}
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}

                >
                    <div>
                        <GoogleLogin
                            clientId="234383954001-1snajk2ectn06j5gml2aq55vmuu5fl3k.apps.googleusercontent.com"
                            buttonText="Continue with Gmail"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        /><br/>
                        <FacebookLogin
                            appId="434922257583328"
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            icon="fa-facebook-square" />
                    </div>

                </Modal>
            </div>
        )
    }
}
export default withRouter(Header);