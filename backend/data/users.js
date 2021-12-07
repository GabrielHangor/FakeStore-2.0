import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin User',
    email: 'admin@yandex.ru',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'Gabriel',
    email: 'Gabriel@yandex.ru',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Masha',
    email: 'Masha@yandex.ru',
    password: bcrypt.hashSync('123456', 10),
  },
];

export default users;
