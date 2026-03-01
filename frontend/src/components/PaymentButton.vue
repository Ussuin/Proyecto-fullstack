<template>
  <div>
    <button @click="iniciarPago">Pagar Curso</button>
  </div>
</template>

<script setup>
async function iniciarPago() {
  try {
    const response = await fetch("http://localhost:3000/api/pago", {
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
