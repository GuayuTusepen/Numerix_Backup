
// Mock data for the counting game
export const gameData = {
    levels: [
      {
        id: 1,
        title: "Nivel 1",
        description: "Números fáciles para empezar",
        range: "1-3",
        questions: [
          {
            question: "¿Cuántas manzanas ves?",
            fruits: [
              { type: "apple", emoji: "🍎", position: { x: 30, y: 40 } }
            ],
            options: [1, 2, 3],
            correctAnswer: 1
          },
          {
            question: "¿Cuántas naranjas ves?",
            fruits: [
              { type: "orange", emoji: "🍊", position: { x: 20, y: 30 } },
              { type: "orange", emoji: "🍊", position: { x: 60, y: 50 } }
            ],
            options: [1, 2, 3],
            correctAnswer: 2
          },
          {
            question: "¿Cuántos plátanos ves?",
            fruits: [
              { type: "banana", emoji: "🍌", position: { x: 15, y: 25 } },
              { type: "banana", emoji: "🍌", position: { x: 45, y: 45 } },
              { type: "banana", emoji: "🍌", position: { x: 75, y: 35 } }
            ],
            options: [1, 2, 3],
            correctAnswer: 3
          },
          {
            question: "¿Cuántas fresas ves?",
            fruits: [
              { type: "strawberry", emoji: "🍓", position: { x: 40, y: 30 } },
              { type: "strawberry", emoji: "🍓", position: { x: 65, y: 55 } }
            ],
            options: [1, 2, 3],
            correctAnswer: 2
          },
          {
            question: "¿Cuántas uvas ves?",
            fruits: [
              { type: "grape", emoji: "🍇", position: { x: 50, y: 40 } }
            ],
            options: [1, 2, 3],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 2,
        title: "Nivel 2",
        description: "¡Vamos a contar más frutas!",
        range: "1-6",
        questions: [
          {
            question: "¿Cuántas manzanas ves?",
            fruits: [
              { type: "apple", emoji: "🍎", position: { x: 15, y: 20 } },
              { type: "apple", emoji: "🍎", position: { x: 35, y: 45 } },
              { type: "apple", emoji: "🍎", position: { x: 55, y: 25 } },
              { type: "apple", emoji: "🍎", position: { x: 75, y: 50 } }
            ],
            options: [3, 4, 5, 6],
            correctAnswer: 4
          },
          {
            question: "¿Cuántas cerezas ves?",
            fruits: [
              { type: "cherry", emoji: "🍒", position: { x: 20, y: 30 } },
              { type: "cherry", emoji: "🍒", position: { x: 40, y: 50 } },
              { type: "cherry", emoji: "🍒", position: { x: 60, y: 25 } },
              { type: "cherry", emoji: "🍒", position: { x: 80, y: 45 } },
              { type: "cherry", emoji: "🍒", position: { x: 30, y: 60 } }
            ],
            options: [4, 5, 6, 7],
            correctAnswer: 5
          },
          {
            question: "¿Cuántas peras ves?",
            fruits: [
              { type: "pear", emoji: "🍐", position: { x: 25, y: 35 } },
              { type: "pear", emoji: "🍐", position: { x: 50, y: 20 } },
              { type: "pear", emoji: "🍐", position: { x: 75, y: 55 } },
              { type: "pear", emoji: "🍐", position: { x: 35, y: 60 } },
              { type: "pear", emoji: "🍐", position: { x: 65, y: 40 } },
              { type: "pear", emoji: "🍐", position: { x: 45, y: 75 } }
            ],
            options: [5, 6, 7, 8],
            correctAnswer: 6
          },
          {
            question: "¿Cuántos melocotones ves?",
            fruits: [
              { type: "peach", emoji: "🍑", position: { x: 30, y: 25 } },
              { type: "peach", emoji: "🍑", position: { x: 60, y: 45 } },
              { type: "peach", emoji: "🍑", position: { x: 80, y: 30 } }
            ],
            options: [2, 3, 4, 5],
            correctAnswer: 3
          },
          {
            question: "¿Cuántas naranjas ves?",
            fruits: [
              { type: "orange", emoji: "🍊", position: { x: 20, y: 40 } },
              { type: "orange", emoji: "🍊", position: { x: 45, y: 25 } },
              { type: "orange", emoji: "🍊", position: { x: 70, y: 50 } },
              { type: "orange", emoji: "🍊", position: { x: 35, y: 65 } },
              { type: "orange", emoji: "🍊", position: { x: 65, y: 70 } }
            ],
            options: [4, 5, 6, 7],
            correctAnswer: 5
          }
        ]
      },
      {
        id: 3,
        title: "Nivel 3",
        description: "¡Desafío final hasta el 10!",
        range: "1-10",
        questions: [
          {
            question: "¿Cuántas fresas ves?",
            fruits: [
              { type: "strawberry", emoji: "🍓", position: { x: 10, y: 20 } },
              { type: "strawberry", emoji: "🍓", position: { x: 25, y: 40 } },
              { type: "strawberry", emoji: "🍓", position: { x: 40, y: 25 } },
              { type: "strawberry", emoji: "🍓", position: { x: 55, y: 50 } },
              { type: "strawberry", emoji: "🍓", position: { x: 70, y: 30 } },
              { type: "strawberry", emoji: "🍓", position: { x: 85, y: 45 } },
              { type: "strawberry", emoji: "🍓", position: { x: 30, y: 65 } }
            ],
            options: [6, 7, 8, 9],
            correctAnswer: 7
          },
          {
            question: "¿Cuántos plátanos ves?",
            fruits: [
              { type: "banana", emoji: "🍌", position: { x: 15, y: 15 } },
              { type: "banana", emoji: "🍌", position: { x: 35, y: 25 } },
              { type: "banana", emoji: "🍌", position: { x: 55, y: 35 } },
              { type: "banana", emoji: "🍌", position: { x: 75, y: 45 } },
              { type: "banana", emoji: "🍌", position: { x: 25, y: 55 } },
              { type: "banana", emoji: "🍌", position: { x: 45, y: 65 } },
              { type: "banana", emoji: "🍌", position: { x: 65, y: 75 } },
              { type: "banana", emoji: "🍌", position: { x: 85, y: 20 } }
            ],
            options: [7, 8, 9, 10],
            correctAnswer: 8
          },
          {
            question: "¿Cuántas uvas ves?",
            fruits: [
              { type: "grape", emoji: "🍇", position: { x: 12, y: 22 } },
              { type: "grape", emoji: "🍇", position: { x: 28, y: 38 } },
              { type: "grape", emoji: "🍇", position: { x: 44, y: 28 } },
              { type: "grape", emoji: "🍇", position: { x: 60, y: 52 } },
              { type: "grape", emoji: "🍇", position: { x: 76, y: 32 } },
              { type: "grape", emoji: "🍇", position: { x: 32, y: 62 } },
              { type: "grape", emoji: "🍇", position: { x: 48, y: 72 } },
              { type: "grape", emoji: "🍇", position: { x: 64, y: 18 } },
              { type: "grape", emoji: "🍇", position: { x: 80, y: 58 } }
            ],
            options: [8, 9, 10, 11],
            correctAnswer: 9
          },
          {
            question: "¿Cuántas manzanas ves?",
            fruits: [
              { type: "apple", emoji: "🍎", position: { x: 10, y: 10 } },
              { type: "apple", emoji: "🍎", position: { x: 30, y: 20 } },
              { type: "apple", emoji: "🍎", position: { x: 50, y: 30 } },
              { type: "apple", emoji: "🍎", position: { x: 70, y: 40 } },
              { type: "apple", emoji: "🍎", position: { x: 90, y: 50 } },
              { type: "apple", emoji: "🍎", position: { x: 20, y: 60 } },
              { type: "apple", emoji: "🍎", position: { x: 40, y: 70 } },
              { type: "apple", emoji: "🍎", position: { x: 60, y: 80 } },
              { type: "apple", emoji: "🍎", position: { x: 80, y: 15 } },
              { type: "apple", emoji: "🍎", position: { x: 25, y: 85 } }
            ],
            options: [9, 10, 11, 12],
            correctAnswer: 10
          },
          {
            question: "¿Cuántas cerezas ves?",
            fruits: [
              { type: "cherry", emoji: "🍒", position: { x: 18, y: 25 } },
              { type: "cherry", emoji: "🍒", position: { x: 38, y: 35 } },
              { type: "cherry", emoji: "🍒", position: { x: 58, y: 45 } },
              { type: "cherry", emoji: "🍒", position: { x: 78, y: 55 } },
              { type: "cherry", emoji: "🍒", position: { x: 28, y: 65 } },
              { type: "cherry", emoji: "🍒", position: { x: 48, y: 15 } }
            ],
            options: [5, 6, 7, 8],
            correctAnswer: 6
          }
        ]
      }
    ]
  };
