window.addEventListener('keydown', (event) => {
	switch(event.code) {
		case "KeyW": 
			keys.KeyW.pressed = true
			break

		case "KeyD":
			keys.KeyD.pressed = true
			break

		case "KeyA": 
			keys.KeyA.pressed = true
			break

		case "KeyI": 
			keys.KeyI.pressed = true
			break

		case "KeyJ":
			keys.KeyJ.pressed = true
			break

		case "KeyL": 
			keys.KeyL.pressed = true
			break

		case "Space": 
			keys.Space.pressed = true
			break

		case "Enter": 
			keys.Enter.pressed = true
			break

		default: break
	}
})

window.addEventListener('keyup', (event) => {
	switch(event.code) {
		case "KeyW": 
			keys.KeyW.pressed = false
			break

		case "KeyD":
			keys.KeyD.pressed = false
			break

		case "KeyA": 
			keys.KeyA.pressed = false
			break

		case "KeyI": 
			keys.KeyI.pressed = false
			break

		case "KeyJ":
			keys.KeyJ.pressed = false
			break

		case "KeyL": 
			keys.KeyL.pressed = false
			break

		case "Space": 
			keys.Space.pressed = false
			break

		case "Enter": 
			keys.Enter.pressed = false
			break

		default: break
	}
})