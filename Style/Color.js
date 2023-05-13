// Indigo.300 : #a5b4fc
// Indigo.400 : #818cf8
// Indigo.500 : #6366f1
// Indigo.600 : #4f46e5
// Indigo.700 : #4338ca
// Indigo.800 : #3730a3
// Indigo.900 : #312e81

export default {
  Button() {
    return {
      ButtonInActive: "#818cf8",
      ButtonActive: "#4f46e5",
      Text: "#ffffff",
    };
  },
  Header() {
    return {
      Main: "#3730a3",
      Text: "#ffffff",
    };
  },
  CalendarTask() {
    return {
      Main: "#dbe4ff",
      Done: "#d3f9d8",
      BorderBottom: "#adb5bd",
    };
  },
  Task() {
    return {
      inValid: "#e03131",
      valid: "#818cf8",
      background: "#f1f3f5",
    };
  },
  IconTask() {
    return {
      AllTasks: "#087f5b",
      Important: "#d6336c",
      Incomplete: "#f08c00",
    };
  },
  Input() {
    return {
      Border: "#ced4da",
      label: "#343a40",
      disable: "#adb5bd",
    };
  },
};
