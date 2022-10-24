const $board = $('#board');
const $submitWordForm = $('#submit-word');
const $word = $('.word');
const $wordList = $('#word-list')
const $scoreText = $('#score')
const $timerText = $('#timer')
const $alert = $('#alert')
const wordArr = [];
const msg = {"ok":'is a word! Keep Going',"not-word":'is not a word! Keep Going',"not-on-board":'is not possible on this board! Keep Going', "exists":'was already entered! Keep Going'}
let score = 0
let secs = 60
let intId;
const words = new Set()

function selectLetter(evt){
    $(evt.target.closest('div')).addClass('bg-warning');
    $(evt.target.closest('div')).removeClass('bg-light');
    wordArr.push(evt.target.innerText);
    const word = wordArr.join('');
    $word.val(word)
}

function clearLetters(){
    $('.bg-warning').addClass('bg-light')
    $('.bg-warning').removeClass('bg-warning')
    wordArr.length = 0
    const word = wordArr.join('');
    $word.val(word)
}

function displayAlert(result,word) {
    if(result === "ok"){
        $alert.addClass('alert-success')
        $alert.removeClass('alert-danger d-none')
    } else {
        $alert.addClass('alert-danger')
        $alert.removeClass('alert-success d-none')
    }
    $alert.text(`${word} ${msg[result]}`)
}

function updateScore(){
    wordArr.forEach(word => score += word.length)
    $scoreText.text(`SCORE:${score}`)
}

function updateTimer(){
    $timerText.text(`TIMER: 00:${secs}`)
}

function timer(){
    intId = setInterval(tick, 1000)
}

function gameOver(){
    $board.off('click', 'td', selectLetter);
    $submitWordForm.off('submit', submitWord);
    $('button').prop('disabled', true);
    $timerText.text(`GAME OVER`);
    scoreGame()
}

function tick() {
    secs -= 1;
    updateTimer();

    if (secs === 0) {
      clearInterval(intId);
      gameOver()
    }
}

async function submitWord(evt) {
    evt.preventDefault();
    const word = wordArr.join('');
    if(words.has(word)){
        clearLetters()
        displayAlert("exists", word)
        return
    }
    const res = await axios.get('/submit-word', { params: {word:word}});
    result = res.data.result
    if(result === 'ok'){
        words.add(word);
        $wordList.append($("<li>", { text: word }))
        updateScore()
    }
    displayAlert(result, word)
    clearLetters()
}

async function scoreGame() {
    $board.hide();
    $alert.hide();
    $submitWordForm.hide();
    const res = await axios.post("/track-score", { score: score });
    if (res.data.brokeRecord) {
        $scoreText.text(`New record: ${score}`);
    } else {
        $scoreText.html(`Final score: ${score} <br> High score: ${res.data.high_score}`);
    }
    $timerText.text(`#PLAYS: ${res.data.num_plays}`)
  }
$board.on('click', 'td', selectLetter)
$submitWordForm.on('submit', submitWord)
timer()