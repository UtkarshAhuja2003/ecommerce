const { registerUser, loginUser, getAllUsers, getUser } = require("../../src/resolvers/user");
const { mockUsers, mockUserInput, mockLoginInput } = require("../mocks/user");
const User = require("../../src/models/User");

jest.mock("../../src/models/User.js");

describe('User Resolvers', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('Return all Users', async () => {
      User.find.mockResolvedValue(mockUsers);
  
      const result = await getAllUsers();
  
      expect(User.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('Return a User by ID', async () => {
        User.findById.mockResolvedValue(mockUsers[0]);
    
        const result = await getUser(null, { _id: "1" });
    
        expect(User.findById).toHaveBeenCalledWith("1");
        expect(result).toEqual(mockUsers[0]);
      });
});
