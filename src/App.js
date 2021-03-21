// import './App.css';
import React from 'react';
import Print from './New';

class App extends React.Component {
  constructor(){
    super();{/*It access the property of parent Class  */}
    this.state ={
          value : 0
    }
  }
  Increment =()=>{
    this.setState({value : this.state.value + 1});{/* setState is a Special inbuilt function in React  */}
  }
  Decrement=()=>{
  this.setState({value : this.state.value - 1});}
  render() {
    return (
      <div>
        Parent Component
        <Print text="Child Component" value={this.state.value}/>{/*text is a prop*/}
        {/* <h1>{this.state.value}</h1> */}
        <button onClick={this.Increment}>Increment</button>
        <button onClick={this.Decrement}>Decrement</button>
      </div>
    )
  }
}

export default App;

