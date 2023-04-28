export default {
  Format() {
    return {
      DateFormat: "yyyy-MM-dd",
      DateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      DateTimeFormatDateFNS: "yyyy-MM-dd HH:mm:ss",
    };
  },
  TaskStatus() {
    return {
      New: "New",
      Done: "Done",
      Late: "Late",
    };
  },
  TaskType() {
    return {
      AllTask: "AllTask",
      Important: "Important",
      MyDay: "MyDay",
      CustomType: "CustomType",
    };
  },
};
