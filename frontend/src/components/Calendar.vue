<template>
  <div class="container">
    <!-- Calendario -->
    <div class="card calendario">
      <h2>Calendario Semanal</h2>
      <table>
        <thead>
          <tr>
            <th>Hora</th>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Sábado primero -->
          <tr v-for="slot in saturdaySlots" :key="slot">
            <td>{{ slot }}</td>
            <td v-for="day in days.slice(0,5)" :key="day"></td>
            <td :id="`Sábado-${slot}`" 
                @click="isSlotBlocked('Sábado', slot) ? null : openOptions('Sábado', slot)"
                :class="{ 'blocked-slot': isSlotBlocked('Sábado', slot) }">
              <span v-if="isSlotBlocked('Sábado', slot)">No hay clase en este horario</span>
              <span v-else>{{ calendar[`Sábado-${slot}`]?.texto || "" }}</span>
            </td>
          </tr>

          <!-- Lunes a viernes después -->
          <tr v-for="slot in weekdaySlots" :key="slot">
            <td>{{ slot }}</td>
            <td v-for="day in days.slice(0,5)" 
                :key="day" 
                :id="`${day}-${slot}`"
                @click="isSlotBlocked(day, slot) ? null : openOptions(day, slot)"
                :class="{ 'blocked-slot': isSlotBlocked(day, slot) }">
              <span v-if="isSlotBlocked(day, slot)">No hay clase en este horario</span>
              <span v-else>{{ calendar[`${day}-${slot}`]?.texto || "" }}</span>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <p>{{ message }}</p>
    </div>
 
    <!-- Panel lateral -->
    <div class="card asignadas">
      <h2>Clases asignadas</h2>
      <ul>
        <li v-for="(info, key) in calendar" :key="key">
          {{ key }} → {{ info.texto }}
        </li>
      </ul>
    </div>

    <!-- Modal de opciones -->
    <div v-if="showOptions" class="modal">
      <div class="modal-content">
        <h3>Opciones para {{ selectedSlot }}</h3>

        <div v-if="calendar[selectedSlot]">
          <p>Clase actual: {{ calendar[selectedSlot].texto }}</p>
          <button class="btn-danger" @click="eliminarClase(calendar[selectedSlot]._id)">Eliminar clase</button>
        </div>
        <div v-else>
          <p>No hay clase asignada.</p>

          <!-- PROFESOR -->
          <label>Profesor:</label>
          <select v-model="selectedProfesor">
            <option disabled value="">-- elegir --</option>
            <option v-for="p in props.profesores" :key="p._id" :value="p._id">{{ p.nombre }}</option>
            <option value="nuevo">+ Agregar Nuevo Profesor</option>
          </select>
          <div v-if="selectedProfesor === 'nuevo'" class="nuevo-input">
            <input v-model="nuevoNombreProfesor" placeholder="Nombre del profesor">
            <input v-model="nuevaEspecialidad" placeholder="Especialidad (ej. Piano)">
          </div>
          <br>

          <!-- ALUMNO -->
          <label>Alumno:</label>
          <select v-model="selectedAlumno">
            <option disabled value="">-- elegir --</option>
            <option v-for="a in props.alumnos" :key="a._id" :value="a._id">{{ a.nombre }}</option>
            <option value="nuevo">+ Agregar Nuevo Alumno</option>
          </select>
          <div v-if="selectedAlumno === 'nuevo'" class="nuevo-input">
            <input v-model="nuevoNombreAlumno" placeholder="Nombre del alumno">
          </div>
          <br>

          <!-- CLASE -->
          <label>Clase/Instrumento:</label>
          <select v-model="selectedClase">
            <option disabled value="">-- elegir --</option>
            <!-- Aquí guardamos el objeto completo -->
            <option v-for="c in props.clases" :key="c._id" :value="c">
              {{ c.nombre }}
            </option>
            <option value="nuevo">+ Agregar Nueva Clase</option>
          </select>
          <div v-if="selectedClase === 'nuevo'" class="nuevo-input">
            <input v-model="nuevoNombreClase" placeholder="Nombre (ej. Violín Básico)">
          </div>
          <br>

          <button @click="confirmarClase">Confirmar Todo</button>
        </div>
        <button @click="closeOptions">Cerrar</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'

