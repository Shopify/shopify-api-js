import { getDomain } from "../utilities";

describe("getDomain()", () => {
  it("returns the domain only from a url string", () => {
    const storeDomain = "test-shop.shopify.io";

    const domain = getDomain(`https://${storeDomain}/`);

    expect(domain).toEqual(storeDomain);
  });
});
