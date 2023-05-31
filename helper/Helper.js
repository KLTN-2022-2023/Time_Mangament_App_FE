import { formatInTimeZone } from "date-fns-tz";
import CommonData from "../CommonData/CommonData";
import { format } from "date-fns";
import viLocale from "date-fns/locale/vi";

export const convertDateTime = (date) => {
  if (!date) {
    return "";
  }

  let dateString = formatInTimeZone(
    date,
    CommonData.Format().TimeZoneFormat,
    CommonData.Format().DateTimeFormatCreate
  );
  return dateString;
};

export const convertMonthYear = (date) => {
  if (date) {
    let result = format(date, "MMMM, yyyy", { locale: viLocale }).toLowerCase();
    let withoutMonth = result.split("tháng")[1];
    return "Tháng" + withoutMonth;
  }
  return "";
};

export const formatDateUI = (dateString) => {
  if (!dateString) {
    return "";
  }
  let list = dateString.split("-");
  return list[2] + "-" + list[1] + "-" + list[0];
};

export const formatDateTask = (showDate) => {
  if (showDate) {
    return (
      format(new Date(showDate), "EE", { locale: viLocale }) +
      ", " +
      format(new Date(showDate), "dd MMMM yyyy", { locale: viLocale })
    );
  }
  return "";
};

export const getMonDaySunDay = (date) => {
  let da = new Date(date.getTime());
  let day = da.getDay(),
    diff = da.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  let monday = new Date(da.setDate(diff));
  let mon = new Date(monday.getTime());
  let sunday = new Date(mon.setDate(mon.getDate() + 6));
  console.log(monday, sunday);
  return {
    monday,
    sunday,
  };
};
