import { ReportedMode, ReportedStatus } from '@/lib/mappings';
import React from 'react'
import ItemcodeTable from './Report/Itemcode';
import DeprivationTable from './Report/Deprivation';
import OverviewTable from './Report/Overview';

type Props = {
    startDate: string;
    endDate: string;
    mode: ReportedMode;
    status: ReportedStatus;
    facultyId: number | undefined;
}

const RenderTable = async ( props : Props ) => {
    const { mode } = props;
    switch (mode) {
        case "N":
            return <ItemcodeTable {...props} />
        case "D":
            return <DeprivationTable {...props} />
        case "O":
            return <OverviewTable {...props} />
        default:
            return <div>Not Found</div>
    }
}

export default RenderTable
