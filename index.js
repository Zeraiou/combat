const canvas = document.querySelector("canvas")

const c = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 576

const timerCard = document.getElementById("timer")
const resultCard = document.getElementById("result")

resultCard.style.visibility = "hidden"

const fullRadiant = Math.PI * 2
let gameInterval = null
let roundOver = false
let gameOver = false
let amountOfRoundFinished = 0
let winner = ""
let timer = 60
let gameFrame = 0
let inBetweenRoundFrame = 0

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	image: {
		imageSrc: "./assets/images/background.png",
		frameRate: 1,
		frameBuffer: 1,
		loop: false,
		autoplay: false
	},
})

const shopTopRoof = {
	position: {
		x: 645,
		y: 247,
	},
	width: 260,
	height: 1,
}

const shopBottomRoof = {
	position: {
		x: 628,
		y: 325,
	},
	width: 293,
	height: 1,
}

const platforms = []
platforms.push(shopTopRoof)
platforms.push(shopBottomRoof)

const shop = new Sprite({
	position: {
		x: 610,
		y: 122,
	},
	color: "red",
	image: {
		imageSrc: "./assets/images/shop.png",
		frameRate: 6,
		frameBuffer: 8,
		loop: true,
		autoplay: true
	},
	offset: {
		x: 0,
		y: 0,
	}, 
	scale: 2.8
})

const lifeBarWidth = canvas.width - 100
const lifeBarPlayerWidth = ((canvas.width - 104) / 2)
const lifeBarWidthMiddlePosition = canvas.width - 104 - ((canvas.width - 104) / 2) + 50 - 1.5
const lifeBarEnemyPosition = canvas.width - 104 - ((canvas.width - 104) / 2) + 50 + 1.5

const keys = {
	"KeyW": {
		pressed: false
	},	
	"KeyA": {
		pressed: false
	},	
	"KeyD": {
		pressed: false
	},
	"KeyI": {
		pressed: false
	},	
	"KeyJ": {
		pressed: false
	},	
	"KeyL": {
		pressed: false
	},	
	"Space": {
		pressed: false
	},	
	"Enter": {
		pressed: false
	},
}

const player = new Player({ 
	position: {
		x: -76,
		y: 250,
	},
	color: "red",
	image: {
		imageSrc: "./assets/images/samuraiMack/Idle.png",
		frameRate: 8,
		frameBuffer: 8,
		loop: true,
		autoplay: true
	},
	human: true,
	hitbox: {
		x: 0,
		y: 0,
		width: 60,
		height: 94,
		center: {
			x: 0 + 85 + (60 / 2),
			y: 0 + 75 + (94 / 2),
		}
	},
	offset: {
		x: 170,
		y: 150,
	}, 
	attackBox: {
		x: 0,
		y: 0,
		width: 60,
		height: 30,
	}, 
	direction : true,
	attack1: 6 * 5,
	getHit: 4 * 9,
	dead: 6 * 14,
	animations: {
		"Idle": {
			imageSrc: "./assets/images/samuraiMack/Idle.png",
			frameRate: 8,
			frameBuffer: 8,
			loop: true,
			autoplay: true
		},
		"Attack1": {
			imageSrc: "./assets/images/samuraiMack/Attack1.png",
			frameRate: 6,
			frameBuffer: 5,
			loop: true,
			autoplay: true
		},
		"Run": {
			imageSrc: "./assets/images/samuraiMack/Run.png",
			frameRate: 8,
			frameBuffer: 5,
			loop: true,
			autoplay: true
		},
		"TakeHit": {
			imageSrc: "./assets/images/samuraiMack/TakeHit.png",
			frameRate: 4,
			frameBuffer: 9,
			loop: true,
			autoplay: true
		},
		"Dead": {
			imageSrc: "./assets/images/samuraiMack/Death.png",
			frameRate: 6,
			frameBuffer: 14,
			loop: true,
			autoplay: true
		},
		"Jump": {
			imageSrc: "./assets/images/samuraiMack/Jump.png",
			frameRate: 2,
			frameBuffer: 6,
			loop: true,
			autoplay: true
		},
		"Fall": {
			imageSrc: "./assets/images/samuraiMack/Fall.png",
			frameRate: 2,
			frameBuffer: 6,
			loop: true,
			autoplay: true
		},
	},
	name: "Samouraï Max",
	scale: 2
})

