import {enableCodeAfterVersion} from '../versioned-codeblocks';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';

describe('Versioned codeblocks', () => {
  it('can enable code after a version', () => {
    const mockFn = jest.fn();
    enableCodeAfterVersion(SHOPIFY_API_LIBRARY_VERSION, mockFn);
    expect(mockFn).toHaveBeenCalled();
  });

  it('does not enable code before a version', () => {
    const mockFn = jest.fn();
    enableCodeAfterVersion('9999.0.0', mockFn);
    expect(mockFn).not.toHaveBeenCalled();
  });
});
