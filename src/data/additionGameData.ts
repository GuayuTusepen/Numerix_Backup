
export interface AdditionLevel {
    level: number;
    problems: {
        num1: number;
        num2: number;
        answer: number;
    }[];
}

export const bugAdditionGameData: AdditionLevel[] = [
    {
        level: 1,
        problems: [
            { num1: 1, num2: 1, answer: 2 },
            { num1: 2, num2: 1, answer: 3 },
            { num1: 1, num2: 2, answer: 3 },
            { num1: 3, num2: 1, answer: 4 },
            { num1: 2, num2: 2, answer: 4 },
        ],
    },
    {
        level: 2,
        problems: [
            { num1: 3, num2: 2, answer: 5 },
            { num1: 2, num2: 4, answer: 6 },
            { num1: 4, num2: 1, answer: 5 },
            { num1: 3, num2: 3, answer: 6 },
            { num1: 5, num2: 1, answer: 6 },
        ],
    },
    {
        level: 3,
        problems: [
            { num1: 4, num2: 3, answer: 7 },
            { num1: 5, num2: 2, answer: 7 },
            { num1: 3, num2: 5, answer: 8 },
            { num1: 6, num2: 2, answer: 8 },
            { num1: 4, num2: 4, answer: 8 },
        ],
    },
    {
        level: 4,
        problems: [
            { num1: 5, num2: 4, answer: 9 },
            { num1: 6, num2: 3, answer: 9 },
            { num1: 7, num2: 2, answer: 9 },
            { num1: 5, num2: 5, answer: 10 },
            { num1: 8, num2: 2, answer: 10 },
        ],
    },
];
