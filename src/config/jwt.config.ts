export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET || "1231234", // Default to 'yourSecretKey' if not provided
  },
});
