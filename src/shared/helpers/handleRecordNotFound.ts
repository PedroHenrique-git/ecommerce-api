export function handleRecordNotFound(controllerName: string) {
  return { message: `${controllerName} does not exist` };
}
