import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  state = {
    cats: true,
    gridSize: 16,
    imgArr: []
  }

  componentDidMount = async () => {
    if (this.state.cats) {
      for (let i = 0; i < this.state.gridSize/2; i++) {
        await fetch("https://api.thecatapi.com/v1/images/search",{
          headers: {
            "x-api-key": "693e02ea-6fbe-4cd0-a6da-ec89ba26d2e7",
            "Content-Type": "application/json"
          }, mode: "cors"
        }).then(res => res.json())
        .then(jsonRes => {
          console.log(jsonRes[0].url)
          this.setState( {imgArr : this.state.imgArr.concat(jsonRes[0].url)} );
        }) 
      }
    }
  }

  buildCards = () => {
    return this.state.imgArr.map((imgURL, index) => <div key={index} className="card"><img src={imgURL} alt="cat" /></div>)
  }
  
  render() {
    return (
      <>
      <h1>Pet Memory</h1>
      {this.buildCards()}
    </>
    );
  }
}



export default App;
