init();

function init() {
    document.addEventListener('click', flipCard);

    document.addEventListener('input', () => {
        rows_out.value = rows_set.value;
        cols_out.value = cols_set.value;
        cards_out.value = rows_out.value * cols_out.value
        if (cards_out.value % 2 !== 0) {
            start_btn.disabled = true;
            cards_out.style.color = '#fa217b';
        }
        if (cards_out.value % 2 === 0) {
            start_btn.disabled = false;
            cards_out.style.color = '#31c005';
        }
    })

    start_btn.addEventListener('click', startGame);
    stop_btn.addEventListener('click', stopGame);

    again_btn_1.addEventListener('click', () => {
        hideResultWindow();
        startGame();
    });
    again_btn_2.addEventListener('click', () => {
        hideResultWindow();
        startGame();
    });

    cancel_btn_1.addEventListener('click', hideResultWindow);
    cancel_btn_2.addEventListener('click', hideResultWindow);

    let firstCard, secondCard, cols, rows, timer;
    let step = 1;
    let guessed = 0;

    async function flipCard(e) {
        if (e.target.classList.contains('front') && !fieldCards.classList.contains('disabled')) {
            switch (step) {
                case 1: {
                    fieldCards.classList.toggle('disabled');
                    firstCard = e.target.parentElement;
                    firstCard.classList.toggle('turned');
                    step++;

                    setTimeout(() => fieldCards.classList.toggle('disabled'), 500);

                    break;
                }
                case 2: {
                    fieldCards.classList.toggle('disabled');
                    secondCard = e.target.parentElement;
                    secondCard.classList.toggle('turned');
                    step = 1;

                    if (compareCards(e.target.parentElement)) {
                        setTimeout(() => {
                            foundOut();
                            fieldCards.classList.toggle('disabled');
                        }, 500)
                    } else {
                        setTimeout(() => {
                            notFound();
                            setTimeout(() => fieldCards.classList.toggle('disabled'), 500)
                        }, 1000)
                    }          
                }                
            }            
        }
    }

    function foundOut() {
        firstCard.classList.add('guessed');
        secondCard.classList.add('guessed');
        guessed++;
        guessed === (cols * rows) / 2 ? winGame() : false;
    }

    function compareCards(card) {
        return card.dataset.id == firstCard.dataset.id ? true : false;
    }

    function notFound() {
        firstCard.classList.toggle('turned');
        secondCard.classList.toggle('turned');
    }

    function winGame() {
        endGame();
        showResultWindow('win');
    }

    function loseGame() {
        endGame();
        showResultWindow();
    }

    function startGame() {
        stop_btn.disabled = false;
        timer_out.value = 90;
        timer_out.style.color = '#66ceee';
        if (fieldCards.classList.contains('disabled')) {
            fieldCards.classList.toggle('disabled');
        }
        start_btn.disabled = true;
        rows_set.disabled = true;
        cols_set.disabled = true;
        cols = cols_out.value
        rows = rows_out.value

        let data = [];
        for (let i = 1; i <= (cols * rows) / 2; i++) {
            let elem = i
            if (elem > 9) {
                elem -= 9;
            }
            data.push(elem);
            data.push(elem);
        }
        data.sort(() => Math.random() - 0.5)
    
        fillTable();
        startTimer();
        
        function fillTable() {
            let tbody = document.createElement('tbody');
    
            for (let i = 1; i <= rows; i++) {
                let tr = document.createElement('tr');
                
                for (let j = 1; j <= cols; j++) {
                    let td = document.createElement('td');
                    td.dataset.id = data.splice(0, 1);
                    td.classList = "flipcard";
                    
                    let front = document.createElement('div');
                    front.classList = "front";
                    td.appendChild(front);
        
                    let back = document.createElement('div');
                    back.classList = "back";
                    td.appendChild(back);
        
                    tr.appendChild(td);
                }
                
                tbody.appendChild(tr);
                fieldCards.appendChild(tbody);
            }
        }   
    }

    function startTimer() {
        timer = setInterval(() => {
            timer_out.value = +timer_out.value - 1;
            if (+timer_out.value <= 10) {
                timer_out.style.color = 'red'; 
            }
            if (+timer_out.value === 0) {
                loseGame();
            }
        }, 1000);
    }

    function stopGame() {
        endGame();
        hideResultWindow();
    }

    function endGame() {
        stop_btn.disabled = true;
        fieldCards.classList.toggle('disabled');
        clearInterval(timer);
        guessed = 0;
    }

    function showResultWindow(res = 'lose') {
        if (res === 'win') {
            win_window.classList.toggle('hidden');
            let show = setInterval(() => {
            win_window.style.opacity = +win_window.style.opacity + 0.1;
                if (+win_window.style.opacity === 1) {
                    clearInterval(show);
                }
            }, 200)
        } else {
            lose_window.classList.toggle('hidden');
            let show = setInterval(() => {
            lose_window.style.opacity = +lose_window.style.opacity + 0.1;
                if (+lose_window.style.opacity === 1) {
                    clearInterval(show);
                }
            }, 200)
        }        
    }

    function hideResultWindow() {
        if (fieldCards.firstElementChild) {
            fieldCards.firstElementChild.remove();
        }
        if ( !win_window.classList.contains('hidden') ) {
            win_window.classList.toggle('hidden');
        }   
        win_window.style.opacity = 0;

        if ( !lose_window.classList.contains('hidden') ) {
            lose_window.classList.toggle('hidden');
        }
        lose_window.style.opacity = 0;

        start_btn.disabled = false;
        rows_set.disabled = false;
        cols_set.disabled = false;
    }

}