const enemy = new Player({ 
	position: {
		x: 725,
		y: 250
	},
	color: "blue",
	image: {
		imageSrc: "./assets/images/kenji/Idle.png",
		frameRate: 4,
		frameBuffer: 15,
		loop: true,
		autoplay: true
	},
	human: false,
	hitbox: {
		x: 0,
		y: 0,
		width: 40,
		height: 106,
		center: {
			x: 0 + 174 + (40 / 2),
			y: 0 + 150 + (106 / 2),
		}
	},
	offset: {
		x: 174,
		y: 150,
	}, 
	attackBox: {
		x: 0,
		y: 0,
		width: 60,
		height: 30,
	},
	direction : false,
	attack1: 4 * 5,
	getHit: 3 * 12,
	dead: 7 * 14,
	animations: {
		"Idle": {
			imageSrc: "./assets/images/kenji/Idle.png",
			frameRate: 4,
			frameBuffer: 8,
			loop: true,
			autoplay: true
		},
		"Attack1": {
			imageSrc: "./assets/images/kenji/Attack1.png",
			frameRate: 4,
			frameBuffer: 10,
			loop: true,
			autoplay: true
		},
		"Run": {
			imageSrc: "./assets/images/kenji/Run.png",
			frameRate: 8,
			frameBuffer: 5,
			loop: true,
			autoplay: true
		},
		"TakeHit": {
			imageSrc: "./assets/images/kenji/TakeHit.png",
			frameRate: 3,
			frameBuffer: 12,
			loop: true,
			autoplay: true
		},
		"Dead": {
			imageSrc: "./assets/images/kenji/Death.png",
			frameRate: 7,
			frameBuffer: 14,
			loop: true,
			autoplay: true
		},
		"Jump": {
			imageSrc: "./assets/images/kenji/Jump.png",
			frameRate: 2,
			frameBuffer: 6,
			loop: true,
			autoplay: true
		},
		"Fall": {
			imageSrc: "./assets/images/kenji/Fall.png",
			frameRate: 2,
			frameBuffer: 6,
			loop: true,
			autoplay: true
		},
	},
	name: "Super Ninja Raquel",
	scale: 2
})

function animate() {
	gameInterval = window.requestAnimationFrame(animate)
	if (!roundOver && !gameOver) manageTime()
	if (roundOver && !gameOver) newRound()
	
	background.draw()
	
	shop.draw()

	shop.updateFrames()
	player.update()
	enemy.update()

	// drawPlatorms()
	
	drawLifeBar()

	if (!roundOver) detectRoundOver()

	if (roundOver) drawRoundOver()
	if (gameOver) drawGameOver()

}

function drawPlatorms() {
	platforms.forEach(platform => {
		c.fillStyle = "red"
		c.fillRect(platform.position.x, platform.position.y, platform.width, platform.height)
	})
}

function manageTime() {
	gameFrame++

	if (gameFrame % 60 === 0 && timer > 0) {
		timer--
	}

	if (timer <= 10) {
		timerCard.style.color = "red"
	}

	if (timer === 0) {
		player.cannotMove = true
		enemy.cannotMove = true
		player.switchSprite(player.animations.Idle)
		enemy.switchSprite(enemy.animations.Idle)
		roundOver = true
		amountOfRoundFinished++
		if (player.life > enemy.life) {
			resultCard.style.fontSize = "70px"
			winner = player.name
			player.amountRoundWin++
		}
		else if (enemy.life > player.life) {
			resultCard.style.fontSize = "100px"
			winner = enemy.name
			enemy.amountRoundWin++
		}
		else {
			resultCard.style.fontSize = "100px"
			winner = "ROUND DRAW"
		}

		resultCard.style.visibility = "visible"
		detectGameOver()
	}

	timerCard.innerHTML = timer
}

