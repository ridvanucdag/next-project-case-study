import * as LocalStorageService from "@/providers/localStorage/localStorageService";
import LoggerService from "@/providers/loggerService/loggerService";

jest.mock("@/providers/loggerService/loggerService", () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

describe("localStorageService", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("getItem", () => {
    it("should return parsed value if item exists", async () => {
      localStorage.setItem("key1", JSON.stringify("value1"));

      const result = await LocalStorageService.getItem<string>("key1");
      expect(result).toBe("value1");
    });

    it("should return null if item does not exist", async () => {
      const result = await LocalStorageService.getItem<string>("missingKey");
      expect(result).toBeNull();
    });

    it("should return null and log error if JSON is invalid", async () => {
      localStorage.setItem("key2", "{ invalid json");

      const result = await LocalStorageService.getItem<string>("key2");
      expect(result).toBeNull();
      expect(LoggerService.error).toHaveBeenCalled();
    });
  });

  describe("getParsedItem", () => {
    it("should parse JSON twice and return result", () => {
      const doubleSerialized = JSON.stringify(JSON.stringify({ foo: "bar" }));
      localStorage.setItem("key3", doubleSerialized);

      const result = LocalStorageService.getParsedItem<{ foo: string }>("key3");
      expect(result).toEqual({ foo: "bar" });
    });

    it("should return null if no value exists", () => {
      const result = LocalStorageService.getParsedItem("missing");
      expect(result).toBeNull();
    });

    it("should return null and log error on invalid parse", () => {
      localStorage.setItem("key4", "not json");
      const result = LocalStorageService.getParsedItem("key4");
      expect(result).toBeNull();
      expect(LoggerService.error).toHaveBeenCalled();
    });
  });

  describe("setItem", () => {
    it("should store string value", async () => {
      const result = await LocalStorageService.setItem("key5", "test");
      expect(result).toBe(true);
      expect(localStorage.getItem("key5")).toBe(JSON.stringify("test"));
    });

    it("should store boolean value", async () => {
      const result = await LocalStorageService.setItem("key6", false);
      expect(result).toBe(true);
      expect(localStorage.getItem("key6")).toBe("false");
    });

    it("should return false and log error on failure", async () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
        throw new Error("fail");
      });

      const result = await LocalStorageService.setItem("key7", "value");
      expect(result).toBe(false);
      expect(LoggerService.error).toHaveBeenCalled();
    });
  });

  describe("removeItem", () => {
    it("should remove item and notify listeners", async () => {
      localStorage.setItem("key8", JSON.stringify("value8"));
      const result = await LocalStorageService.removeItem("key8");

      expect(result).toBe(true);
      expect(localStorage.getItem("key8")).toBeNull();
    });

    it("should return false and log error on failure", async () => {
      jest.spyOn(Storage.prototype, "removeItem").mockImplementationOnce(() => {
        throw new Error("remove failed");
      });

      const result = await LocalStorageService.removeItem("bad-key");
      expect(result).toBe(false);
      expect(LoggerService.error).toHaveBeenCalled();
    });
  });

  describe("notifyListeners (internal)", () => {
    it("should call registered listeners when value changes", async () => {
      const listener = jest.fn();
      const key = "watched-key";


      LocalStorageService["listeners"][key] = {
        "test-id": listener,
      };

      await LocalStorageService.setItem(key, "newValue");
      expect(listener).toHaveBeenCalledWith("newValue");
    });

    it("should notify listeners with null on remove", async () => {
      const listener = jest.fn();
      const key = "watched-key-null";

      LocalStorageService["listeners"][key] = {
        "test-id-null": listener,
      };

      await LocalStorageService.removeItem(key);
      expect(listener).toHaveBeenCalledWith(null);
    });
  });
});
