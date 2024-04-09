'use client';
import ApiAuth from "@/_lib/hook/ApiAuth";
import { DisbursedItem, Faculty, FiscalYear, Item, Plan, Product, itemType } from "@/_schema/excel";
import { Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import * as xlsx from "xlsx";



export default function ImportPage() {
    const [dataExcel, setDataExcel] = useState<any[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [selectedFile, setSelectedFiled] = useState<File>();

    const {
        handleSubmit,
        formState: { errors },
    } = useForm({});

    const onSubmit = async (data: any) => {
        try {
            let res;
            switch (selectedTable) {
                case "1":
                    res = await ApiAuth.post(`/tables/items`, dataExcel);
                    break;
                case "2":
                    res = await ApiAuth.post(`/tables/faculties`, dataExcel);
                    break;
                case "3":
                    res = await ApiAuth.post(`/tables/itemTypes`, dataExcel);
                    break;
                case "4":
                    res = await ApiAuth.post(`/tables/products`, dataExcel);
                    break;
                case "5":
                    res = await ApiAuth.post(`/tables/disburedItems`, dataExcel);
                    break;
                case "6":
                    res = await ApiAuth.post(`/tables/fiscalYears`, dataExcel);
                    break;
                case "7":
                    res = await ApiAuth.post(`/tables/plans`, dataExcel);
                    break;
                default:
                    throw Error("T-T")
            }
            toast.success(res?.data.message);
        } catch (error) {
            let message;
            if (error instanceof AxiosError) {
                message = error.response?.data.message
                toast.error(message);
            } else {
                throw new Error("Unexpected API Error")
            }
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = await e.target.files?.[0];
        if (file) {
            setSelectedFiled(file)
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = event.target?.result;
                const workbook = xlsx.read(data, { type: 'binary' });

                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = xlsx.utils.sheet_to_json(worksheet) as any[];
                setDataExcel(jsonData);

            };

            reader.readAsBinaryString(file);
        }

    };

    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTable(e.target.value);
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="bg-white rounded-md p-6">
                <form className="grid grid-cols-1  border rounded-md p-6 bg-white" onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-4xl font-semibold mb-4"> Import Data </h1>
                    <div className="flex gap-4 mb-4">
                        <div className="flex flex-col gap-4 mb-4 items-center">
                            <label htmlFor="fileInput" className="cursor-pointer bg-primary text-secondary px-4 py-2 rounded-md shadow-md">
                                Choose File
                            </label>
                            <input
                                type="file"
                                id="fileInput"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <span className="text-gray-500">{selectedFile ? selectedFile.name : "No file chosen"}</span>
                        </div>
                        <Select
                            className="w-[10rem]"
                            label="Tables"
                            selectionMode="single"
                            placeholder="Select a Tables"
                            selectedKeys={selectedTable ? [selectedTable] : []}
                            onChange={handleSelectionChange}
                        >
                            {[
                                { id: "1", name: "Items" },
                                { id: "2", name: "Faculties" },
                                { id: "3", name: "Item Types" },
                                { id: "4", name: "Products" },
                                { id: "5", name: "Disbursed Items" },
                                { id: "6", name: "Fiscal Years" },
                                { id: "7", name: "Plans" }
                            ].map(table => (
                                <SelectItem key={table.id} value={table.id}>
                                    {table.name}
                                </SelectItem>
                            ))
                            }
                        </Select>
                    </div>
                    <div>
                        {dataExcel.length > 0 && selectedTable === "1" &&
                            <Table>
                                <TableHeader>
                                    <TableColumn>code</TableColumn>
                                    <TableColumn>name</TableColumn>
                                    <TableColumn>totalAmount</TableColumn>
                                    <TableColumn>balance</TableColumn>
                                    <TableColumn>status</TableColumn>
                                    <TableColumn>facultyId</TableColumn>
                                    <TableColumn>productId</TableColumn>
                                    <TableColumn>typeId</TableColumn>
                                    <TableColumn>fiscalYearId</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No rows to display.">
                                    {(dataExcel as Item[]).map((item, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{item.code}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.totalAmount}</TableCell>
                                                <TableCell>{item.balance}</TableCell>
                                                <TableCell>{item.status}</TableCell>
                                                <TableCell>{item.facultyId}</TableCell>
                                                <TableCell>{item.productId}</TableCell>
                                                <TableCell>{item.typeId}</TableCell>
                                                <TableCell>{item.fiscalYearId}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>}
                        {dataExcel.length > 0 && selectedTable == "2" &&
                            <Table>
                                <TableHeader>
                                    <TableColumn>id</TableColumn>
                                    <TableColumn>name</TableColumn>
                                    <TableColumn>userId</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No rows to display.">
                                    {(dataExcel as Faculty[]).map((item, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.userId ?? '-'}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        }
                        {dataExcel.length > 0 && selectedTable == "3" &&
                            <Table>
                                <TableHeader>
                                    <TableColumn>id</TableColumn>
                                    <TableColumn>name</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No rows to display.">
                                    {(dataExcel as itemType[]).map((item, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        }
                        {dataExcel.length > 0 && selectedTable == "4" &&
                            <Table>
                                <TableHeader>
                                    <TableColumn>id</TableColumn>
                                    <TableColumn>name</TableColumn>
                                    <TableColumn>planId</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No rows to display.">
                                    {(dataExcel as Product[]).map((item, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.planId}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        }
                        {dataExcel.length > 0 && selectedTable == "5" &&
                            <Table>
                                <TableHeader>
                                    <TableColumn>id</TableColumn>
                                    <TableColumn>itemcode</TableColumn>
                                    <TableColumn>psuCode</TableColumn>
                                    <TableColumn>withdrawalAmount</TableColumn>
                                    <TableColumn>userId</TableColumn>
                                    <TableColumn>date</TableColumn>
                                    <TableColumn>note
                                    </TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No rows to display.">
                                    {(dataExcel as DisbursedItem[]).map((item, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.itemcode}</TableCell>
                                                <TableCell>{item.psuCode}</TableCell>
                                                <TableCell>{item.withdrawalAmount}</TableCell>
                                                <TableCell>{item.userId}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell>{item.note}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        }
                        {dataExcel.length > 0 && selectedTable == "6" &&
                            <Table>
                                <TableHeader>
                                    <TableColumn>id</TableColumn>
                                    <TableColumn>name</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No rows to display.">
                                    {(dataExcel as FiscalYear[]).map((item, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        }
                        {dataExcel.length > 0 && selectedTable == "7" &&
                            <Table>
                                <TableHeader>
                                    <TableColumn>id</TableColumn>
                                    <TableColumn>name</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No rows to display.">
                                    {(dataExcel as Plan[]).map((item, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{item.id}</TableCell>
                                                <TableCell>{item.name}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        }
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className="bg-primary text-secondary px-4 py-2 mt-4"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}