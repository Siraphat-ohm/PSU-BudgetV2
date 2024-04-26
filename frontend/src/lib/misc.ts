import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend( buddhistEra );

export const convertToBE = ( date: string ) => dayjs(date).format( 'DD/MM/BBBB');

export const displayNumber = (n: number) => {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

