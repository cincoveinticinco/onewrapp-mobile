import { Template, BLANK_PDF } from '@pdfme/common';

const template: Template = {
  basePdf: BLANK_PDF,
  schemas: [
    {
      a: {
        type: 'text',
        position: { x: 16, y: 20 },
        width: 200,
        height: 10,
      },
      b: {
        type: 'text',
        position: { x: 16, y: 30 },
        width: 200,
        height: 10,
      },
      c: {
        type: 'text',
        position: { x: 16, y: 40 },
        width: 200,
        height: 10,
      },
    },
  ],
};

export default template;
