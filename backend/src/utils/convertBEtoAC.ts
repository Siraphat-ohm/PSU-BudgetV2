import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; 
import timezone from 'dayjs/plugin/timezone'; 
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.extend(utc);
dayjs.extend(timezone); 
dayjs.extend(buddhistEra);

export default function convertIsoBEtoAD(isoDateString: string): string {
  const buddhistDate = dayjs.utc(isoDateString);

  const zonedDate = buddhistDate.tz('Asia/Bangkok');

  const commonEraYear = zonedDate.year() - 543;

  return zonedDate.year(commonEraYear).toISOString();
}