// Server (Node.js + Socket.io)
const io = require("socket.io")(3000, {
    cors: {
        origin: "*"
    }
});

let secretWord = "";
let host = null;

io.on("connection", socket => {
    console.log("User connected", socket.id);
    
    socket.on("set-host", word => {
        secretWord = word.toLowerCase();
        host = socket.id;
        io.emit("host-set", "Host telah memilih kata!");
    });
    
    socket.on("guess", data => {
        const { name, guess } = data;
        if (secretWord && guess.toLowerCase() === secretWord) {
            io.emit("winner", `${name} menebak dengan benar! Kata: ${secretWord}`);
            secretWord = "";
            host = null;
        } else {
            socket.emit("wrong", "Tebakan salah, coba lagi!");
        }
    });

    socket.on("disconnect", () => {
        if (socket.id === host) {
            io.emit("reset", "Host keluar, permainan direset.");
            secretWord = "";
            host = null;
        }
    });
});

console.log("Server running on port 3000");