// Props que vienen del App.vue
const props = defineProps({
  horarios: { type: Array, default: () => [] },
  profesores: { type: Array, default: () => [] },
  alumnos: { type: Array, default: () => [] },
  clases: { type: Array, default: () => [] },
  onCrearRecurso: Function
})

const emit = defineEmits(["agregar-clase","eliminar-clase", "crear-recurso"])

const days = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"]
const calendar = reactive({})
const message = ref("")
const showOptions = ref(false)
const selectedSlot = ref("")

// Campos seleccionados
const selectedProfesor = ref("")
const selectedAlumno = ref("")
const selectedClase = ref("")

// Variables temporales para nuevos registros
const nuevoNombreProfesor = ref("")
const nuevaEspecialidad = ref("")
const nuevoNombreAlumno = ref("")
const nuevoNombreClase = ref("")

// Slots
const saturdaySlots = computed(() => {
  const slots = []
  let start = new Date(0,0,0,10,0)
  for (let i=0; i<6; i++) {
    const time = new Date(start.getTime() + i*45*60000)
    slots.push(time.toTimeString().slice(0,5))
  }
  return slots
})

const weekdaySlots = computed(() => {
  const slots = []
  let start = new Date(0,0,0,14,30)
  for (let i=0; i<7; i++) {
    const time = new Date(start.getTime() + i*45*60000)
    slots.push(time.toTimeString().slice(0,5))
  }
  return slots
})
 


// Construir calendario usando populate
const construirCalendario = () => {
  if (!props.horarios?.length) return;

  Object.keys(calendar).forEach(key => delete calendar[key]);

  props.horarios.forEach(h => {
    const horaLimpia = h.hora_inicio?.slice(0, 5);
    const dia = h.dia_semana || h.dia;
    if (!horaLimpia || !dia) return;

    const key = `${dia}-${horaLimpia}`;

    // Gracias a populate, ya tenemos objetos completos
    const clase = h.clase_id;
    const profesor = h.profesor_id;
    const alumno = h.alumno_id;

    calendar[key] = {
      _id: h._id,
      texto: `Clase de ${clase?.nombre || 'Clase'} - ${profesor?.nombre || 'Profesor'} (${alumno?.nombre || 'Alumno'})`
    };
  });
};

watch(() => props.horarios, () => {
  construirCalendario();
}, { deep: true });

onMounted(() => {
  construirCalendario();
});

// Funciones
function isSlotBlocked(day, slot) {
  const time = slot.split(':').map(Number);
  const hour = time[0];
  const minute = time[1];
  const totalMinutes = hour * 60 + minute;
  
  // Monday to Friday: 10:00 - 13:45 (600 - 825 minutes)
  if (day !== 'Sábado' && totalMinutes >= 600 && totalMinutes <= 825) {
    return true;
  }
  
  // Saturday: 14:45 - 19:00 (885 - 1140 minutes)
  if (day === 'Sábado' && totalMinutes >= 885 && totalMinutes <= 1140) {
    return true;
  }
  
  return false;
}

function openOptions(day, slot) {
  selectedSlot.value = `${day}-${slot}`
  showOptions.value = true
}
function closeOptions() {
  showOptions.value = false
}

function resetCamposNuevos() {
  nuevoNombreProfesor.value = "";
  nuevaEspecialidad.value = "";
  nuevoNombreAlumno.value = "";
  nuevoNombreClase.value = "";
}

