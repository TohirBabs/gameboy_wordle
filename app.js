const { response } = require("express")

const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

let wordle 


const getWordle = () => {
    fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(json =>  {
        console.log(json)
        wordle = json.toUpperCase()
    })

    .catch(err => console.log(err))
}

getWordle()

const keys = [
    'Q','W','E','R','T','Y','U','I','O','P',
    'A','S','D','F','G','H','J','K','L',
    'ENTER','Z','X','C','V','B','N','M','<<'
]

const guessRows = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','','']
]

let currentRow = 0
let currentTile = 0
let isGameOver = false




keys.forEach(key => {
const buttonElement =  document.createElement('button')
buttonElement.textContent = key
buttonElement.setAttribute('id', key)
buttonElement.addEventListener('click', () => handleClick(key))

keyboard.append(buttonElement)
})

guessRows.forEach((guessRow, guessRowIndex) => {
const rowElement =  document.createElement('div')
rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)

guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')

        rowElement.append(tileElement) 
    })

    tileDisplay.append(rowElement)
})

const handleClick = (key) => {


    if (key === '<<'){
        deleteLetter()
        return
    }

    else if (key === 'ENTER'){
        checkRow()
        return
    }

    else {
        addLetter(key)
    }
    console.log('clicked ' + key)
}

const addLetter = (letter) => {

    if(currentTile < 5 && currentRow < 6){
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        tile.setAttribute('data', letter)

        guessRows[currentRow][currentTile] = letter

        currentTile++
        console.log('guessRows', guessRows  )
    }

}


const deleteLetter = () =>{
    if(currentTile > 0)
    {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''

        guessRows[currentRow][currentTile] = ''

        tile.setAttribute('data', '')
        console.log('guessRows', guessRows  )
    }
    
}

const checkRow = () => {
    if (currentTile > 4) {
        const guess = guessRows[currentRow].join('')
        console.log('guess is ' + guess + ', Wordle is ' + wordle)
        flipTile()

        if (wordle === guess) {
            showMessage('Magnificient!')
            isGameOver = True
            return
        }
        else if (currentRow >= 5) {
            showMessage('Game Over!')
            isGameOver = true
            return
        }
        if (currentRow < 5) {
            currentRow++
            currentTile = 0
        }
        
        console.log('guessRows', guessRows  )
    }
}

const showMessage = (message) => {
    const messaageElement = document.createElement('p')
    messaageElement.textContent = message
    messageDisplay.append(messaageElement)

    setTimeout(() => messageDisplay.removeChild(messaageElement), 2000)
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-'+currentRow).childNodes
    const guess = []
    let checkWordle = wordle

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })



    rowTiles.forEach((tile, index) => {

        setTimeout(() => {
            tile.classList.add(guess[index].color, 'flip')
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}