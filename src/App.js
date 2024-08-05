import React from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'

// Main App component
export default function App() {
  const [dice, setDice] = React.useState(allNewDice()) // State for storing dice
  const [tenzies, setTenzies] = React.useState(false) // State for game status
  const [rolls, setRolls] = React.useState(0) // State for roll count
  const [bestRolls, setBestRolls] = React.useState(
    () => localStorage.getItem("rolls") || "No best"
  ) // State for best roll count

  // Effect to check for winning condition
  React.useEffect(() => {
    const allIsHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if(allIsHeld && allSameValue) {
      setTenzies(true)
      console.log("winner")
      if(bestRolls === "No best" || rolls < bestRolls) {
        setBestRolls(rolls)
        localStorage.setItem("rolls", bestRolls)
      }
    }
  }, [dice])

  // Function to generate a new set of dice
  function allNewDice() {
    const newDice = []
    for(let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  // Function to generate a single new die
  function generateNewDie() {
    const randNumber = Math.floor(Math.random() * 6) + 1
    const dieObject = {
      value: randNumber,
      isHeld: false,
      id: nanoid()
    }
    return dieObject
  }

  // Function to handle rolling dice
  function roll() {
    if(!tenzies) {
      setRolls(prevRolls => prevRolls + 1)
      setDice(prevDice => {
        return prevDice.map(die => {
          return die.isHeld === false ? generateNewDie(): {...die}
        })
      })
    } 
    else {
      setDice(allNewDice())
      setTenzies(false)
      setRolls(0)
    }
  }

  // Function to handle holding a die
  function holdDice(id) {
    setDice(prevDice => {
      return prevDice.map(die => {
        return die.id === id ? {...die, isHeld: !die.isHeld} : {...die}
      })
    })
  }

  // Create Die components for each die
  const diceElements = dice.map(die => (
    <Die 
      key={die.id} 
      id={die.id}
      value={die.value} 
      isHeld={die.isHeld}
      holdDice={holdDice}
    />
    ))

  return (
    <main>
        {tenzies && <Confetti/>}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. 
          Click each die to freeze it at its current value between rolls.</p>
      <div className="die-container">
        {diceElements}
      </div>
      <p className="no-rolls">Rolls: {rolls}</p>
      <p>Least rolls: {bestRolls}</p>
      <button className="roll-button" onClick={roll}>{!tenzies ? "Roll" : "New Game"}</button>
    </main>
  )
}