
export interface GameObject {
  id: string
  type: string // Tipo de categoría
  name: string
  asset: string // Emoji o representación visual
}

export interface GameCategory {
  id: string;
  name: string;
  color: string;
  countOptions: number[]; // e.g. [3, 4, 5], where 4 is the correct answer
}

export interface GameLevel {
  level: number
  objects: GameObject[]
  categories: GameCategory[];
}

// Esta es una plantilla. El juego generará un subconjunto aleatorio de estos objetos cada vez.
export const classifyAndCountGameData: GameLevel[] = [
  // NIVEL 1: Animales y Juguetes (4 animales, 4 juguetes)
  {
    level: 1,
    objects: [
      { id: "dog", type: "animal", name: "Perro", asset: "🐕" },
      { id: "cat", type: "animal", name: "Gato", asset: "🐱" },
      { id: "rabbit", type: "animal", name: "Conejo", asset: "🐰" },
      { id: "bird", type: "animal", name: "Pájaro", asset: "🐦" },
      { id: "lion-1", type: "animal", name: "León", asset: "🦁" },
      { id: "ball", type: "juguete", name: "Pelota", asset: "⚽" },
      { id: "car", type: "juguete", name: "Carro", asset: "🚗" },
      { id: "doll", type: "juguete", name: "Muñeca", asset: "🪆" },
      { id: "blocks", type: "juguete", name: "Bloques", asset: "🧱" },
      { id: "teddy-1", type: "juguete", name: "Osito", asset: "🧸" },
    ],
    categories: [
      { id: "animal", name: "Animales", color: "bg-green-200 border-green-400", countOptions: [2, 3, 4, 5] },
      { id: "juguete", name: "Juguetes", color: "bg-blue-200 border-blue-400", countOptions: [2, 3, 4, 5] },
    ],
  },

  // NIVEL 2: Animales, Juguetes y Frutas (4 de cada uno)
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
       { id: "robot-2", type: "juguete", name: "Robot", asset: "🤖" },
      { id: "apple", type: "fruta", name: "Manzana", asset: "🍎" },
      { id: "banana", type: "fruta", name: "Plátano", asset: "🍌" },
      { id: "orange", type: "fruta", name: "Naranja", asset: "🍊" },
      { id: "grapes", type: "fruta", name: "Uvas", asset: "🍇" },
    ],
    categories: [
      { id: "animal", name: "Animales", color: "bg-green-200 border-green-400", countOptions: [3, 4, 5] },
      { id: "juguete", name: "Juguetes", color: "bg-blue-200 border-blue-400", countOptions: [4, 5, 6] },
      { id: "fruta", name: "Frutas", color: "bg-red-200 border-red-400", countOptions: [2, 3, 4] },
    ],
  },

  // NIVEL 3: Animales, Juguetes, Frutas y Vehículos (4 de cada uno)
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
       { id: "teddy-3", type: "juguete", name: "Osito", asset: "🧸" },
      { id: "pineapple", type: "fruta", name: "Piña", asset: "🍍" },
      { id: "watermelon", type: "fruta", name: "Sandía", asset: "🍉" },
      { id: "peach", type: "fruta", name: "Durazno", asset: "🍑" },
       { id: "apple-3", type: "fruta", name: "Manzana", asset: "🍎" },
      { id: "bus", type: "vehiculo", name: "Autobús", asset: "🚌" },
      { id: "airplane", type: "vehiculo", name: "Avión", asset: "✈️" },
      { id: "boat", type: "vehiculo", name: "Barco", asset: "🚢" },
      { id: "bicycle", type: "vehiculo", name: "Bicicleta", asset: "🚲" },
    ],
    categories: [
      { id: "animal", name: "Animales", color: "bg-green-200 border-green-400", countOptions: [3, 4, 5] },
      { id: "juguete", name: "Juguetes", color: "bg-blue-200 border-blue-400", countOptions: [2, 3, 4] },
      { id: "fruta", name: "Frutas", color: "bg-red-200 border-red-400", countOptions: [4, 5, 6] },
      { id: "vehiculo", name: "Vehículos", color: "bg-purple-200 border-purple-400", countOptions: [3, 4, 2] },
    ],
  },
]
