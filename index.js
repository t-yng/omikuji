(() => {
    class OmikujiShuffler {
        constructor() {
            this.intervalId  = undefined;
            this.index       = 0;
            fetch('omikuji.json').then((response) => {
                return response.json();
            }).then((json) => {
                this.omikujiList = json;
                this.shuffleArray(this.omikujiList);
            });
        }

        start() {
            if(this.intervalId !== undefined) return false;
            this.intervalId = setInterval(() => {
                const omikuji = this.getNextOmikuji();
                document.querySelector('#js-omikuji-number-text').textContent = omikuji.number;
                document.querySelector('.omikuji-text').textContent = omikuji.text;
                document.querySelector('.omikuji-fortune').textContent = omikuji.fortune;            
            },80);
        }

        stop() {
            clearInterval(this.intervalId);
            const fixedOmikuji = this.omikujiList[this.index];
            this.omikujiList.splice(this.index, 1);
            this.intervalId = undefined;
            return fixedOmikuji;
        }

        getNextOmikuji() {
            this.index += 1;
            if(this.index >= this.omikujiList.length) this.index = 0;
            return this.omikujiList[this.index];
        }

        shuffleArray(array) {
            for(var i = array.length - 1; i > 0; i--){
                var r = Math.floor(Math.random() * (i + 1));
                var tmp = array[i];
                array[i] = array[r];
                array[r] = tmp;
            }
        }
    }

    const prizes = [
        'images/01.jpg',
        'images/02.jpg',
        'images/03.jpg',
        'images/04.jpg',
        'images/05.jpg',
        'images/06.jpg',
        'images/07.jpg',
        'images/08.jpg',
        'images/09.jpg',
        'images/10.jpg',
        'images/11.jpg',
        'images/12.jpg',
        'images/13.jpg',
        'images/14.jpg',
        'images/15.jpg',
        'images/16.jpg',
        'images/17.jpg',
        'images/18.jpg',
        'images/19.jpg',
        'images/20.jpg',
        'images/21.jpg',
        'images/22.jpg',
        'images/23.jpg',
        'images/24.jpg',
        'images/25.jpg'
    ];

    let fixedOmikujiList = [];

    function preloadPrizeImages() {
        prizes.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
        });
    }
    
    function initOmikuji(index) {
        let number  = 'X';
        let text    = '良いことがあるかも';
        let fortune = '運勢';

        if(fixedOmikujiList.hasOwnProperty(index)) {
            const omikuji = fixedOmikujiList[index];
            number = omikuji['number'];
            text   = omikuji['text'];
            fortune = omikuji['fortune'];
        }

        document.querySelector('#js-omikuji-number-text').textContent = number;
        document.querySelector('.omikuji-text').textContent = text;
        document.querySelector('.omikuji-fortune').textContent = fortune;
    }

    function changeNextPrize(nextPrize, prevPrize) {
        const prize = document.querySelector('.prize');
        const prizeIndex = parseInt(prize.getAttribute('data-prize-index'));
        const nextPrizeIndex = prizeIndex+1;

        if(nextPrizeIndex === 0) {
            prevPrize.style.display = 'block';
            document.querySelector('#js-top-page').style.display = 'none';
            document.querySelector('#js-lotter-block').style.display = 'inherit';            
        }

        if(nextPrizeIndex === (prizes.length - 1)) {
            nextPrize.style.display = 'none';
        }

        const prizeImage = prizes[nextPrizeIndex];
        document.querySelector('.prize-image').setAttribute('src', prizeImage);

        prize.setAttribute('data-prize-index', nextPrizeIndex);

        return nextPrizeIndex;
    }

    function changePrevPrize(nextPrize, prevPrize) {
        const prize = document.querySelector('.prize');
        const prizeIndex = parseInt(prize.getAttribute('data-prize-index'));
        const prevPrizeIndex = prizeIndex-1;

        if(prevPrizeIndex === -1) {
            prevPrize.style.display = 'none';
            document.querySelector('#js-top-page').style.display = 'inherit';
            document.querySelector('#js-lotter-block').style.display = 'none';
        }

        const prizeImage = prizes[prevPrizeIndex];
        document.querySelector('.prize-image').setAttribute('src', prizeImage);
        
        if(prevPrizeIndex === (prizes.length - 2)) {
            nextPrize.style.display = 'block';
        }

        prize.setAttribute('data-prize-index', prevPrizeIndex);

        return prevPrizeIndex;
    }

    function main() {
        preloadPrizeImages();
        const omikujiShuffler = new OmikujiShuffler();

        const startButton = document.querySelector('#start-lottery-button');
        startButton.addEventListener('click', () => {
            omikujiShuffler.start();
        });

        const stopButton = document.querySelector('#stop-lottery-button');
        stopButton.addEventListener('click', () => {
            const omikuji = omikujiShuffler.stop();
            const prizeIndex = document.querySelector('.prize').getAttribute('data-prize-index');
            fixedOmikujiList[prizeIndex] = omikuji;
        });

        const nextPrize = document.querySelector('#js-next-prize');
        const prevPrize = document.querySelector('#js-prev-prize');

        nextPrize.addEventListener('click', () => {
            const prizeIndex = changeNextPrize(nextPrize, prevPrize);
            initOmikuji(prizeIndex);
        });

        prevPrize.addEventListener('click', () => {
            const prizeIndex = changePrevPrize(nextPrize, prevPrize);
            initOmikuji(prizeIndex);
        });
    }

    main();
})();