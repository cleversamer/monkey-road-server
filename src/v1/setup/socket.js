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
    const secret = process.env.SOCKET_SECRET;

    socket.on("setup", (userId) => {
      try {
        socket.join(userId + secret);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("send notification", (notification) => {
      try {
        io.emit("notification received", notification);
      } catch (err) {
        console.log(err);
      }
    });
  });
};
