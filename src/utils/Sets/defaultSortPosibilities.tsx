interface SortPosibility {
  id: string;
  label: string;
  optionKey: string;
  defaultIndex: number;
}

// This object contains the structure to handle the sort options in the Sets and locations
// Default index is used in order to stablish jerarquy in the sort options, that will change using drag and drop


const defaultSortPosibilitiesOrder: SortPosibility[] = [
  {
    id: 'NAME', label: 'Name', optionKey: 'setName', defaultIndex: 0,
  },
  {
    id: 'SCENES_QUANTITY', label: 'Scenes Quantity', optionKey: 'scenesQuantity', defaultIndex: 3,
  },
  {
    id: 'PROTECTION_QUANTITY', label: 'Protection Quantity', optionKey: 'protectionQuantity', defaultIndex: 4,
  },
  {
    id: 'PAGES_SUM', label: 'Pages Sum', optionKey: 'pagesSum', defaultIndex: 5,
  },
  {
    id: 'ESTIMATED_TIME_SUM', label: 'Estimated Time Sum', optionKey: 'estimatedTimeSum', defaultIndex: 6,
  },
  {
    id: 'EPISODES_QUANTITY', label: 'Episodes Quantity', optionKey: 'episodesQuantity', defaultIndex: 7,
  },
  {
    id: 'PARTICIPATION', label: 'Participation', optionKey: 'participation', defaultIndex: 8,
  },
];

export default defaultSortPosibilitiesOrder;