var ball = document.getElementById("ball");
var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");

const storeName = "PPName";
const storeScore = "PPMaxScore";
const player1Name = "Player 1";
const player2Name = "Player 2";

let score,
	maxScore,
	movement,
	player,
	ballSpeedX = 3,
	ballSpeedY = 3;

let gameOn = false;

let windowWidth = window.innerWidth,
	windowHeight = window.innerHeight;

(function () {
	player = localStorage.getItem(storeName);
	maxScore = localStorage.getItem(storeScore);

	if (player === "null" || maxScore === "null") {
		alert("LET'S START GAME");
		maxScore = 0;
		player = "Player1";
	} else {
		alert(player + " has maximum score of " + maxScore * 100);
	}

	resetBoard(player);
})();

function resetBoard(playerName) {
	player1.style.left = (window.innerWidth - player1.offsetWidth) / 2 + "px";
	player2.style.left = (window.innerWidth - player2.offsetWidth) / 2 + "px";
	ball.style.left = (windowWidth - ball.offsetWidth) / 2 + "px";

	// Lossing player gets the ball

	if (playerName === player2Name) {
		ball.style.top = player1.offsetTop + player1.offsetHeight + "px";
		ballSpeedY = 3;
	} else if (playerName === player1Name) {
		ball.style.top = player2.offsetTop - player2.offsetHeight + "px";
		ballSpeedY = -3;
	}

	score = 0;
	gameOn = false;
}

function storeWin(player, score) {
	if (score > maxScore) {
		maxScore = score;
		localStorage.setItem(storeName, player);
		localStorage.setItem(storeScore, maxScore);
	}

	clearInterval(movement);
	resetBoard(player);

	alert(
		player +
			" wins with a score of " +
			score * 100 +
			". Max score is: " +
			maxScore * 100
	);
}

window.addEventListener("keypress", function () {
	let playerSpeed = 20;

	let playerRect = player1.getBoundingClientRect();

	if (
		event.code === "KeyD" &&
		playerRect.x + playerRect.width < window.innerWidth
	) {
		player1.style.left = playerRect.x + playerSpeed + "px";
		player2.style.left = player1.style.left;
	} else if (event.code === "KeyA" && playerRect.x > 0) {
		player1.style.left = playerRect.x - playerSpeed + "px";
		player2.style.left = player1.style.left;
	}

	if (event.code === "Enter") {
		if (!gameOn) {
			gameOn = true;
			let ballRect = ball.getBoundingClientRect();
			let ballX = ballRect.x;
			let ballY = ballRect.y;
			let ballDia = ballRect.width;

			let player1Height = player1.offsetHeight;
			let player2Height = player2.offsetHeight;
			let player1Width = player1.offsetWidth;
			let player2Width = player2.offsetWidth;

			movement = setInterval(function () {
				// Move ball

				ballX += ballSpeedX;
				ballY += ballSpeedY;

				player1X = player1.getBoundingClientRect().x;
				player2X = player2.getBoundingClientRect().x;

				ball.style.left = ballX + "px";
				ball.style.top = ballY + "px";

				if (ballX + ballDia > windowWidth || ballX < 0) {
					// Reverses the direction
					ballSpeedX = -ballSpeedX;
				}

				// It specifies the center of the ball on the viewport
				let ballPos = ballX + ballDia / 2;

				// Check for Player 1
				if (ballY <= player1Height) {
					// Reverses the direction

					ballSpeedY = -ballSpeedY;
					score++;

					// Check if the game ends

					if (ballPos < player1X || ballPos > player1X + player1Width) {
						storeWin(player2Name, score);
					}
				}

				// Check for Player 2
				else if (ballY + ballDia >= windowHeight - player2Height) {
					// Reverses the direction

					ballSpeedY = -ballSpeedY;
					score++;

					// Check if the game ends

					if (ballPos < player2X || ballPos > player2X + player2Width) {
						storeWin(player1Name, score);
					}
				}
			}, 10);
		}
	}
});
