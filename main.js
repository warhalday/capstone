(function (window) {
    const PARENT_FRAG = document.createDocumentFragment();
    // Game
    const Game = function (el, option) {
        this.el = document.getElementById(el);
        this.option = option;

        this.info_div = document.createElement("div");
        this.info_div.id = "info_div";

        this.deck_div = document.createElement("div");
        this.deck_div.id = "deck_div";
        this.gameDeck = new Deck(option);
        this.gameDeck.buildDeck.call(this);

        const pageTitle = document.createElement("h1");
        pageTitle.innerHTML = "MAKE MORE / THINK LESS"
        this.info_div.appendChild(pageTitle);

        const shuffleButton = document.createElement("button");
        shuffleButton.innerHTML = "Shuffle";
        shuffleButton.onclick = this.gameDeck.shuffle.bind(this);
        this.info_div.appendChild(shuffleButton);

        const instructions = function () {
            return alert(
                "1. Take the next 10 minutes to make a collage." +
                "\r\n2. Shuffle deck and draw a card. Follow its instructions to use towards completing your current collage or to start a new one." +
                "\r\n3. Repeat Step 2 until collage is complete." +
          
                "\r\n\u2022 Use or skip as many cards as you like." +
                "\r\n\u2022 You get to decide when a collage is complete." +
                "\r\n\u2022 When complete, draw a new card and start a new collage."+ 
                //"\r\n\u2022 These cards are just suggestions to help users generate collages"+
                "\r\n\u2022 The collages you make may be bad but thats the point.");
                
        }

        const instructionsButton = document.createElement("button");
        instructionsButton.innerHTML = "Instructions";
        instructionsButton.onclick = instructions;
        this.info_div.appendChild(instructionsButton);

        this.rules = {
            discardRow: [{
                name: "",
                droppable: true,
                maxCards: this.deck_div.children.length,
                piles: 1
            }],
            gameComplete: function () {
                if (e.currentTarget.childNodes.length === this.discardRow[0].maxCards) {
                    console.log("You win!");
                }
            }
        }

        this.buildDiscard = function () {
            for (let i = this.rules.discardRow.length - 1; i >= 0; i--) {
                let zone = document.createElement("div");
                zone.className = "zone row";
                let discardRule = this.rules.discardRow[i];
                let x = 0;
                while (x < discardRule.piles) {
                    let discardObj = new DiscardPile();
                    discardObj.name = discardRule.name;
                    discardObj.droppable = discardRule.droppable;
                    discardObj.id = "pile-" + x;
                    let buildObj = discardObj.init();
                    zone.appendChild(buildObj);
                    x++;
                }
                this.el.appendChild(zone);
            }
        }

        this.el.appendChild(this.info_div);
        this.el.appendChild(this.deck_div);
        this.buildDiscard();
    };

    const Deck = function (option) {
        this.deckData = option.data;
        this.buildDeck = function () {

            // Clears the deck after each use:
            this.deck_div.innerHTML = "";
            for (let i = this.option.data.length - 1; i >= 0; i--) {
                const card = new Card();
                // Gives each card a unique ID:
                card.id = "card-" + i;
                card.data = this.option.data[i];
                card.buildCard(PARENT_FRAG);
            }
            this.deck_div.appendChild(PARENT_FRAG);
            this.gameDeck.stack.call(this);
        }
    };

    Deck.prototype.shuffle = function () {
        const cardsToShuffle = this.gameDeck.deckData;
        let remainingCards = cardsToShuffle.length,
            temp,
            i;
        // While there remain elements to shuffle…
        while (remainingCards) {
            // Pick a remaining element…
            i = Math.floor(Math.random() * remainingCards--);
            // And swap it with the current element:
            temp = cardsToShuffle[remainingCards];
            cardsToShuffle[remainingCards] = cardsToShuffle[i];
            cardsToShuffle[i] = temp;
        }
        this.gameDeck.deckData = cardsToShuffle;
        this.gameDeck.buildDeck.call(this)
    };

    Deck.prototype.stack = function () {
        let cards = this.deck_div.children;
        for (let i = cards.length - 1; i >= 0; i--) {
            cards[i].style.top = i + "px";
            cards[i].style.left = i + "px";
            cards[i].classList.add("stacked_card");
        }
    }

    const Card = function () {
        this.id = "";
        this.data = "";

        this.cardContainer = document.createElement("div");
        this.cardContainer.className = "card_container";

        this.cardFront = document.createElement("div");
        this.cardFront.className = "card_front";

        this.cardBack = document.createElement("div");
        this.cardBack.className = "card_back";

        this.buildCard = function () {
            let flipDiv = document.createElement("div"),
                frontValDiv = document.createElement("div"),
                backValDiv = document.createElement("div"),
                categoryDiv = document.createElement("div");

            flipDiv.className = "flip";
            frontValDiv.className = "front_val";
            backValDiv.className = "back_val";
            categoryDiv.className = "category_val";

            // Refers to the keys/values from
            // flashcard_QA.json:
            frontValDiv.innerHTML = this.data.q;
            backValDiv.innerHTML = this.data.a;

            let learnMore = document.createElement("a");
            learnMore.text = "";
            learnMore.href = this.data.link;
            learnMore.target = "";

            let infoImage = document.createElement("img");
            infoImage.src = "";

            learnMore.appendChild(infoImage);
            learnMore.addEventListener("click", function (e) {
                // Stop the card from flipping over when
                // you open a link in the child container:
                e.stopPropagation();
            })
            backValDiv.appendChild(learnMore);

            categoryDiv.innerHTML = this.data.category;

            this.cardFront.appendChild(frontValDiv);
            this.cardFront.appendChild(categoryDiv);
            this.cardBack.appendChild(backValDiv);

            flipDiv.appendChild(this.cardFront);
            flipDiv.appendChild(this.cardBack);

            this.cardContainer.id = this.id;
            this.cardContainer.appendChild(flipDiv);

            this.cardContainer.onclick = cardClick;
    
            PARENT_FRAG.appendChild(this.cardContainer);
        }
    }

    const cardClick = (function (e) {
        let counter = 0;
        return function (e) {
            e.currentTarget.classList.toggle("flip_card");
            e.currentTarget.classList.toggle("slide_over");
            e.currentTarget.style.zIndex = counter;
            counter++;
        }
    })();

   

    window.Game = Game;
})(window);