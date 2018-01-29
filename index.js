(() => {
    class OmikujiShuffler {
        constructor() {
            this.intervalId  = undefined;
            this.index       = 0;
            fetch('omikuji.json').then((response) => {
                return response.json();
            }).then((json) => {
                this.omikujiList = json;
            });
        }

        start() {
            if(this.intervalId !== undefined) return false;

            this.intervalId = setInterval(() => {
                const omikuji = this.getNextOmikuji();
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
    }

    const prizes = [
        'images/L131-01.jpg',
        'images/L131-08.jpg',
        'images/L281-01.jpg',
        'images/L296-06.jpg',
        'images/L334-03.jpg',
        'images/L346-03.jpg',
        'images/L384-06.jpg',
        'images/a6205-020.jpg',
        'images/a6336-016.jpg',
        'images/a6530-165.jpg',
        'images/b333-01.jpg',
        'images/b358-08.jpg',
        'images/b464-04.jpg',
        'images/b8051-026.jpg',
        'images/c2268-089.jpg',
        'images/c4204-587.jpg',
        'images/disney.jpg',
        'images/e063-06.jpg',
        'images/f142-01.jpg',
        'images/ice.jpg',
        'images/k104-09.jpg',
        'images/k279-01.jpg',
        'images/kome.jpg',
        'images/niku.jpg',
        'images/onsen.jpg',
    ];

    let fixedOmikujiList = [];

    function preloadPrizeImages() {
        prizes.forEach((url) => {
            const img = document.createElement('img');
            img.src = url;
        });
    }
    
    function initOmikuji(index) {
        let text = '';
        let fortune = '';

        if(fixedOmikujiList.hasOwnProperty(index)) {
            const omikuji = fixedOmikujiList[index];
            text = omikuji['text'];
            fortune = omikuji['fortune'];
        }

        document.querySelector('.omikuji-text').textContent = text;
        document.querySelector('.omikuji-fortune').textContent = fortune;
    }

    function changeNextPrize(nextPrize, prevPrize) {
        const prize = document.querySelector('.prize');
        const prizeIndex = parseInt(prize.getAttribute('data-prize-index'));
        const nextPrizeIndex = prizeIndex+1;

        if(nextPrizeIndex === (prizes.length - 1)) {
            nextPrize.style.display = 'none';
        }

        const prizeImage = prizes[nextPrizeIndex];
        document.querySelector('.prize-image').setAttribute('src', prizeImage);
        
        if(nextPrizeIndex === 1) {
            prevPrize.style.display = 'block';
        }

        prize.setAttribute('data-prize-index', nextPrizeIndex);
        
        return nextPrizeIndex;
    }

    function changePrevPrize(nextPrize, prevPrize) {
        const prize = document.querySelector('.prize');
        const prizeIndex = parseInt(prize.getAttribute('data-prize-index'));
        const prevPrizeIndex = prizeIndex-1;

        if(prevPrizeIndex === 0) {
            prevPrize.style.display = 'none';
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