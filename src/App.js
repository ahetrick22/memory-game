import React, { Component } from 'react';
import './App.css';
const cardBack = require('./card-back.jpg');

class App extends Component {
  
  state = {
    cats: false,
    gridSize: 4,
    imgArr: [],
    gameBoard: [],
    selectedTiles: []
  }

  fetchPets = async () => {
    this.setState({ imgArr: [] });
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
    this.setState({ selectedTiles: [] });
    await this.fetchPets();
    const gameBoardWithIds = this.state.imgArr.map((image, index) => {
      return {
        url: image,
        id: index,
        matchingTile: index+this.state.imgArr.length,
        found: false
      }
    });
    const doubledBoard = gameBoardWithIds.map((tile, index) => {
      const newMatch = tile.id;
      return {...tile, 
        id: index+gameBoardWithIds.length, 
        matchingTile: newMatch,
        found: false
      };
    });
    const fullBoard = this.shuffleArray(gameBoardWithIds.concat(doubledBoard));
    this.setState( { gameBoard: fullBoard });
  }

  buildCards = () => {
    return this.state.gameBoard.map((tile, index) => 
    <span key={index} onClick = {() => this.revealCard(tile.id)}>
      <img className= 'card tile'
        src={this.state.selectedTiles.includes(tile.id) || tile.found === true
          ? tile.url 
          : cardBack} 
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

  checkMatch = () => {
    const tile1 = this.state.gameBoard.find(tile => tile.id === this.state.selectedTiles[0]);
    const tile2 = this.state.gameBoard.find(tile => tile.id === this.state.selectedTiles[1]);
    if (tile1.id === tile2.matchingTile) {
      tile1.found = true;
      tile2.found = true;
      this.setState({ selectedTiles: [] });      
      if (!this.state.gameBoard.find(tile => !tile.found)) {
        alert("You've won the game");
      }
    } else {
      setTimeout(() => {
        this.setState({ selectedTiles: [] });
      }, 3000);
    }
  }

  revealCard = async (tileId) => {
    const clickedTile = this.state.gameBoard.find(tile => tileId === tile.id)
    const { selectedTiles } = this.state; 
    switch (selectedTiles.length) {
      case 0:
      if (!clickedTile.found) {
      await this.setState({ selectedTiles: [tileId]})
      }
      break;
      case 1:
        if (!selectedTiles.includes(tileId) && !clickedTile.found) {
          await this.setState({ selectedTiles: [...this.state.selectedTiles, tileId]})
          this.checkMatch();
        }
        break;
      default:
        break;
    }
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
