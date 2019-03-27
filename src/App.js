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
      await this.fetchCats();
      console.log(this.state.imgArr);
    }
    const doubledArr = [...this.state.imgArr];
    this.setState( {imgArr: this.state.imgArr.concat(doubledArr) });
    console.log(this.state.imgArr);
  }

  fetchCats = async () => {
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

  buildCards = () => {
    this.shuffleArray(this.state.imgArr);
    return this.state.imgArr.map((imgURL, index) => <span key={index}><img className="card tile" src={imgURL} alt="cat" /></span>)
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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
