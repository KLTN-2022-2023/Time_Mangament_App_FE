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
      Daily: "Hằng ngày",
      Weekly: "Hăng tuần",
      Monthly: "Hằng tháng",
      Yearly: "Hằng năm",
      Custom: "Tùy chọn",
      Never: "Không",
    };
  },
  RemindType() {
    return {
      OnStartTime: "Khi bắt đầu",
      FiveMinutes: "Trước khi bắt đầu 5 phút",
      OneDay: "Trước khi bắt đầu 1 ngày",
      Never: "Không",
      Custom: "Tùy chỉnh",
    };
  },
  ErrorTypeName() {
    return {
      Length: "Tên có tối đa 30 ký tự",
      Required: "Bắt buộc nhập tên",
      Duplicated: "Tên đã tồn tại",
      SpecialCharacter: "Tên không được chứa ký tự đặc biệt",
    };
  },
  ErrorTaskName() {
    return {
      Required: "Bắt buộc nhập tên",
    };
  },
  ErrorTaskType() {
    return {
      Required: "Bắt buộc chọn loại",
    };
  },
  ErrorRepeat() {
    return {
      EndRepeatPast:
        "Thời gian ngừng lặp phải lớn hơn hoặc bằng thời gian bắt đầu",
      InvalidDayWeek: "Ngày lặp trong tuận phải bao gồm ngày bắt đầu",
      overlap: "Thời gian công việc lặp lại đang bị chồng lên công việc khác",
    };
  },
  ErrorRemind() {
    return {
      Past: "Thời gian nhắc nhở phải nhỏ hơn thời gian bắt đầu và nằm ở tương lai",
    };
  },
  ErrorCompareDate() {
    return {
      GreaterOrEqual: "Thời gian hoàn thành lớn hơn thời gian bắt đầu",
      StartPast: "Thời gian bắt đầu lớn hơn hoặc bằng thời gian hiện tại",
      Overlap: "Thời gian của công việc đang bị chồng lên công việc khác",
    };
  },
};
