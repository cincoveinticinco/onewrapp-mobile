import { Column } from "../../../../Shared/GeneralTable/GeneralTable";

export   const castColumns: Column[] = [
    {
      key: 'cast', title: 'CAST', type: 'double-data', textAlign: 'left', secondaryKey: 'name', minWidth: 250, maxWidth: 250, sticky: true
    },
    {
      key: 'tScn', title: 'SCN.', type: 'text', notShowWhenEdit: true,
    },
    {
      key: 'pickUp', title: 'PICKUP', type: 'hour', editable: true,
    },
    {
      key: 'callTime', title: 'CALL', type: 'hour', editable: true,
    },
    {
      key: 'onMakeUp', title: 'MAKEUP', type: 'hour', editable: true,
    },
    {
      key: 'onWardrobe', title: 'WARDROBE', type: 'hour', editable: true,
    },
    {
      key: 'readyToShoot', title: 'READY AT', type: 'hour', editable: true,
    },
    {
      key: 'arrived', title: 'ARRIVED', type: 'hour', editable: true
    },
    {
      key: 'onProsthetic', title: 'ON PROSTHETIC', type: 'hour', editable: true
    },
    {
      key: 'outProsthetic', title: 'OUT PROSTHETIC', type: 'hour', editable: true
    },
    {
      key: 'startProcesses', title: 'START PROCESSES', type: 'hour', editable: true
    },
    {
      key: 'endProcesses', title: 'END PROCESSES', type: 'hour', editable: true
    },
    {
      key: 'wrap', title: 'WRAP', type: 'hour', editable: true,
    },
    {
      key: 'wrapSet', title: 'WRAP SET', type: 'hour', editable: true,
    },
    {
      key: 'mealIn', title: '1 MEAL IN', type: 'hour', editable: true,
    },
    {
      key: 'mealOut', title: '1 MEAL OUT', type: 'hour', editable: true,
    },
    {
      key: 'mealExtraIn', title: '2 MEAL IN', type: 'hour', editable: true,
    },
    {
      key: 'mealExtraOut', title: '2 MEAL OUT', type: 'hour', editable: true,
    },
    {
      key: 'notes', title: 'NOTES', type: 'text', editable: true,
    },
  ];