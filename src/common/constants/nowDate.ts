import { format } from "date-fns";

export function currentTime(): string {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
  return formattedDate;
}
