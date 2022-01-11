const users = [];

const getColorForCurrentUser = (usersInRoom) => {
  switch (usersInRoom) {
    case 0:
      return "red";
    case 1:
      return "blue";
    case 2:
      return "green";
    case 3:
      return "yellow";
  }
};

const addUser = ({ id, name, room }) => {
  const numberOfUsersInRoom = users.filter((user) => user.room === room).length;
  if (numberOfUsersInRoom === 4) {
    return { error: "Room full" };
  }

  const usersInRoom = getNumberOfUsersInRoom(room);
  const color = getColorForCurrentUser(usersInRoom);

  const newUser = { id, name, room, color };
  users.push(newUser);
  return { newUser };
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getNumberOfUsersInRoom = (room) => {
  return users.filter((user) => user.room == room).length;
};

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room == room);
};

const getNextUser = (room, currentUserId) => {
  const usersInRoom = getUsersInRoom(room);
  const currentUserIndex = usersInRoom.findIndex(
    (user) => currentUserId === user.id
  );
  if (currentUserIndex >= usersInRoom.length - 1) {
    return usersInRoom[0];
  } else {
    return usersInRoom[currentUserIndex + 1];
  }
};

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  getNumberOfUsersInRoom,
  getNextUser,
};
