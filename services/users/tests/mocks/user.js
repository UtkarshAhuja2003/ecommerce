const mockUsers = [
    { _id: '123', email: 'test1@example.com', name: "Test1", password: 'password123' },
    { _id: '124', email: 'test2@example.com', name: "Test2", password: 'password456' },
];
  
const mockUserInput = {
    email: 'test@example.com',
    password: 'password123',
};
  
const mockLoginInput = {
    email: 'test@example.com',
    password: 'password123',
};

module.exports = { mockUsers, mockUserInput, mockLoginInput };