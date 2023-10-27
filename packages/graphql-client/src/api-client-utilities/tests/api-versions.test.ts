import {
  getCurrentAPIVersion,
  getCurrentSupportedAPIVersions,
} from "../api-versions";

const mockDate = new Date("2022-10-15");

describe("getCurrentAPIVersion()", () => {
  beforeEach(() => {
    jest.spyOn(window, "Date").mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the current API version based on the current date", () => {
    const currentVersion = getCurrentAPIVersion();

    expect(currentVersion).toEqual({
      year: 2022,
      quarter: 4,
      version: "2022-10",
    });
  });
});

describe("getCurrentSupportedAPIVersions()", () => {
  beforeEach(() => {
    jest.spyOn(window, "Date").mockImplementation(() => mockDate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the a list of supported API version based on the current date", () => {
    const currentVersions = getCurrentSupportedAPIVersions();

    expect(currentVersions).toEqual([
      "2022-01",
      "2022-04",
      "2022-07",
      "2022-10",
      "2023-01",
      "unstable",
    ]);
  });
});
