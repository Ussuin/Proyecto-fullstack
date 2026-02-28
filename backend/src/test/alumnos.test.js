const request = require("supertest");
const app = require("../src/server");

describe("Alumnos API", () => {
  it("debe crear un alumno", async () => {
    const res = await request(app)
      .post("/alumnos")
      .send({ nombre: "Test Alumno", edad: 25 })
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.nombre).toBe("Test Alumno");
  });
});
