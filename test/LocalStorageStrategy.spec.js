import { LocalStorageStrategy } from "../src/LocalStorageStrategy.js";

describe("LocalStorageStrategy", () => {
  describe("constructor", () => {
    it("returns a LocalStorageStrategy instance if creation is successful", () => {
      expect(
        new LocalStorageStrategy() instanceof LocalStorageStrategy
      ).toBeTruthy();
    });
  });
});
