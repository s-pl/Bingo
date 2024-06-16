const generatedNumbers = [];
let gameInterval = null;
let currentSpeed = 3000;
let voiceLanguage = 'es-ES';

document.addEventListener('keydown', function(event) {
	if (event.code === 'Space') {
		toggleGame();
	}
});

function toggleGame() {
	gameInterval === null ? startGame() : stopGame();
}

function startGame() {
	document.getElementById('instructions').style.display = 'none';
	gameInterval = setInterval(generateNumber, currentSpeed);
}

function stopGame() {
	clearInterval(gameInterval);
	gameInterval = null;
}

function generateNumber() {
	if (generatedNumbers.length === 90) {
		alert("Todos los números han sido generados.");
		stopGame();
		return;
	}

	let number;
	do {
		number = Math.floor(Math.random() * 90) + 1;
	} while (generatedNumbers.includes(number));

	generatedNumbers.push(number);

	const numberDisplay = document.getElementById('numberDisplay');
	numberDisplay.textContent = number;
	numberDisplay.style.animation = 'none';
	setTimeout(() => numberDisplay.style.animation = 'bounceIn 1s', 10);
	speakNumber(number);
	updateGeneratedNumbersList();
}

function speakNumber(number) {
	if ('speechSynthesis' in window) {
		const msg = new SpeechSynthesisUtterance(number.toString());
		msg.lang = voiceLanguage;
		window.speechSynthesis.speak(msg);
	} else {
		console.error('Speech Synthesis not supported in this browser.');
	}
}

function checkWinner() {
	const winnerInput = document.getElementById('winnerInput').value.trim();
	if (!winnerInput) {
		alert("Por favor, introduce números válidos separados por comas.");
		return;
	}

	const winnerNumbers = winnerInput.split(',').map(num => parseInt(num.trim(), 10));
	if (winnerNumbers.some(isNaN) || winnerNumbers.some(num => num < 1 || num > 90)) {
		alert("Por favor, introduce números válidos entre 1 y 90 separados por comas.");
		return;
	}

	const missingNumbers = winnerNumbers.filter(num => !generatedNumbers.includes(num));

	if (missingNumbers.length === 0) {
		alert("¡Felicidades! Todos los números del cartón han sido generados.");
	} else {
		alert("Números no generados: " + missingNumbers.join(', '));
	}
}

function showGeneratedNumbers() {
	const generatedNumbersList = document.getElementById('numbersList');
	generatedNumbersList.textContent = generatedNumbers.slice(-5).join(', ');
}

function updateGeneratedNumbersList() {
	const generatedNumbersList = document.getElementById('numbersList');
	const lastNumber = generatedNumbers[generatedNumbers.length - 1];

	if (generatedNumbers.length > 5) {
		generatedNumbersList.removeChild(generatedNumbersList.firstChild);
	}

	const span = document.createElement('span');
	span.textContent = lastNumber;

	if (generatedNumbersList.textContent !== '') {
		const comma = document.createElement('span');
		comma.textContent = ', ';
		generatedNumbersList.appendChild(comma);
	}

	generatedNumbersList.appendChild(span);

	generatedNumbersList.scrollLeft = generatedNumbersList.scrollWidth;
}

function resetGame() {
	clearInterval(gameInterval);
	generatedNumbers.length = 0;
	document.getElementById('numbersList').textContent = '';
	document.getElementById('numberDisplay').textContent = '';
	document.getElementById('instructions').style.display = 'block';
	gameInterval = null;
}

function openSettings() {
	const settingsModal = document.getElementById('settingsModal');
	settingsModal.style.display = 'block';
}

function closeSettings() {
	const settingsModal = document.getElementById('settingsModal');
	settingsModal.style.display = 'none';
}

function applySettings() {
	const speed = document.getElementById('speed').value;
	const backgroundColor = document.getElementById('backgroundColor').value;
	const textColor = document.getElementById('textColor').value;
	const buttonColor = document.getElementById('buttonColor').value;
	const fontFamily = document.getElementById('fontFamily').value;
	const voiceLanguage = document.getElementById('voiceLanguage').value;

	currentSpeed = parseInt(speed);
	document.body.style.backgroundColor = backgroundColor;
	document.body.style.color = textColor;
	const buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		button.style.backgroundColor = buttonColor;
		button.style.color = 'white';
	});
	document.body.style.fontFamily = fontFamily;


	setVoiceLanguage(voiceLanguage);

	closeSettings();
}

function setVoiceLanguage(language) {
	voiceLanguage = language;
}

document.getElementById('settingsIcon').addEventListener('click', openSettings);
document.getElementById('settingsModalClose').addEventListener('click', closeSettings);