async function confirmarClase() {
  message.value = "Procesando...";

  let profesorId = selectedProfesor.value;
  let alumnoId = selectedAlumno.value;
  let claseId = selectedClase.value;

  if (profesorId === 'nuevo') {
    const res = await props.onCrearRecurso('profesores', { 
      nombre: nuevoNombreProfesor.value, 
      especialidad: nuevaEspecialidad.value 
    });
    if (res) profesorId = res._id;
  }

  if (alumnoId === 'nuevo') {
    const res = await props.onCrearRecurso('alumnos', { 
      nombre: nuevoNombreAlumno.value,
      edad: 10
    });
    if (res) alumnoId = res._id;
  }

  if (claseId === 'nuevo') {
    const res = await props.onCrearRecurso('clases', { 
      nombre: nuevoNombreClase.value,
      descripcion: "Nueva clase agregada desde calendario"
    });
    if (res) claseId = res._id;
  }

  if (!profesorId || !alumnoId || !claseId) {
    message.value = "Error: faltan IDs válidos";
    return;
  }

  const [dia, hora] = selectedSlot.value.split("-");
  const [h, m] = hora.split(':').map(Number);
  const fin = new Date(0, 0, 0, h, m + 45).toTimeString().slice(0, 5);

  const objetoParaAPI = {
    dia_semana: dia,
    hora_inicio: hora,
    hora_fin: fin,
    profesor_id: profesorId,
    alumno_id: alumnoId,
    clase_id: claseId
  }

  try {
    const nuevoHorario = await agregarClase(objetoParaAPI);
    console.log("Respuesta del servidor:", nuevoHorario);

    // Usamos populate en la respuesta del backend
    const clase = nuevoHorario.clase_id;
    const profesor = nuevoHorario.profesor_id;
    const alumno = nuevoHorario.alumno_id;

    calendar[selectedSlot.value] = {
      texto: `Clase de ${clase?.nombre || "Clase"} - ${profesor?.nombre || "Profesor"} (${alumno?.nombre || "Alumno"})`,
      _id: nuevoHorario._id
    };

    resetCamposNuevos();
    closeOptions();
  } catch (error) {
    console.error("Error al guardar horario:", error);
    message.value = "Error al guardar el horario";
  }
}

async function agregarClase(nuevaClase) {
  try {
    console.log('Enviando clase al servidor:', nuevaClase);
    const res = await fetch("http://localhost:3000/horarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaClase)
    });
    const data = await res.json();
    if (!res.ok) {
      alert("Error: " + (data.error || "No se pudo guardar"));
      return;
    }
    emit("agregar-clase", data);
    return data;
  } catch (error) {
    console.error("Error de red:", error);
    alert("No se pudo conectar con el servidor.");
  }
}



async function eliminarClase(id) {
  if (!id) {
    alert("No se encontró el ID de la clase");
    return;
  }

  // Confirmación antes de eliminar
  const seguro = window.confirm("¿Estás seguro de que quieres eliminar esta clase?");
  if (!seguro) {
    message.value = "Eliminación cancelada";
    return;
  }

  console.log("Intentando eliminar horario con id:", id);
  try {
    const res = await fetch(`http://localhost:3000/horarios/${id}`, { method: "DELETE" });
    if (res.ok) {
      delete calendar[selectedSlot.value];
      message.value = "Clase eliminada correctamente";
    } else {
      alert("No se pudo eliminar de la base de datos");
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

</script>



<style scoped>
.container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  flex: 1 1 300px;
}
.calendario {
  flex: 2 1 600px;
}
.asignadas {
  flex: 1 1 300px;
  background: #f9f9f9;
}
.clases {
  flex: 1 1 300px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}
th {
  background: #2c3e50;
  color: #fff;
}
td {
  background: #ecf0f1;
}
td:empty {
  background: #fff;
}
.blocked-slot {
  background: #ffcccc !important;
  color: #666 !important;
  cursor: not-allowed !important;
  font-style: italic;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #ecf0f1;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}
li:hover {
  background: #3498db;
  color: #fff;
}
/* Modal */
.modal {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}
button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #3498;
  color : #fff;
}

.btn-danger:hover {
  background: #800;
  color: #fff;
}

.nuevo-input {
  background: #f0f7ff;
  padding: 10px;
  border-left: 4px solid #3498db;
  margin: 5px 0 15px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.nuevo-input input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
