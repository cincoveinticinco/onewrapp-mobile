import { Column } from "../../../Shared/Components/tables/GeneralTable/GeneralTable";

 const TableColumns: Column[] = [
    {
      key: 'name',
      title: 'Name',
      sticky: true,
      type: 'text',
      textAlign: 'left',
    },
    {
      key: 'statusString',
      title: 'Status',
      type: 'text',
      textAlign: 'center'
    },
    {
      key: 'startDate',
      title: 'Date',
      type: 'text',
      textAlign: 'center'
    },
    {
      key: 'totalScenes',
      title: 'Scenes',
      type: 'number',
      textAlign: 'center'
    },
    {
      key: 'totalWeeks',
      title: 'Weeks',
      type: 'number',
      textAlign: 'center'
    },
    {
      key: 'totalDays',
      title: 'Days',
      type: 'number',
      textAlign: 'center'
    },
    {
      key: 'totalShootingDays',
      title: 'Shooting Days',
      type: 'number',
      textAlign: 'center'
    },
  ];

  export default TableColumns;