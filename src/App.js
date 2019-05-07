import React, { Component } from 'react';
import './App.css';

class App extends Component {
  
  state = {
    cats: false,
    gridSize: 2,
    imgArr: [],
    gameBoard: [],
    selectedTiles: []
  }

  fetchPets = async () => {
    let url = '';
    if (this.state.cats) {
      url = "https://api.thecatapi.com/v1/images/search";
    } else {
      url = "https://api.thedogapi.com/v1/images/search"
    }
    for (let i = 0; i < this.state.gridSize/2; i++) {
      await fetch(url,{
        headers: {
          "x-api-key": "693e02ea-6fbe-4cd0-a6da-ec89ba26d2e7",
          "Content-Type": "application/json"
        }, mode: "cors"
      }).then(res => res.json())
      .then(jsonRes => {
        this.setState( {imgArr : this.state.imgArr.concat(jsonRes[0].url)} );
      }) 
    }
  }

  newGame = async () => {
    await this.fetchPets();
    const gameBoardWithIds = this.state.imgArr.map((image, index) => {
      return {
        url: image,
        id: index,
        matchingTile: index+this.state.imgArr.length
      }
    });
    const doubledBoard = gameBoardWithIds.map((tile, index) => {
      const newMatch = tile.id;
      return {...tile, 
        id: index+gameBoardWithIds.length, 
        matchingTile: newMatch
      };
    });
    const fullBoard = this.shuffleArray(gameBoardWithIds.concat(doubledBoard));
    this.setState( {gameBoard: fullBoard });
  }

  buildCards = () => {
    return this.state.gameBoard.map((tile, index) => 
    <span key={index} onClick = {() => this.revealCard(index)}>
      <img className={this.state.selectedTiles.includes(index) ? 
        "card tile back-of-card" : 
        "card tile"} 
        src={tile.url} 
        alt={this.state.cats ? "cat" : "dog"} 
      />
    </span>)
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  togglePetType = async () => {
    await this.setState( {cats: !this.state.cats, imgArr: []} );
    this.newGame();
  }

  revealCard = index => {
    this.setState({ selectedTiles: [...this.state.selectedTiles, index]})

  }

  
  render() {
    return (
      <>
      <h1>Pet Memory</h1>
      <button onClick={this.togglePetType}>Toggle Pet</button>
      <button onClick={this.newGame}>New Game</button>
      {this.buildCards()}
    </>
    );
  }
}



export default App;
