export function queryTemplate(template: string, params: Record<string, any>) {
  let query = template;

  Object.entries(params).forEach(([key, value]) => {
    query = query.replace(`{{${key}}}`, value);
  });

  return query;
}
