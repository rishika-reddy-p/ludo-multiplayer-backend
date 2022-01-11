const { Server } = require("socket.io");
const {
  addUser,
  getUsersInRoom,
  getNumberOfUsersInRoom,
  getNextUser,
  getUser,
} = require("./users");

const io = new Server(3142, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join", (payload, callback) => {
    const { error, newUser } = addUser({
      id: Date.now(),
      name: payload.name,
      room: payload.room,
    });

    if (error) {
      return callback(error);
    }
    socket.join(payload.room);

    const usersInRoom = getUsersInRoom(payload.room);

    socket.emit("currentUserData", {
      newUser: newUser,
      numberOfUsers: getNumberOfUsersInRoom(payload.room),
      currentTurn: {
        id: usersInRoom[0].id,
        name: usersInRoom[0].name,
        color: usersInRoom[0].color,
      },
    });

    io.to(payload.room).emit("currentUserData", {
      newUser: newUser,
      numberOfUsers: getNumberOfUsersInRoom(payload.room),
      currentTurn: {
        id: usersInRoom[0].id,
        name: usersInRoom[0].name,
        color: usersInRoom[0].color,
      },
    });

    callback();
  });

  socket.on("move-finished", (payload, callback) => {
    const state = payload.state;
    const currentTurnUserId = payload.currentTurn?.id;
    const roomId = payload.room;

    socket.emit("next-move", {
      currentTurn: getNextUser(roomId, currentTurnUserId),
    });

    // Sending moves made by one player to other players.
    io.to(roomId).emit("next-move", {
      state: state,
      currentTurn: getNextUser(roomId, currentTurnUserId),
      gameOver: payload.gameOver,
      winner: payload.gameOver ? getUser(currentTurnUserId) : null,
    });

    callback && callback();
  });
});
