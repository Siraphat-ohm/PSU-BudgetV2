import { type NextRequest } from "next/server"
import * as XLSX from 'xlsx'

// For loading example data 
import { promises as fs } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: { mode: string } }
) {

    // Check auth & permission here

    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get('format')

    try {
        const { mode } = params

        console.log(mode);
        

        if (!mode) throw new Error('mode required')

        // const file = await fs.readFile(process.cwd() + '/example-data/data.json', 'utf8');
        // const jsonTableData = JSON.parse(file);

        // // console.log(jsonTableData)



        // const worksheet = XLSX.utils.json_to_sheet(jsonTableData)
        // else if (format === 'xlsx') {
        //     const workbook = XLSX.utils.book_new()

        //     XLSX.utils.book_append_sheet(workbook, worksheet, "MySheet")

        //     const buf = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
        return new Response( "ok" )

            // return new Response(buf, {
            //     status: 200,
            //     headers: {
            //         'Content-Disposition': `attachment; filename="fuck.xlsx"`,
            //         'Content-Type': 'application/vnd.ms-excel',
            //     }
            //k})
    } catch (e) {
        if (e instanceof Error) {
            console.error(e)
            return new Response(e.message, {
                status: 400,
            })
        }
    }
}