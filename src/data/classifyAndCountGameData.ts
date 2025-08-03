
export interface GameObject {
  id: string
  type: string // Tipo de categoría
  name: string
  asset: string // Emoji o representación visual
}

export interface GameLevel {
  level: number
  objects: GameObject[]
  categories: Array<{
    id: string
    name: string
    color: string // Color de la categoría para mejor UX
  }>
}

export const classifyAndCountGameData: GameLevel[] = [
  // NIVEL 1: Animales y Juguetes (8 objetos, 2 categorías)
  {
    level: 1,
    objects: [
      { id: "dog", type: "animal", name: "Perro", asset: "🐕" },
      { id: "cat", type: "animal", name: "Gato", asset: "🐱" },
      { id: "rabbit", type: "animal", name: "Conejo", asset: "🐰" },
      { id: "bird", type: "animal", name: "Pájaro", asset: "🐦" },
      { id: "ball", type: "juguete", name: "Pelota", asset: "⚽" },
      { id: "car", type: "juguete", name: "Carro", asset: "🚗" },
      { id: "doll", type: "juguete", name: "Muñeca", asset: "🪆" },
      { id: "blocks", type: "juguete", name: "Bloques", asset: "🧱" },
    ],
    categories: [
      { id: "animal", name: "Animales", color: "bg-green-200 border-green-400" },
      { id: "juguete", name: "Juguetes", color: "bg-blue-200 border-blue-400" },
    ],
  },

  // NIVEL 2: Animales, Juguetes y Frutas (12 objetos, 3 categorías)
  {
    level: 2,
    objects: [
      { id: "lion", type: "animal", name: "León", asset: "🦁" },
      { id: "elephant", type: "animal", name: "Elefante", asset: "🐘" },
      { id: "fish", type: "animal", name: "Pez", asset: "🐟" },
      { id: "frog", type: "animal", name: "Rana", asset: "🐸" },
      { id: "teddy", type: "juguete", name: "Osito", asset: "🧸" },
      { id: "puzzle", type: "juguete", name: "Rompecabezas", asset: "🧩" },
      { id: "kite", type: "juguete", name: "Cometa", asset: "🪁" },
      { id: "apple", type: "fruta", name: "Manzana", asset: "🍎" },
      { id: "banana", type: "fruta", name: "Plátano", asset: "🍌" },
      { id: "orange", type: "fruta", name: "Naranja", asset: "🍊" },
      { id: "grapes", type: "fruta", name: "Uvas", asset: "🍇" },
      { id: "strawberry", type: "fruta", name: "Fresa", asset: "🍓" },
    ],
    categories: [
      { id: "animal", name: "Animales", color: "bg-green-200 border-green-400" },
      { id: "juguete", name: "Juguetes", color: "bg-blue-200 border-blue-400" },
      { id: "fruta", name: "Frutas", color: "bg-red-200 border-red-400" },
    ],
  },

  // NIVEL 3: Animales, Juguetes, Frutas y Vehículos (16 objetos, 4 categorías)
  {
    level: 3,
    objects: [
      { id: "tiger", type: "animal", name: "Tigre", asset: "🐅" },
      { id: "monkey", type: "animal", name: "Mono", asset: "🐵" },
      { id: "bear", type: "animal", name: "Oso", asset: "🐻" },
      { id: "penguin", type: "animal", name: "Pingüino", asset: "🐧" },
      { id: "robot", type: "juguete", name: "Robot", asset: "🤖" },
      { id: "yoyo", type: "juguete", name: "Yoyo", asset: "🪀" },
      { id: "dice", type: "juguete", name: "Dado", asset: "🎲" },
      { id: "pineapple", type: "fruta", name: "Piña", asset: "🍍" },
      { id: "watermelon", type: "fruta", name: "Sandía", asset: "🍉" },
      { id: "peach", type: "fruta", name: "Durazno", asset: "🍑" },
      { id: "bus", type: "vehiculo", name: "Autobús", asset: "🚌" },
      { id: "airplane", type: "vehiculo", name: "Avión", asset: "✈️" },
      { id: "boat", type: "vehiculo", name: "Barco", asset: "🚢" },
      { id: "bicycle", type: "vehiculo", name: "Bicicleta", asset: "🚲" },
      { id: "train", type: "vehiculo", name: "Tren", asset: "🚂" },
      { id: "rocket", type: "vehiculo", name: "Cohete", asset: "🚀" },
    ],
    categories: [
      { id: "animal", name: "Animales", color: "bg-green-200 border-green-400" },
      { id: "juguete", name: "Juguetes", color: "bg-blue-200 border-blue-400" },
      { id: "fruta", name: "Frutas", color: "bg-red-200 border-red-400" },
      { id: "vehiculo", name: "Vehículos", color: "bg-purple-200 border-purple-400" },
    ],
  },
]

    