function detectGameOver() {
	console.log('detectGameOver')
	if (amountOfRoundFinished === 3 ||
			player.amountRoundWin === 2 ||
			enemy.amountRoundWin === 2) {
		roundOver = false
		gameOver = true
		player.cannotMove = true
		enemy.cannotMove = true
	}
}

function newRound() {
	inBetweenRoundFrame++

	if (inBetweenRoundFrame === 300) {
		console.log('newRound')
		player.position.x = -76
		player.position.y = 250
		enemy.position.x = 725
		enemy.position.y = 250

		player.velocity.x = 0
		player.velocity.y = 0
		enemy.velocity.x = 0
		enemy.velocity.y = 0

		player.switchSprite(player.animations.Idle)
		enemy.switchSprite(enemy.animations.Idle)

		player.lastDirection = true
		player.direction = true
		enemy.lastDirection = false
		enemy.direction = false

		player.life = player.maxLife
		enemy.life = enemy.maxLife

		player.cannotMove = false
		enemy.cannotMove = false


		player.dead = false
		enemy.dead = false
		player.deadFrame = 0
		enemy.deadFrame = 0

		gameFrame = 0
		timer = 60
		timerCard.style.color = "green"
		roundOver = false
		inBetweenRoundFrame = 0

		resultCard.style.visibility = "hidden"
	}
}

function drawLifeBar() {
	c.fillStyle = "black"
	c.fillRect(50, 25, lifeBarWidth, 25)

	c.fillStyle = "red"
	c.fillRect(52, 27, lifeBarWidth - 4, 21)


	c.fillStyle = "green"
	c.fillRect(52, 27, ((player.life / player.maxLife) * lifeBarPlayerWidth), 21)

	c.fillStyle = "black"
	c.font = "20px arial"
	c.fillText(player.name, 58, 23)

	c.fillStyle = "green"
	c.fillRect(lifeBarEnemyPosition, 27, ((enemy.life / enemy.maxLife) * (lifeBarPlayerWidth + 0.5)), 21)

	c.fillStyle = "black"
	c.fillText(enemy.name, canvas.width - 236, 23)

	c.fillStyle = "black"
	c.fillRect(lifeBarWidthMiddlePosition, 25, 3, 25)
}

function detectRoundOver() {
	if (player.life <= 0 || enemy.life <= 0) {
		roundOver = true
		
		amountOfRoundFinished++

		if (player.life <= 0) {
			winner = enemy.name
			resultCard.style.fontSize = "64px"
			player.switchSprite(player.animations.Dead)
			player.dead = true
			enemy.amountRoundWin++
			player.cannotMove = true
		}
		else if (enemy.life <= 0) {
			winner = player.name
			resultCard.style.fontSize = "70px"
			enemy.switchSprite(enemy.animations.Dead)
			enemy.dead = true
			player.amountRoundWin++
			enemy.cannotMove = true
		}

		resultCard.style.visibility = "visible"
		detectGameOver()
	}
}

function drawRoundOver() {
	let roundText = ""
	if (winner !== "ROUND DRAW") roundText = winner + " WIN ROUND!"
	else roundText = winner + "..."
	resultCard.innerHTML = roundText
}

function drawGameOver() {
	let gameResult = ""
	if (player.amountRoundWin > enemy.amountRoundWin) {
		resultCard.style.fontSize = "64x"
		gameResult = player.name + " WIN!!!"
	}
	else if (enemy.amountRoundWin > player.amountRoundWin) {
		gameResult = enemy.name + " WIN!!!"
		resultCard.style.fontSize = "70px"
	}
	else {
		resultCard.style.fontSize = "60px"
		gameResult = "NOBODY WINS THE MATCH..."
	}
	resultCard.innerHTML = gameResult
}

animate()