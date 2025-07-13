// Definir los palos y valores de las cartas
const palos = [
  { nombre: "corazones", color: "red", symbol: "♥" },
  { nombre: "diamantes", color: "red", symbol: "♦" },
  { nombre: "tréboles", color: "black", symbol: "♣" },
  { nombre: "picas", color: "black", symbol: "♠" },
]

const valores = [
  { nombre: "As", valor: "A" },
  { nombre: "2", valor: "2" },
  { nombre: "3", valor: "3" },
  { nombre: "4", valor: "4" },
  { nombre: "5", valor: "5" },
  { nombre: "6", valor: "6" },
  { nombre: "7", valor: "7" },
  { nombre: "8", valor: "8" },
  { nombre: "9", valor: "9" },
  { nombre: "10", valor: "10" },
  { nombre: "Jota", valor: "J" },
  { nombre: "Reina", valor: "Q" },
  { nombre: "Rey", valor: "K" },
]

// Generar todas las cartas
let todasLasCartas = []

function generarCartas() {
  todasLasCartas = []

  palos.forEach((palo) => {
    valores.forEach((valor) => {
      const carta = {
        nombre: `${valor.nombre} de ${palo.nombre}`,
        palo: palo.nombre,
        valor: valor.valor,
        color: palo.color,
        symbol: palo.symbol,
        imagenFrente: generarImagenCarta(valor.valor, palo.symbol, palo.color),
        imagenReverso: "/images/bicycle-back-red.png",
      }
      todasLasCartas.push(carta)
    })
  })
}

// Generar imagen SVG para la carta (simulando cartas reales)
function generarImagenCarta(valor, symbol, color) {
  const colorHex = color === "red" ? "#dc2626" : "#000000"

  const svg = `
        <svg width="200" height="280" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="280" fill="white" stroke="#000" stroke-width="2" rx="10"/>
            <text x="20" y="40" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${colorHex}">${valor}</text>
            <text x="20" y="65" font-family="Arial, sans-serif" font-size="20" fill="${colorHex}">${symbol}</text>
            <text x="180" y="260" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${colorHex}" transform="rotate(180 180 260)">${valor}</text>
            <text x="180" y="235" font-family="Arial, sans-serif" font-size="20" fill="${colorHex}" transform="rotate(180 180 235)">${symbol}</text>
            <text x="100" y="150" font-family="Arial, sans-serif" font-size="48" fill="${colorHex}" text-anchor="middle">${symbol}</text>
        </svg>
    `

  return "data:image/svg+xml;base64," + btoa(svg)
}

// Variables globales
let cartasFiltradas = []
let cartaActualModal = null
let cartaVolteada = false

// Elementos del DOM
const searchInput = document.getElementById("searchInput")
const cardsContainer = document.getElementById("cardsContainer")
const modal = document.getElementById("cardModal")
const modalCardName = document.getElementById("modalCardName")
const modalCardImage = document.getElementById("modalCardImage")
const closeModalBtn = document.getElementById("closeModal")

// Inicializar la aplicación
function inicializar() {
  generarCartas()
  cartasFiltradas = [...todasLasCartas]
  mostrarCartas()
  configurarEventos()
}

// Mostrar cartas en la grilla
function mostrarCartas() {
  cardsContainer.innerHTML = ""

  cartasFiltradas.forEach((carta, index) => {
    const cardElement = document.createElement("div")
    cardElement.className = "card-item"
    cardElement.innerHTML = `
            <img class="card-image" src="${carta.imagenFrente}" alt="${carta.nombre}">
            <div class="card-name">${carta.nombre}</div>
        `

    cardElement.addEventListener("click", () => abrirModal(carta))
    cardsContainer.appendChild(cardElement)
  })
}

// Filtrar cartas por búsqueda
function filtrarCartas() {
  const textoBusqueda = searchInput.value.toLowerCase().trim()

  if (textoBusqueda === "") {
    cartasFiltradas = [...todasLasCartas]
  } else {
    cartasFiltradas = todasLasCartas.filter((carta) => carta.nombre.toLowerCase().includes(textoBusqueda))
  }

  mostrarCartas()
}

// Abrir modal con la carta seleccionada
function abrirModal(carta) {
  cartaActualModal = carta
  cartaVolteada = false

  modalCardName.textContent = carta.nombre
  modalCardImage.src = carta.imagenReverso
  modalCardImage.classList.remove("flipped")

  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

// Cerrar modal
function cerrarModal() {
  modal.style.display = "none"
  document.body.style.overflow = "auto"
  cartaActualModal = null
  cartaVolteada = false
}

// Voltear carta en el modal
function voltearCarta() {
  if (!cartaActualModal) return

  cartaVolteada = !cartaVolteada

  if (cartaVolteada) {
    modalCardImage.src = cartaActualModal.imagenFrente
    modalCardImage.classList.add("flipped")
  } else {
    modalCardImage.src = cartaActualModal.imagenReverso
    modalCardImage.classList.remove("flipped")
  }
}

// Configurar todos los eventos
function configurarEventos() {
  // Búsqueda en tiempo real
  searchInput.addEventListener("input", filtrarCartas)

  // Cerrar modal
  closeModalBtn.addEventListener("click", cerrarModal)

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      cerrarModal()
    }
  })

  // Voltear carta al hacer clic en la imagen
  modalCardImage.addEventListener("click", voltearCarta)

  // Cerrar modal con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      cerrarModal()
    }
  })
}

// Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", inicializar)
