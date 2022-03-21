import ProcessedQuery from '../processed-query';

// Naming conventions don’t apply to query payloads.
/* eslint-disable @typescript-eslint/naming-convention */
describe('ProcessedQuery', () => {
  it('encode objects like querystring', async () => {
    const value = {
      val_a: 1,
      val_b: 'string',
    };
    expect(ProcessedQuery.stringify(value)).toEqual('val_a=1&val_b=string');
  });

  it('encode arrays like querystring', async () => {
    const value = {
      val_c: [1, 2, 3],
    };
    const escapedVariable = encodeURIComponent('val_c[]');
    expect(ProcessedQuery.stringify(value)).toEqual(
      `${escapedVariable}=1&${escapedVariable}=2&${escapedVariable}=3`,
    );
  });
});
