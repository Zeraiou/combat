class Player extends Sprite {
	constructor({ position, color, image, human, hitbox, offset, attackBox, direction, attack1, getHit, dead, animations, name }) {
		super({ position, color, image, offset })
		this.name = name

		this.velocity = {
			x: 0,
			y: 0,
		}

		this.hitbox = hitbox
		this.attackBox = attackBox
		this.lastHitbox = hitbox

		this.gravity = 0.5
		this.stopMotion = 0.5
		this.jumpHeight = -13
		this.movementSpeed = 5
		this.onGround = false
		this.human = human
		this.direction = direction
		this.lastDirection = direction

		this.attack1Active = false
		this.attack1Frame = 0
		this.maxAttack1Frame = attack1 
		this.damage = 10

		this.getHit = false
		this.getHitFrame = 0
		this.getHitMaxFrame = getHit

		this.dead = false
		this.deadFrame = 0
		this.deadMaxFrame = dead 

		this.animations = animations
		this.currentAnimation = this.animations.Idle

		this.life = 100
		this.maxLife = 100

		this.amountRoundWin = 0
		
		this.updateHitbox()
		this.updateAttackBox()
	}

	switchSprite(animation) {
		if (this.currentAnimation !== animation) {
			this.currentAnimation = animation
			this.image.src = animation.imageSrc
			this.frameRate = animation.frameRate
			this.frameBuffer = animation.frameBuffer
			this.loop = animation.loop
			this.autoplay = animation.autoplay

			this.frameElapsed = 0
			this.currentFrame = 0
		}	
	} 

	updateHitbox() {
		this.lastHitbox = this.hitbox
		this.hitbox = {
			x: this.position.x + this.offset.x,
			y: this.position.y + this.offset.y,
			width: this.hitbox.width,
			height: this.hitbox.height,
		}
	}

	updateAttackBox(){
		let positionX = 0
		let positionY = 0
		let width = 0
		let height = 0

		if (this.human) {
			positionX = this.hitbox.x
			positionY = this.hitbox.y - 22
			width = this.hitbox.width + 75
			height = this.hitbox.height + 22
		}

		else {
			positionX = this.hitbox.x - 70
			positionY = this.hitbox.y - 8
			width = this.hitbox.width + 70
			height = this.hitbox.height + 8
		}

		this.attackBox = {
			x: positionX,
			y: positionY,
			width: width,
			height: height,
		}
	}

	update() {
		if (!this.dead) super.updateFrames()
		this.updateHitbox()
		this.updateAttackBox()

		// this.drawHitbox() 
		this.draw()
		this.drawRoundWinned()

		this.actionSequence()

		this.boundaryCollision()
	}

	actionSequence() {
		this.applyGravity()
		if (!this.cannotMove && this.onGround && !(this.velocity.y > 1)) this.jump()
		
		this.applyStopMotion()
		if (!this.cannotMove) this.moveHorizontaly()


		if (!this.cannotMove) this.activateAttack()
		if (this.attack1Active) {
			this.updateAttack()
		}
		if (this.attack1Active) {
			if (this.human) {
				if (this.attack1Frame >= 20) {
					//this.drawAttackBox()
					if (this.detectCollisionAttack1(player.attackBox, enemy.hitbox) &&
							!enemy.getHit) {
						enemy.velocity.x = 15
						enemy.lastDirection = true
						enemy.velocity.y = -16
						enemy.getHit = true
						enemy.cannotMove = true
						enemy.life -= this.damage
						enemy.switchSprite(enemy.animations.TakeHit)
					}
				}
			}
			else {
				if (this.attack1Frame >= 10 &&
						this.attack1Frame <= 25) {
					//this.drawAttackBox()
					if (this.detectCollisionAttack1(enemy.attackBox, player.hitbox) &&
							!player.getHit) {
						player.velocity.x = -15
						player.lastDirection = false
						player.velocity.y = -16
						player.getHit = true
						player.cannotMove = true
						player.life -= this.damage
						player.switchSprite(player.animations.TakeHit)
					}
				}
			}
		}
		if (this.getHit && !roundOver && !gameOver) this.updateGetHit()
		if (this.dead) this.updateDead()
	}

	boundaryCollision() {
		this.checkPlatformsCollision()
		this.checkGroundCollision()
		this.checkLeftWallCollision()
		this.checkRightWallCollision()
	}

	activateAttack() {
		if (this.human) {
			if (keys.Space.pressed && !this.attack1Active) {
				this.attack1Active = true
				this.switchSprite(this.animations.Attack1)
			}
		}
		else {
			if (keys.Enter.pressed && !this.attack1Active) {
				this.attack1Active = true
				this.switchSprite(this.animations.Attack1)
			}
		}
	}

	updateAttack() {
		this.attack1Frame++

		if (this.attack1Frame === this.maxAttack1Frame - 1) {
			this.attack1Frame = 0
			this.attack1Active = false
			this.switchSprite(this.animations.Idle)
		}
	}

	updateGetHit() {
		this.getHitFrame++

		if (this.getHitFrame === this.getHitMaxFrame - 1) {
			this.getHitFrame = 0
			this.getHit = false
			this.cannotMove = false
			this.switchSprite(this.animations.Idle)
		}
	}

	updateDead() {
		this.deadFrame++

		if (this.deadFrame >= this.deadMaxFrame - 1) {
			this.currentFrame = this.frameRate - 1
		}
		else super.updateFrames()
	}

	drawHitbox() {
		c.fillStyle = "rgba(200, 30, 50, 0.6)"
		c.fillRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height)
	}

	drawAttackBox() {
		c.fillStyle = "rgba(20, 30, 244, 0.6)"
		c.fillRect(this.attackBox.x, this.attackBox.y, this.attackBox.width, this.attackBox.height)
	}

	applyGravity() {
		this.velocity.y += this.gravity
		this.position.y += this.velocity.y
	}

	jump() {
		if (keys.KeyW.pressed && this.human) {
			this.velocity.y = this.jumpHeight
			this.position.y += this.velocity.y
			this.onGround = false
		}

		if (keys.KeyI.pressed && !this.human) {
			this.velocity.y = this.jumpHeight
			this.position.y += this.velocity.y
			this.onGround = false
		}
	}

	applyStopMotion() {
		if (this.lastDirection) {
			if (this.velocity.x > 0) this.velocity.x -= this.stopMotion
			else if (this.velocity < 0) this.velocity.x = 0
		}
		else {
			if (this.velocity.x < 0) this.velocity.x += this.stopMotion
			else if (this.velocity > 0) this.velocity.x = 0
		}

		this.position.x += this.velocity.x
	}

	moveHorizontaly() {
		if (this.human) {
			if (keys.KeyA.pressed && this.velocity.x >= -this.movementSpeed) {
				if(!this.attack1Active) this.switchSprite(this.animations.Run)
				this.velocity.x = -this.movementSpeed
				this.lastDirection = false
			}
			else if (keys.KeyD.pressed && this.velocity.x <= this.movementSpeed) {
				if(!this.attack1Active) this.switchSprite(this.animations.Run)
				this.velocity.x = this.movementSpeed
				this.lastDirection = true
			}
			else if (!this.attack1Active) this.switchSprite(this.animations.Idle)
		}
		else {
			if (keys.KeyJ.pressed && this.velocity.x >= -this.movementSpeed) {
				if(!this.attack1Active) this.switchSprite(this.animations.Run)
				this.velocity.x = -this.movementSpeed
				this.lastDirection = false
			}
			else if (keys.KeyL.pressed && this.velocity.x >= -this.movementSpeed) {
				if(!this.attack1Active) this.switchSprite(this.animations.Run)
				this.velocity.x = this.movementSpeed
				this.lastDirection = true
			}
			else if(!this.attack1Active) this.switchSprite(this.animations.Idle)
		}
	}

	checkPlatformsCollision() {
		platforms.forEach(platform => {
			if (this.lastHitbox.y + this.lastHitbox.height < platform.position.y  ) {
				if (this.hitbox.y + this.hitbox.height >= platform.position.y &&
						this.hitbox.x >= platform.position.x &&
						this.hitbox.x + this.hitbox.width <= platform.position.x + platform.width) {
					this.velocity.y = 0
					this.position.y = platform.position.y - this.hitbox.height - this.offset.y - 0.01
					this.onGround = true
					this.updateHitbox()
				}
			}
		})
	}

	checkGroundCollision() {
		if (this.hitbox.y + this.hitbox.height > 479 ) {
			const y = this.hitbox.y - this.position.y
			this.position.y = 479 - y - this.hitbox.height
			this.velocity.y = 0
			this.onGround = true
			this.updateHitbox()
		}
	}

	checkCollisionWithOtherPlayer(player1, player2) {
		if (player1.hitbox.x + player1.hitbox.width >= player2.hitbox.x - player1.movementSpeed &&
				player1.hitbox.y + player.hitbox.height > player2.hitbox.y && 
				player1.hitbox.x < player2.hitbox.x + player2.hitbox.width) {
					player1.position.x = player2.hitbox.x - player1.hitbox.width - player1.offset.x - 0.01 
					player1.velocity.x = 0
					this.updateHitbox()
					this.updateAttackBox()
		}
	}

	checkLeftWallCollision() {
		if (this.hitbox.x <= 1) {
			this.velocity.x = 0
			this.position.x = 1 - this.offset.x + 0.01
			this.updateHitbox()
			this.updateAttackBox()
		}
	}

	checkRightWallCollision() {
		if (this.hitbox.x + this.hitbox.width >= canvas.width - 1) {
			this.velocity.x = 0
			this.position.x = canvas.width - 1 - this.offset.x - this.hitbox.width - 0.01
			this.updateHitbox()
			this.updateAttackBox()
		}
	}

	detectCollisionAttack1(box, enemy) {
		return (
			box.x + box.width >= enemy.x &&
			box.x <= enemy.x + enemy.width &&
			box.y <= enemy.y + enemy.height &&
			box.y + box.height >= enemy.y
		)
	}

	drawRoundWinned() {
		if (this.human) {
			c.beginPath()
			c.fillStyle = "black"
			c.arc(70, 65, 10, 0, fullRadiant)
			c.fill()
			c.closePath()

			c.beginPath()
			if (player.amountRoundWin > 0) c.fillStyle = "green"
			else c.fillStyle = "white"
			c.arc(70, 65, 8, 0, fullRadiant)
			c.fill()
			c.closePath()

			c.beginPath()
			c.fillStyle = "black"
			c.arc(93, 65, 10, 0, fullRadiant)
			c.fill()
			c.closePath()

			c.beginPath()
			if (player.amountRoundWin > 1) c.fillStyle = "green"
			else c.fillStyle = "white"
			c.arc(93, 65, 8, 0, fullRadiant)
			c.fill()
			c.closePath()
		}

		if (!this.human) {
			c.beginPath()
			c.fillStyle = "black"
			c.arc(930, 65, 10, 0, fullRadiant)
			c.fill()
			c.closePath()

			c.beginPath()
			if (enemy.amountRoundWin > 0) c.fillStyle = "green"
			else c.fillStyle = "white"
			c.arc(930, 65, 8, 0, fullRadiant)
			c.fill()
			c.closePath()

			c.beginPath()
			c.fillStyle = "black"
			c.arc(953, 65, 10, 0, fullRadiant)
			c.fill()
			c.closePath()

			c.beginPath()
			if (enemy.amountRoundWin > 1) c.fillStyle = "green"
			else c.fillStyle = "white"
			c.arc(953, 65, 8, 0, fullRadiant)
			c.fill()
			c.closePath()
		}
	}
}