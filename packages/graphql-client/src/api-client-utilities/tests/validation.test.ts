import {
  validateRequiredStoreDomain,
  validateApiVersion,
} from "../validations";

const errorPrefix = "Client:";

describe("validateRequiredStoreDomain())", () => {
  it("throws an error when store domain is undefined", () => {
    const storeDomain = undefined;

    expect(() => validateRequiredStoreDomain(errorPrefix, storeDomain)).toThrow(
      new Error(`${errorPrefix} a valid store domain must be provided`)
    );
  });

  it("throws an error when store domain is not a string", () => {
    const storeDomain = 123;

    expect(() =>
      validateRequiredStoreDomain(errorPrefix, storeDomain as any)
    ).toThrow(
      new Error(`${errorPrefix} a valid store domain must be provided`)
    );
  });

  it("throws an error when store domain is an empty-ish string", () => {
    const storeDomain = "       ";

    expect(() =>
      validateRequiredStoreDomain(errorPrefix, storeDomain as any)
    ).toThrow(
      new Error(`${errorPrefix} a valid store domain must be provided`)
    );
  });

  it("does not throw an error when store domain is defined", () => {
    const storeDomain = "https://test-store.myshopify.com";

    expect(() =>
      validateRequiredStoreDomain(errorPrefix, storeDomain)
    ).not.toThrow();
  });
});

describe("validateRequiredApiVersion()", () => {
  const mockApiVersions = [
    "2022-07",
    "2022-10",
    "2023-01",
    "2023-04",
    "unstable",
  ];

  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest
      .spyOn(window.console, "warn")
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("throws an error when API version is undefined", () => {
    const apiVersion = undefined;

    expect(() =>
      validateApiVersion({
        errorPrefix,
        currentSupportedApiVersions: mockApiVersions,
        apiVersion: apiVersion as any,
      })
    ).toThrow(
      new Error(
        `${errorPrefix} the provided \`apiVersion\` (\`${apiVersion}\`) is invalid. Current supported API versions: ${mockApiVersions.join(
          ", "
        )}`
      )
    );
  });

  it("throws an error when API version is not a string", () => {
    const apiVersion = 123;

    expect(() =>
      validateApiVersion({
        errorPrefix,
        currentSupportedApiVersions: mockApiVersions,
        apiVersion: apiVersion as any,
      })
    ).toThrow(
      new Error(
        `${errorPrefix} the provided \`apiVersion\` (\`${apiVersion}\`) is invalid. Current supported API versions: ${mockApiVersions.join(
          ", "
        )}`
      )
    );
  });

  it("console warns when API version is an invalid value and no logger was provided", () => {
    const apiVersion = "   ";

    validateApiVersion({
      errorPrefix,
      currentSupportedApiVersions: mockApiVersions,
      apiVersion: apiVersion as any,
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `${errorPrefix} the provided \`apiVersion\` (\`${apiVersion}\`) is deprecated or not supported. Current supported API versions: ${mockApiVersions.join(
        ", "
      )}`
    );
  });

  it("logs an UNSUPPORTED_API_VERSION log object when a logger is provided and the api version is not supported", () => {
    const apiVersion = "2021-10";
    const logger = jest.fn();

    validateApiVersion({
      errorPrefix,
      currentSupportedApiVersions: mockApiVersions,
      apiVersion: apiVersion as any,
      logger,
    });

    expect(logger).toHaveBeenCalledWith({
      type: "UNSUPPORTED_API_VERSION",
      content: {
        apiVersion,
        supportedApiVersions: mockApiVersions,
      },
    });

    expect(consoleWarnSpy).not.toBeCalled();
  });

  it("does not throw an error when API version is defined", () => {
    const apiVersion = "2023-01";

    expect(() =>
      validateApiVersion({
        errorPrefix,
        currentSupportedApiVersions: mockApiVersions,
        apiVersion: apiVersion as any,
      })
    ).not.toThrow();
  });
});
