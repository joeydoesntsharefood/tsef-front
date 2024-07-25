import { Error } from "../types/error.type";

const formatError = (value: Error[]): Record<string, string> => {
  console.log(value);
  if (!value) return null;
  
  const error = {};

  value.forEach(({ path, message }) => Object.assign(error, { [path[0]]: message }))

  return error;
}

export default formatError;