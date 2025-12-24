class AppError extends Error {
	constructor(message, statusCode, code = null) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		this.code = code;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;