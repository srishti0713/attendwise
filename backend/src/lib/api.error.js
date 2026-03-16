export const throwError = (
    res,
    error,
    controllerName,
    code = 500,
    message = "Internal Server Error",
) => {
    console.error(`ERROR :: CONTROLLER :: ${controllerName} ::`, error.message);
    return res.status(code).json({ message });
};
