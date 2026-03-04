<template>
  <div>
    <button @click="iniciarPago">Pagar Curso</button>
  </div>
</template>

<script setup>
// Base URL del API configurable via Vite env: VITE_API_URL
// Por defecto en producción usamos rutas relativas al backend servido en /api
const API_BASE = import.meta.env.VITE_API_URL;

async function iniciarPago() {
  try {
    const response = await fetch(`${API_BASE}/pago`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    }
  } catch (error) {
    console.error("Error iniciando pago:", error);
  }
}
</script>

<style scoped>
button {
  background-color: #009ee3; /* color oficial de Mercado Pago */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}
button:hover {
  background-color: #007bb5;
}
</style>
