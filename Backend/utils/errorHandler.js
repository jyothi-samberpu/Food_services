const handleError = (res, statusCode, message, error = null) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  console.error(`[${new Date().toISOString()}] [${statusCode}] ${message}`, 
    isDev && error?.message ? `Error: ${error.message}` : '');
  
  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(isDev && error && { error: error.message })
  });
};

module.exports = handleError;
