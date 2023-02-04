const fetchCharacters = async () => {
	try {
		const res = await fetch("data/characters.json")
		return res.json()
	} catch(error) {
		return {
			error
		}
	}
}

const toggleCharacters = (value) => {
	const inputs = document.querySelectorAll(".characters input")
	inputs.forEach(input => {
		input.checked = value
	})
}

const toggleTraveler = (gender) => {
	gender = gender.substring(9)
	const traveler = {
		male: { name: "aether", twin: "lumine" },
		female: { name: "lumine", twin: "aether"}
	}
	const name = traveler[gender].name,
		  twin = traveler[gender].twin

	if (!document.querySelector(`#${name}`)) {
		const container = document.querySelector(`#${twin}`).parentElement
		container.innerHTML = `
			<input type="checkbox" id="${name}">
			<label for="${name}">
				<img src="assets/img/side/${name}.png">
			</label>
		`
		localStorage.setItem("traveler", name)
	}
}

const getOptions = (nodelist, value) => {
	return [...nodelist].filter(node =>
		node.getAttribute("data-type") == value
	).map(node =>
		node.id
	)
}

const filterTraveler = (char, filter, key) => {
	if (key === "element") {
		const elements = ["anemo", "dendro", "electro", "geo"]
		return elements.some(val => filter.includes(val))

	} else if (key === "gender") {
		const traveler = localStorage.getItem("traveler") ?? "aether"
		const genders = { aether: "male", lumine: "female" }
		return filter.includes(genders[traveler])

	} else {
		return filter.includes(char[key])
	}
}

const filterCharacters = (characters, filter, key) => {
	return characters.filter(char =>
		char.name == "traveler"
		? filterTraveler(char, filter, key)
		:filter.includes(char[key])
	)
}

const findCharacters = (characters, options) => {
	let match = characters
	const elements = getOptions(options, "element"),
		  weapons = getOptions(options, "weapon"),
		  regions = getOptions(options, "region"),
		  rarities = getOptions(options, "stars"),
		  genders = getOptions(options, "gender")

	if (elements.length > 0) {
		match = filterCharacters(match, elements, "element")
	}
	if (weapons.length > 0){
		match = filterCharacters(match, weapons, "weapon")
	}
	if (regions.length > 0) {
		match = filterCharacters(match, regions, "region")
	}
	if (rarities.length > 0) {
		match = filterCharacters(match, rarities, "stars")
	}
	if (genders.length > 0) {
		match = filterCharacters(match, genders, "gender")
	}

	return match
}

const removeCharacters = () => {
	document.querySelector(".characters").innerHTML = ""
}

const addCharacters = (characters, traveler) => {
	const container = document.querySelector(".characters")
	characters.forEach(character => {
		const name = character.name == "traveler" ? traveler : character.name
		container.innerHTML += `
			<section>
				<input type="checkbox" id="${name}">
				<label for="${name}">
					<img src="assets/img/side/${name}.png">
				</label>
			</section>
		`
	});
}

const showEmptyResult = () => {
	document.querySelector(".characters").innerHTML = `
		<p id="empty-result">No results.</p>
	`
}

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

const getSelectedCharacters = () => {
	const selection = document.querySelectorAll(".characters input:checked")
	return [...selection].map(char => char.id)
}

const addCharacterCards = (characters, traveler) => {
	const carousel = document.querySelector(".carousel")
	characters.forEach((character, order) => {
		const name = character == "traveler" ? traveler : character
		carousel.innerHTML += `
			<section class="card">
				<img src="assets/img/card/${name}.png">
			</section>
		`
	});
}

let radius
let theta
let selectedIndex = 0

function randomInteger(min, max) {
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

const moveCar = () => {
	selectedIndex++
	const angle = theta * selectedIndex * -1
	const carousel = document.querySelector(".carousel")
	carousel.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`
}

const carouselTest = () => {
	const traveler = localStorage.getItem("traveler") ?? "aether",
		  selection = shuffleArray(getSelectedCharacters())
		  addCharacterCards(selection, traveler)

	const carousel = document.querySelector(".carousel")
	const cards = carousel.querySelectorAll(".card")
	const cardCount = cards.length
	const carouselWidth = carousel.offsetWidth
	radius = Math.round((carouselWidth / 2) / Math.tan(Math.PI / cardCount))
	theta = 360 / cardCount
	// carousel.style.opacity = "1"

	removeCharacters()

	cards.forEach((card, index) => {
		const cardAngle = theta * index
		card.style.transform = `rotateY(${cardAngle}deg) translateZ(${radius}px)`
	})

	selectedIndex++
	const angle = theta * selectedIndex * -1
	carousel.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`
}

window.addEventListener("DOMContentLoaded", async () => {
	const characters = await fetchCharacters(),
		  traveler = localStorage.getItem("traveler") ?? "aether"
	addCharacters(characters, traveler)

	const genders = document.querySelectorAll("input[name='traveler']")
	genders.forEach(gender => {
		gender.addEventListener("click", () => {
			toggleTraveler(gender.id)
		})
	})

	const options = document.querySelector("#filter-toggle")
	options.addEventListener("click", () => {
		const filters = document.querySelector(".filter-options")
		const display = filters.style.display

		if (display === "") {
			filters.style.display = "flex"
		}
		if (display === "flex") {
			filters.style.display = ""
		}
	})

	const filter = document.querySelector("#filter-button")
	filter.addEventListener("click", () => {
		const options = document.querySelectorAll(".filter-options input:checked")
		if (options.length > 0) {
			const results = findCharacters(characters, options)

			if (results.length > 0) {
				removeCharacters()
				addCharacters(results,traveler)
			} else {
				showEmptyResult()
			}
		} else {
			removeCharacters()
			addCharacters(characters, traveler)
		}
	})

	const reset = document.querySelector("#reset-button")
	reset.addEventListener("click", () => {
		const checked = document.querySelectorAll(".filter-options input:checked")
		if (checked.length > 0) {
			toggleCharacters(false)
			removeCharacters()
			addCharacters(characters, traveler)
		}
	})
})