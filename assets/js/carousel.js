const carousel = document.querySelector(".carousel"),
	  carouselWidth = carousel.offsetWidth

const randomInteger = (min, max) => {
	let rand = min + Math.random() * (max + 1 - min)
	return Math.floor(rand)
}

const move = (time) => {
	const cardCount = carousel.querySelectorAll(".card").length,
		  radius = Math.round((carouselWidth / 2) / Math.tan(Math.PI / cardCount)),
		  theta = 360 / cardCount

	const winner = theta * randomInteger(1, cardCount - 1) * - 1,
		  angle = winner * time

	carousel.style.transition = `transform ${time}ms ease-out`
	carousel.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`
}

const create = () => {
	const cards = carousel.querySelectorAll(".card"),
		  cardCount = cards.length,
		  radius = Math.round((carouselWidth / 2) / Math.tan(Math.PI / cardCount)),
		  theta = 360 / cardCount

	cards.forEach((card, index) => {
		const cardAngle = theta * index
		card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`
	})

	move(1000)
}

export { create, move }