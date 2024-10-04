
const verifyUser = async (accessToken) => {
  try {
    if (!accessToken) {
      throw new Error("Unauthorized request");
    }

    const variables = { accessToken };
    const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:8001/user";

    const response = await fetch(USER_SERVICE_URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation VerifyUser($accessToken: String!) {
          verifyUser(accessToken: $accessToken) {
            success
            message
            user {
              _id
            }
          }
        }`,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify user");
    }

    const data = await response.json();

    if (!data.data.verifyUser.success) {
      throw new Error(data.data.verifyUser.message || "Invalid user");
    }

    return data.data.verifyUser.user;
  } catch (error) {
    console.error("Error verifying user:", error.message);
    throw new Error("Error verifying user");
  }
};

module.exports = { verifyUser };
