import React from 'react'
import GeneralTable from '../../../Shared/GeneralTable/GeneralTable'

const CastView = () => {
  const columns = [
    { key: 'cast', title: 'CAST' },
    { key: 'talent', title: 'TALENT' },
    { key: 'tScn', title: 'T. SCN.' },
    { key: 'pickup', title: 'PICKUP' },
    { key: 'call', title: 'CALL' },
    { key: 'makeup', title: 'MAKEUP' },
    { key: 'wardrobe', title: 'WARDROBE' },
    { key: 'ready', title: 'READY' },
    { key: 'notes', title: 'NOTES' },
  ]

  const data = [
    { cast: '1. ELOISA', talent: 'ANGELICA RIVERA', tScn: '14', pickup: '--', call: '--', makeup: '--', wardrobe: '--', ready: '--', notes: '' },
    { cast: '2. OCTAVIO', talent: 'IVAN SANCHEZ', tScn: '8', pickup: '--', call: '--', makeup: '--', wardrobe: '--', ready: '--', notes: '' },
    { cast: '6. ANTONIA', talent: 'SOFIA CASTRO', tScn: '2', pickup: '--', call: '--', makeup: '--', wardrobe: '--', ready: '--', notes: '' },
    { cast: '7. MATILDE', talent: 'IVANNA CASTRO', tScn: '3', pickup: '--', call: '--', makeup: '--', wardrobe: '--', ready: '--', notes: '' },
    { cast: '9. LETICIA', talent: 'ILIANA FOX', tScn: '2', pickup: '--', call: '--', makeup: '--', wardrobe: '--', ready: '--', notes: '' },
    { cast: '13. BERNARDO', talent: 'JUAN RIOS CANTU', tScn: '2', pickup: '--', call: '--', makeup: '--', wardrobe: '--', ready: '--', notes: '' },
    { cast: '15. NAYELI', talent: 'LUPITA ORTIZ', tScn: '1', pickup: '--', call: '--', makeup: '--', wardrobe: '--', ready: '--', notes: '' },
  ]

  return (
    <GeneralTable columns={columns} data={data} stickyColumnCount={2} />
  )
}

export default CastView