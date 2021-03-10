module.exports = {
  modulePaths: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
  verbose: false,
};
