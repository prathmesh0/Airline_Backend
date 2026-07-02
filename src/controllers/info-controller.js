const statusCode = require('http-status-codes');

const info = (req, res) =>
  res.status(statusCode.StatusCodes.NOT_FOUND).json({
    success: true,
    message: 'Hello World',
    error: {},
    data: {},
  });

module.exports = {
  info,
};
