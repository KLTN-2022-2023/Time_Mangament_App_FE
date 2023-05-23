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
      InComplete: "InComplete",
      Completed: "Completed",
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
  RemindType() {
    return {
      OnStartTime: "On start time",
      FiveMinutes: "Before start time 5 minutes",
      OneDay: "Before start time one day",
      Never: "Never",
      Custom: "Custom",
    };
  },
  ErrorTypeName() {
    return {
      Length: "Name is limited to 30 characters",
      Required: "Name is required",
      Duplicated: "Name is existed",
      SpecialCharacter: "Name cannot contain special characters",
    };
  },
  ErrorTaskName() {
    return {
      Required: "Name is required",
    };
  },
  ErrorTaskType() {
    return {
      Required: "Type is required",
    };
  },
  ErrorRepeat() {
    return {
      EndRepeatPast: "End repeat time is greater than or equal to start time",
      InvalidDayWeek: "Repeat days of week must include start date",
      overlap: "Repeated task is overlapping",
    };
  },
  ErrorRemind() {
    return {
      Past: "Remind time is less than start time and in the future",
    };
  },
  ErrorCompareDate() {
    return {
      GreaterOrEqual: "Due time is greater than start time",
      StartPast: "Start time is greater than or equal to today",
      Overlap: "Tasks is overlapping",
    };
  },
};
