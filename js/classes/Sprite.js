class Sprite {
	constructor({ position, color = "red", image, offset = { x: 0, y: 0 }, scale = 1 }) {
		this.position = position
		this.offset = offset
		this.color = color

		this.image = new Image()
		this.image.onload = () => {
			this.loaded = true
			this.width = (this.image.width / this.frameRate) * this.scale
			this.height = this.image.height * this.scale
		}
		this.image.src = image.imageSrc
		this.frameRate = image.frameRate
		this.frameBuffer = image.frameBuffer
		this.loop = image.loop
		this.autoplay = image.autoplay

		this.currentFrame = 0
		this.frameElapsed = 0
		this.scale = scale

		this.loaded = false
	}

	draw() {
		// c.fillStyle = "rgba(30, 09, 200, 0.4"
		// c.fillRect(this.position.x, this.position.y, this.width, this.height)

		const crop = {
			x: this.currentFrame * (this.width / this.scale),
			y: 0,
			width: this.width / this.scale,
			height: this.height / this.scale
		}

		if (this.loaded) c.drawImage(
			this.image, 
			crop.x,
			crop.y,
			crop.width,
			crop.height,
			this.position.x, 
			this.position.y,
			this.width, 
			this.height)
	}

	updateFrames() {
		this.frameElapsed++

		if(this.frameBuffer === this.frameElapsed) {
			this.frameElapsed = 0
			this.currentFrame++
			if (this.currentFrame > this.frameRate - 1) this.currentFrame = 0
		}
	}
}