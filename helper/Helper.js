import { formatInTimeZone } from "date-fns-tz";
import CommonData from "../CommonData/CommonData";

export const convertDateTime = (date) => {
  let dateString = formatInTimeZone(
    date,
    CommonData.Format().TimeZoneFormat,
    CommonData.Format().DateTimeFormatCreate
  );
  return dateString;
};

export const formatDateUI = (dateString) => {
  if (!dateString) {
    return "";
  }
  let list = dateString.split("-");
  return list[2] + "-" + list[1] + "-" + list[0];
};
