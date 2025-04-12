import { useState,useEffect } from 'react'
import { languages } from '../languages'
import clsx from 'clsx'
import { getFarewellText,getRandomWord } from '../utlis'
import Confetti from "react-confetti"

import './index.css'

export default function App() {
    //state values
    const [word,setWord] = useState(() => getRandomWord())
    const [guessed,setGuessed] = useState([])
    const [status,setStatus] = useState({
      main: "",
      sub: "",
      style: "status-section"
    })
    console.log(word)

    //static declarations
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("")
    const wordArray = word.split("")
    
    const wrongGuessCount = guessed.filter(letter => !word.includes(letter)).length

    const gameWon = word.split("").every(letter => guessed.includes(letter))
    const gameLost = wrongGuessCount >= languages.length-1
    const isGameOver = gameLost || gameWon  ? true : false

  

    useEffect(() => {
      if (gameWon && !gameLost) {
        setStatus({
          main: "You Win!",
          sub: "Well Done!!!",
          style: "status-section-win"
        });
      } else if (!gameWon && gameLost) {
        setStatus({
          main: "Game over!",
          sub: "You Lose! Better start learning Assembly😭",
          style: "status-section-lose"
        });
      } else {
        setStatus({
          main: "",
          sub: "",
          style: "status-section"
        });
      }
    }, [gameWon, gameLost]);
    

     
    
    //languages
    const languagesList = languages.map((item,index) => {
      const styles = {
        backgroundColor:item.backgroundColor,
        color:item.color
      }
      const langClassName = index<wrongGuessCount ? "chip lost" : "chip"
      
      return <span className={langClassName} key={item.name} style={styles}>{item.name}</span>
    })

    let guessElements 

    if(gameLost){
      guessElements = wordArray.map((item,index) => {
        return <span style={{ color: 'red' }} key={index} >{item}</span>
      })
    }
    else{

      //blank letters to guess
      guessElements = wordArray.map((item,index) => {
        //one way
        /*
        const isGuessed = guessed.includes(item)
        const isCorrect = isGuessed && word.includes(item)
        const isWrong = isGuessed && !word.includes(item)
        const toDisplay = clsx({true:isCorrect,false:isWrong})
        const valueToDisplay = toDisplay ? item.toUpperCase() : ""
        return <span key={index} >{valueToDisplay}</span>
        */
        return <span key={index} >{guessed.includes(item) ? item.toUpperCase() : ""}</span>
      })
    }

    
    
    

    function handleLetterClick(letter){
      
      setGuessed(prev => {
        
        return (prev.includes(letter)) ? prev : [...prev,letter]
      })
    }

    useEffect(() => {
      languages.map((lang,index) => {
        if(index+1 === wrongGuessCount){
          setStatus(prev => ({
            ...prev,
            main: getFarewellText(lang.name),
            style: "status-section-middle"
            
          }))
          
        }
      })
    },[wrongGuessCount])

    

    //keyboard
    const alphabet = alphabets.map(item => {
      const isGuessed = guessed.includes(item)
      const isCorrect = isGuessed && word.includes(item)
      const isWrong = isGuessed && !word.includes(item)
      const classname = clsx({correct:isCorrect,wrong:isWrong})
      
      return <button className={classname} 
              onClick={() => handleLetterClick(item)} 
              disabled = {isGameOver}
              key={item}>
              {item.toUpperCase()}
              </button>
    })

    
    function newGame(){
      setWord(() => getRandomWord())
      setGuessed([])
      setStatus({
        main: "",
        sub: "",
        style: "status-section"
      })

    }

    return (
      <main>
        {gameWon && <Confetti 
                    recycle={false}
                    numberOfPieces={1000}
                    />}
        <header>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
        </header>
        <div className={status.style}>
          <h2 className='status-section-h3'>{status.main}</h2>
          <p className='status-section-p'>{status.sub}</p>
        </div>
        <div className='languages-section'>
          {languagesList}
        </div>
        <div className='guess-box'>
          {guessElements}
        </div>
        <div className='alphabets-keyboard'>
          {alphabet}
        </div>
        {isGameOver && <button onClick = {newGame} className='new-game'>New Game</button> }
      </main>
    )
}


