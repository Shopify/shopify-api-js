import {
  validateDomainAndGetStoreUrl,
  validateApiVersion,
} from "../validations";

const client = "Client:";

describe("validateDomainAndGetStoreUrl())", () => {
  it("throws an error when store domain is undefined", () => {
    const storeDomain = undefined;

    expect(() => validateDomainAndGetStoreUrl({ client, storeDomain })).toThrow(
      new Error(
        `${client}: a valid store domain ("${storeDomain}") must be provided`,
      ),
    );
  });

  it("throws an error when store domain is not a string", () => {
    const storeDomain = 123;

    expect(() =>
      validateDomainAndGetStoreUrl({
        client,
        storeDomain: storeDomain as any,
      }),
    ).toThrow(
      new Error(
        `${client}: a valid store domain ("${storeDomain}") must be provided`,
      ),
    );
  });

  it("throws an error when store domain is an empty-ish string", () => {
    const storeDomain = "       ";

    expect(() =>
      validateDomainAndGetStoreUrl({
        client,
        storeDomain: storeDomain as any,
      }),
    ).toThrow(
      new Error(
        `${client}: a valid store domain ("${storeDomain}") must be provided`,
      ),
    );
  });

  it("returns the store url when a valid store domain is provided", () => {
    const domainOnly = "test-store.myshopify.io";
    const storeDomain = `https://${domainOnly}`;

    const domain = validateDomainAndGetStoreUrl({ client, storeDomain });
    expect(domain).toEqual(storeDomain);
  });

  it("returns the store url when a protocol-less store domain is provided", () => {
    const domainOnly = "test-store.myshopify.io";

    const domain = validateDomainAndGetStoreUrl({
      client,
      storeDomain: domainOnly,
    });
    expect(domain).toEqual(`https://${domainOnly}`);
  });

  it("returns a secure store url when a http protocol store domain is provided", () => {
    const domainOnly = "test-store.myshopify.io";

    const domain = validateDomainAndGetStoreUrl({
      client,
      storeDomain: `http://${domainOnly}`,
    });
    expect(domain).toEqual(`https://${domainOnly}`);
  });

  it("returns a store url when a protocol-less store domain starting with http is provided", () => {
    const domainOnly = "http-test-store.myshopify.io";

    const domain = validateDomainAndGetStoreUrl({
      client,
      storeDomain: domainOnly,
    });
    expect(domain).toEqual(`https://${domainOnly}`);
  });

  it("returns a store url when a protocol-less store domain starting with https is provided", () => {
    const domainOnly = "https-test-store.myshopify.io";

    const domain = validateDomainAndGetStoreUrl({
      client,
      storeDomain: domainOnly,
    });
    expect(domain).toEqual(`https://${domainOnly}`);
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
      .spyOn(global.console, "warn")
      .mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("throws an error when API version is undefined", () => {
    const apiVersion = undefined;

    expect(() =>
      validateApiVersion({
        client,
        currentSupportedApiVersions: mockApiVersions,
        apiVersion: apiVersion as any,
      }),
    ).toThrow(
      new Error(
        `${client}: the provided apiVersion ("${apiVersion}") is invalid. Currently supported API versions: ${mockApiVersions.join(
          ", ",
        )}`,
      ),
    );
  });

  it("throws an error when API version is not a string", () => {
    const apiVersion = 123;

    expect(() =>
      validateApiVersion({
        client,
        currentSupportedApiVersions: mockApiVersions,
        apiVersion: apiVersion as any,
      }),
    ).toThrow(
      new Error(
        `${client}: the provided apiVersion ("${apiVersion}") is invalid. Currently supported API versions: ${mockApiVersions.join(
          ", ",
        )}`,
      ),
    );
  });

  it("console warns when API version is an invalid value and no logger was provided", () => {
    const apiVersion = "   ";

    validateApiVersion({
      client,
      currentSupportedApiVersions: mockApiVersions,
      apiVersion: apiVersion as any,
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `${client}: the provided apiVersion ("${apiVersion}") is likely deprecated or not supported. Currently supported API versions: ${mockApiVersions.join(
        ", ",
      )}`,
    );
  });

  it("logs an Unsupported_Api_Version log object when a logger is provided and the api version is not supported", () => {
    const apiVersion = "2021-10";
    const logger = jest.fn();

    validateApiVersion({
      client,
      currentSupportedApiVersions: mockApiVersions,
      apiVersion: apiVersion as any,
      logger,
    });

    expect(logger).toHaveBeenCalledWith({
      type: "Unsupported_Api_Version",
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
        client,
        currentSupportedApiVersions: mockApiVersions,
        apiVersion: apiVersion as any,
      }),
    ).not.toThrow();
  });
});
