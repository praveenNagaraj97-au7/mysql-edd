export const pageNotFoundError = (req, res, next) => {
  res.status(404).json({
    message: "Page Not Found",
  });
};

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (err.message.startsWith("Cannot read property"))
    err.message = "Wrong Input Given";

  res.status(err.statusCode).json({
    message: err.message,
    err,
    where: err.stack,
  });
};
