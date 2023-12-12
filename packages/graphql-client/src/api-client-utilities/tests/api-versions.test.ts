import {
  getCurrentApiVersion,
  getCurrentSupportedApiVersions,
} from "../api-versions";

const mockDate = new Date("2023-10-15");

describe("getCurrentApiVersion()", () => {
  beforeEach(() => {
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the current API version based on the current date", () => {
    const currentVersion = getCurrentApiVersion();

    expect(currentVersion).toEqual({
      year: 2023,
      quarter: 4,
      version: "2023-10",
    });
  });
});

describe("getCurrentSupportedApiVersions()", () => {
  beforeEach(() => {
    jest.spyOn(global, "Date").mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the a list of supported API version based on the current date", () => {
    const currentVersions = getCurrentSupportedApiVersions();

    expect(currentVersions).toEqual([
      "2023-01",
      "2023-04",
      "2023-07",
      "2023-10",
      "2024-01",
      "unstable",
    ]);
  });
});
