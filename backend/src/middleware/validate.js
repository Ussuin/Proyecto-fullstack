function validateAlumno(req, res, next) {
  const { nombre, edad } = req.body;
  if (!nombre) return res.status(400).json({ error: "Nombre es obligatorio" });
  if (edad !== undefined && (!Number.isInteger(edad) || edad < 0)) {
    return res.status(400).json({ error: "Edad inválida" });
  }
  next();
}

module.exports = { validateAlumno };
