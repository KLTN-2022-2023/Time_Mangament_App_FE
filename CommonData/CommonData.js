export default {
  Format() {
    return {
      DateFormat: "yyyy-MM-dd",
      DateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      DateTimeFormatDateFNS: "yyyy-MM-dd HH:mm:ss",
      DateTimeFormatCreate: "yyyy-MM-dd HH:mm",
      TimeZoneFormat: "Asia/Ho_Chi_Minh",
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
  RepeatType() {
    return {
      Daily: "Daily",
      Weekly: "Weekly",
      Monthly: "Monthly",
      Yearly: "Yearly",
      Custom: "Custom",
      Never: "Never",
    };
  },
};
