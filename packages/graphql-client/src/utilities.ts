export function buildDataObjectByPath(
  path: string[],
  data: any
): Record<string | number, any> {
  if (path.length === 0) {
    return data;
  }

  const key = path.pop() as string | number;
  const newData = {
    [key]: data,
  };

  if (path.length === 0) {
    return newData;
  }

  return buildDataObjectByPath(path, newData);
}

function combineObjects(baseObject: any, newObject: any) {
  return Object.keys(newObject || {}).reduce(
    (acc: any, key: string | number) => {
      if (
        (typeof newObject[key] === 'object' || Array.isArray(newObject[key])) &&
        baseObject[key]
      ) {
        acc[key] = combineObjects(baseObject[key], newObject[key]);
        return acc;
      }

      acc[key] = newObject[key];
      return acc;
    },
    Array.isArray(baseObject) ? [...baseObject] : {...baseObject}
  );
}

export function buildCombinedDataObject(dataArray: any) {
  return dataArray.reduce((acc: any, datum: any, index: number) => {
    if (index === 0) {
      return {...datum};
    }

    return combineObjects(acc, datum);
  }, {});
}

export function getErrorMessage(error: any) {
  return error instanceof Error ? error.message : JSON.stringify(error);
}

export function getErrorCause(error: any): Record<string, any> {
  return error instanceof Error && error.cause ? error.cause : {};
}
