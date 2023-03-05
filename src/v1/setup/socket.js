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
    socket.on("join", (userId) => {
      try {
        socket.join(userId);
      } catch (err) {}
    });

    socket.on("send notification", (notification) => {
      try {
        io.emit("notification received", notification);
      } catch (err) {}
    });

    socket.on("send notification to user", (userId, notification) => {
      try {
        socket.to(userId).emit("notification received", notification);
      } catch (err) {}
    });
  });
};
