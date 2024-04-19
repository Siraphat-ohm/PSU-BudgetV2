// fileUtils.ts
import { createValidator } from "zod-xlsx";
import * as XLSX from 'xlsx';
import { IHeaderMappings } from "@/interfaces/table";

export async function processFile(file: File, table: string, headerMappings: IHeaderMappings) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    return new Promise<any[]>((resolve, reject) => {
        reader.onload = (event) => {
            try {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                const validator = createValidator(workbook);
                const { invalid, valid } = validator.validate(headerMappings[table]);

                if (invalid.length > 0) {
                    console.log(invalid);
                    
                    reject(new Error("Please check your file headers"));
                } else {
                    resolve(valid.map((val: any) => val.data));
                }
            } catch (error) {
                reject(error);
            }
        };
    });
}