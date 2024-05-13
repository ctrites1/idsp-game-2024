export async function createArenaPage() {
	const html: HTMLElement = document.documentElement;
	const content: string = `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>ACG Arena</title>
    <script defer src="./src/main.ts" type="module"></script>
    </head>

    <body>
        <header><div class="header-btns">
            <button type="button" class="home-button">
            </button>
            <button type="button" class="howTo-button">
            </button>
        </div>
            <div class="round-indicator">Round 1/3
            </div>
            <div class="oppInfo">
                    <div class="oppName">
                        Player 2
                    </div>
                    <div class="oppPic">
                        <img id="oppDisplayPic" src="/assets/update/oppPic.png">
                    </div>
                </div>

            </div>
        </header>
        <div class="arena">

            <div class="lane">
                <div class="trench" id="oppTrench">
                    <div class="cardHolder"></div>
                    <div class="cardHolder"></div>
                    <div class="cardHolder"></div>
                </div>

                <div class="hill">
                    <div class="scoreDisplay">
                        <div id="oppHill">0</div>
                        <div id="playerHill">0</div>
                    </div>
                    <img src="/assets/Hills/waterHill.svg" alt="water hill">
                </div>

                <div class="trench" id="playerTrench">
                    <div class="cardHolder"></div>
                    <div class="cardHolder"></div>
                    <div class="cardHolder"></div>
                </div>
            </div>

            <div class="singleCardView">
                <div class="cardViewFooter">
                </div>
            </div>
        <footer id="playerFooter">
            <div class="playInfo">
                <div class="playerInfo">
                    <div class="playerPic">
                        <img id="displayPic" src="/assets/update/displayPic.png">
                    </div>
                    <div class="playerName">
                        Player 1
                    </div>
                </div>
                <div class="turn-indicator">Turn 1/3
                </div>
            </div>
                <div class="playerHand" id="playerHandContainer">
                </div>
                <div class="playerDeck"></div>
                <div class="action-buttons">
                    <button class="endTurn-button" type="button">End Turn</button>
                    <button class="surrender-button" type="button">Surrender</button>
                    <button class="log-button" type="button">Log</button>
                </div>
            </footer>
    </body>
    `;
	html.innerHTML = content;
	return html;
}
