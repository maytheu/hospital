import AuthService from "../../src/services/Auth.service";

describe("Unit test for auth service", () => {
  it("should return string of length 15", () => {
    expect(AuthService["genPass"]().length).toBe(15);
  });

  it("Should encrypt and decrypt password", async () => {
    const password = AuthService["genPass"]();
    const hash = await AuthService["encryptPassword"](password);
    expect(await AuthService["comparePassword"](password, hash)).toBe(true);
  });

  it("Shouldreturn false for incorrect password", async () => {
    const password = AuthService["genPass"]();
    const hash = await AuthService["encryptPassword"](password);
    const password2 = AuthService["genPass"]();
    expect(await AuthService["comparePassword"](password2, hash)).toBe(false);
  });
});
