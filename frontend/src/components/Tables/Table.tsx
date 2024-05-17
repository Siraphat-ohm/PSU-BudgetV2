import TableCellWithBorder from "@/components/misc/TableCell";
import { Table, TableHead, TableBody, TableRow } from "@mui/material";
import { DeleteButton } from "../Buttons/DeletButton";

interface TableColumn {
    key: string;
    label: string;
    component?: React.FC<{ row: TableData }>;
}

interface TableData {
    [key: string]: any;
}

interface GenericTableProps {
    columns: TableColumn[];
    data: TableData[];
}

const GenericTable: React.FC<GenericTableProps> = ({ columns, data }) => {
    return (
        <Table className="mt-3">
            <TableHead>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableCellWithBorder key={index}>{column.label}</TableCellWithBorder>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columns.map((column, colIndex) => (
                            <TableCellWithBorder key={colIndex}>
                                {column.component ? <column.component row={row} /> : row[column.key]}
                            </TableCellWithBorder>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export const DisItemTable: React.FC<{ disItems?: TableData[] }> = ({ disItems }) => {
    console.log(disItems);
    
    const columns: TableColumn[] = [
        { key: "id", label: "id*" },
        { key: "codeId", label: "codeId*" },
        { key: "psuCode", label: "psuCode*" },
        { key: "withdrawalAmount", label: "withdrawalAmount*" },
        { key: "userId", label: "userId*" },
        { key: "date", label: "date*" },
        { key: "note", label: "note*" },
        { key: "actions", label: "actions",
            component: ({ row }) => (
                <DeleteButton item={row} path="disItems" />
            )
        }
    ];
    return <GenericTable columns={columns} data={disItems || []} />;
};

export const FacultyTable: React.FC<{ faculties?: TableData[] }> = ({ faculties }) => {
    const columns: TableColumn[] = [
        { key: "id", label: "id*" },
        { key: "name", label: "name*" },
        { key: "userId", label: "userId?" },
        { key: "actions", label: "actions",
            component: ({ row }) => (
                <DeleteButton item={row} path="faculties" />
            )
         }
    ];
    return <GenericTable columns={columns} data={faculties || []} />;
}

export const ItemcodeTable: React.FC<{ itemcodes?: TableData[] }> = ({ itemcodes }) => {
    const columns: TableColumn[] = [
        { key: "id", label: "id*" },
        { key: "code", label: "code*" },
        { key: "name", label: "name*" },
        { key: "totalAmount", label: "totalAmount*" },
        { key: "balance", label: "balance*" },
        { key: "facultyId", label: "facultyId*" },
        { key: "productId", label: "productId*" },
        { key: "typeId", label: "typeId*"},
        { key: "fiscalYearId", label: "fiscalYearId*" },
        { key: "status", label: "status*" },
        { key: "actions", label: "actions",
            component: ({ row }) => (
                <DeleteButton item={row} path="itemcodes" />
            )
         }
    ];
    
    return <GenericTable columns={columns} data={itemcodes || []} />;
}

export const ProductTable: React.FC<{ products?: TableData[] }> = ({ products }) => {
    const columns: TableColumn[] = [
        { key: "id", label: "id*" },
        { key: "name", label: "name*" },
        { key: "planId", label: "planId*" },
        { key: "actions", label: "actions",
            component: ({ row }) => (
                <DeleteButton item={row} path="products" />
            )
         }
    ];
    return <GenericTable columns={columns} data={products || []} />;
}

export const ItemTypeTable: React.FC<{ itemTypes?: TableData[] }> = ({ itemTypes }) => {
    const colums: TableColumn[] = [
        { key: "id", label: "id*" },
        { key: "name", label: "name*"},
        { key: "actions", label: "actions",
            component: ({ row }) => (
                <DeleteButton item={row} path="itemTypes" />
            )
         }
    ]
    return <GenericTable columns={colums} data={itemTypes || []} />
}

export const FiscalYearTable: React.FC<{ ficalYears?: TableData[]  }> = ({ ficalYears }) => {
    const colums: TableColumn[] = [
        { key: "id", label: "id*" },
        { key: "name", label: "name*"},
        { key: "actions", label: "actions",
            component: ({ row }) => (
                <DeleteButton item={row} path="fiscal-years" />
            )
         }
    ]
    
    return <GenericTable columns={colums} data={ficalYears || []} />
}

export const PlanTable: React.FC<{ plans?: TableData[]  }> = ({ plans }) => {
    const colums: TableColumn[] = [
        { key: "id", label: "id*" },
        { key: "name", label: "name*"},
        { key: "actions", label: "actions",
            component: ({ row }) => (
                <DeleteButton item={row} path="plans" />
            )
         }
    ]
    
    return <GenericTable columns={colums} data={plans || []} />
}