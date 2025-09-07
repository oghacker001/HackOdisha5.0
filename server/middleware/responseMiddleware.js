export const responseMiddleware = (req, res, next) => {
  res.success = (data, message = "Success") => {
    res.json({
      success: true,
      message,
      data,
    });
  };
  next();
};