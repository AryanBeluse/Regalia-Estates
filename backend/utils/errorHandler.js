export const error = (statusCode, message) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    err.success = false
    return err;
};
