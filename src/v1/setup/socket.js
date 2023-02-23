const socketIo = require("socket.io");

module.exports = (server) => {
  const options = {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  };

  const io = socketIo(server, options);

  io.on("connection", (socket) => {
    socket.on("send notification", (notification) => {
      try {
        io.emit("notification received", notification);
      } catch (err) {}
    });
  });
};
