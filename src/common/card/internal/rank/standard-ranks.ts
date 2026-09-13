import { registerRank } from "./definitions.js";


registerRank({
    rank: "A",
    value: 1,
    face:  [
        "A      ", 
        "       ", 
        "   x   ", 
        "       ", 
        "      ∀"
    ],
    runConnections: {
        successor: "2"
    }
});


registerRank({
    rank: "2",
    value: 2,
    face:  [
        "2      ", 
        "   x   ", 
        "       ", 
        "   x   ", 
        "      Z"
    ],
    runConnections: {
        predecessor: "A",
        successor: "3"
    }
});


registerRank({
    rank: "3",
    value: 3,
    face:  [
        "3      ", 
        "   x   ", 
        "   x   ", 
        "   x   ", 
        "      E"
    ],
    runConnections: {
        predecessor: "2",
        successor: "4"
    }
});


registerRank({
    rank: "4",
    value: 4,
    face:  [
        "4      ", 
        "  x x  ", 
        "       ", 
        "  x x  ", 
        "      h"
    ],
    runConnections: {
        predecessor: "3",
        successor: "5"
    }
});


registerRank({
    rank: "5",
    value: 5,
    face:  [
        "5      ", 
        "  x x  ", 
        "   x   ", 
        "  x x  ", 
        "      S"
    ],
    runConnections: {
        predecessor: "4",
        successor: "6"
    }
});


registerRank({
    rank: "6",
    value: 6,
    face: [
        "6      ", 
        "  x x  ", 
        "  x x  ", 
        "  x x  ", 
        "      9"
    ],
    runConnections: {
        predecessor: "5",
        successor: "7"
    }
});


registerRank({
    rank: "7",
    value: 7,
    face: [
        "7      ", 
        "  x x  ", 
        " x x x ", 
        "  x x  ", 
        "      L"
    ],
    runConnections: {
        predecessor: "6",
        successor: "8"
    }
});


registerRank({
    rank: "8",
    value: 9,
    face:  [
        "8      ",
        " x x x ",
        "  x x  ",
        " x x x ",
        "      8"
    ],
    runConnections: {
        predecessor: "7",
        successor: "9"
    }
});


registerRank({
    rank: "9",
    value: 10,
    face:  [
        "9      ",
        " x x x ",
        " x x x ",
        " x x x ",
        "      6"
    ],
    runConnections: {
        predecessor: "8",
        successor: "10"
    }
});


registerRank({
    rank: "10",
    value: 10,
    face:  [
        "10     ",
        " x x x ",
        " x x x ",
        " x x x ",
        " x   0I"
    ],
    runConnections: {
        predecessor: "9",
        successor: "J"
    }
});


registerRank({
    rank: "J",
    value: 10,
    face:  [
        "J      ",
        " x {)  ",
        " |/%/| ",
        "  (} x ",
        "      ſ"
    ],
    runConnections: {
        predecessor: "10",
        successor: "Q"
    }
});


registerRank({
    rank: "Q",
    value: 10,
    face:  [
        "Q      ",
        " x/(}, ",
        " /\\%\\/ ",
        " '{)/x ",
        "      O"
    ],
    runConnections: {
        predecessor: "J",
        successor: "K"
    }
});


registerRank({
    rank: "K",
    value: 10,
    face:  [
        "K   W  ", 
        " x {)| ", 
        " |/%/| ", 
        " |(} x ", 
        "  M   >"
    ],
    runConnections: {
        predecessor: "Q"
    }
});