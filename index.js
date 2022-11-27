const canvas = document.querySelector("canvas")

const c = canvas.getContext("2d")
canvas.width = 1024
canvas.height = 576

let gameInterval = null
let gameOver = false
let winner = ""

const background = new Image()

background.src = "./assets/images/background.png"

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
		x: 100,
		y: 375
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
		width: 30,
		height: 47,
	},
	offset: {
		x: 85,
		y: 75,
	}, 
	attackBox: {
		x: 0,
		y: 0,
		width: 30,
		height: 15,
	}, 
	direction : true,
	attack1: 6 * 5,
	getHit: 4 * 9,
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
	},
	name: "Samouraï Max"
})

const enemy = new Player({ 
	position: {
		x: 400,
		y: 375
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
		width: 20,
		height: 53,
	},
	offset: {
		x: 87,
		y: 75,
	}, 
	attackBox: {
		x: 0,
		y: 0,
		width: 30,
		height: 15,
	},
	direction : false,
	attack1: 4 * 5,
	getHit: 3 * 12,
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
	},
	name: "Kenji"
})

function animate() {
	gameInterval = window.requestAnimationFrame(animate)

	c.drawImage(background, 0, 0)
	player.update()
	enemy.update()

	drawLifeBar()
	detectGameOver()
	if (gameOver) drawGameOver()
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
	c.fillText(enemy.name, canvas.width - 108, 23)

	c.fillStyle = "black"
	c.fillRect(lifeBarWidthMiddlePosition, 25, 3, 25)
}

function detectGameOver() {
	if (player.life <= 0) {
		gameOver = true
		winner = enemy.name
		window.cancelAnimationFrame(gameInterval)
	}
	else if (enemy.life <= 0) {
		gameOver = true
		winner = player.name
		window.cancelAnimationFrame(gameInterval)
	}
}

function drawGameOver() {
	c.fillStyle = "rgba(0, 0, 0, 0.2)"
	c.fillRect(0, 0, canvas.width, canvas.height)

	c.fillStyle = "white"
	c.font = "50px arial"
	c.fillText(winner + " WIN!!!", 300, canvas.height / 2)
}

animate()