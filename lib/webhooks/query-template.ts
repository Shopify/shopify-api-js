export function queryTemplate(template: string, params: {[key: string]: any}) {
  let query = template;

  Object.entries(params).forEach(([key, value]) => {
    query = query.replace(`{{${key}}}`, value);
  });

  return query;
}
