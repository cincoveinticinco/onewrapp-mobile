import { RxJsonSchema, toTypedRxJsonSchema } from 'rxdb';
import environment from '../../../environment';
import { ShootingSceneStatusEnumArray, ShootingStatusEnumArray } from '../../Shared/ennums/ennums';
import DatabaseSchema from '../database_schema';
import { ShootingDocType } from '../../Shared/types/shooting.types';

const shootingSchemaLiteral= {
  title: 'shooting schema',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 250,
    },
    projectId: {
      type: ['number', 'null'],
    },
    unitId: {
      type: 'number',
    },
    unitNumber: {
      type: 'number',
    },
    shootDate: {
      type: ['string', 'null'],
    },
    generalCall: {
      type: ['string', 'null'],
    },
    onSet: {
      type: ['string', 'null'],
    },
    estimatedWrap: {
      type: ['string', 'null'],
    },
    firstShoot: {
      type: ['string', 'null'],
    },
    wrap: {
      type: ['string', 'null'],
    },
    lastOut: {
      type: ['string', 'null'],
    },
    status: {
      type: 'number',
      enum: ShootingStatusEnumArray,
    },
    isTest: {
      type: 'boolean',
    },
    createdAt: {
      type: 'string',
    },
    createdAtBack: {
      type: ['string', 'null'],
    },
    updatedAt: {
      type: 'string',
    },
    banners: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: ['string', 'null'],
            maxLength: 250,
          },
          shootingId: {
            type: 'number',
          },
          description: {
            type: 'string',
          },
          position: {
            type: 'number',
          },
          createdAt: {
            type: 'string',
          },
          updatedAt: {
            type: 'string',
          },
        },
      },
    },
    scenes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: ['string', 'null'],
            maxLength: 250
          },
          projectId: {
            type: 'number',
          },
          shootingId: {
            type: 'number',
          },
          sceneId: {
            type: 'string',
          },
          status: {
            type: 'number',
            enum: ShootingSceneStatusEnumArray,
          },
          position: {
            type: ['number', 'null'],
          },
          rehearsalStart: {
            type: ['string', 'null'],
          },
          rehearsalEnd: {
            type: ['string', 'null'],
          },
          startShooting: {
            type: ['string', 'null'],
          },
          endShooting: {
            type: ['string', 'null'],
          },
          producedSeconds: {
            type: ['number', 'null'],
          },
          setups: {
            type: ['number', 'null'],
          },
          partiality: {
            type: ['boolean', 'null'],
          },
          comment: {
            type: ['string', 'null'],
          },
          protectionTypeId: {
            type: ['number', 'null'],
          },
          createdAt: {
            type: 'string',
          },
          updatedAt: {
            type: 'string',
          },
        },
      },
    },
    locations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          locationTypeId: { type: 'number' },
          locationName: { type: 'string' },
          locationAddress: { type: 'string' },
          locationPostalCode: { type: ['string', 'null'] },
          lat: { type: ['string', 'null'] },
          lng: { type: ['string', 'null'] },
        },
      },
    },
    hospitals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          locationTypeId: { type: 'number' },
          locationName: { type: 'string' },
          locationAddress: { type: 'string' },
          locationPostalCode: { type: ['string', 'null'] },
          lat: { type: ['string', 'null'] },
          lng: { type: ['string', 'null'] },
        },
      },
    },
    meals: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            maxLength: 250,
          },
          shootingId: {
            type: 'number',
          },
          projMealId: {
            type: 'number',
          },
          quantity: {
            type: 'number',
          },
          readyAt: {
            type: ['string', 'null'],
          },
          endTime: {
            type: ['string', 'null'],
          },
          mealId: {
            type: 'number',
          },
          meal: {
            type: 'string',
          }
        }
      }
    },
    services: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          description: {
            type: ['string', 'null'],
          },
          providerName: {
            type: ['string', 'null'],
          },
          providerId: {
            type: ['number', 'null'],
          },
          quantity: {
            type: ['string', 'null'],
          },
          unitCost: {
            type: ['string', 'null'],
          },
          tax: {
            type: ['string', 'null'],
          },
          retention: {
            type: ['string', 'null'],
          },
          aiuUtility: {
            type: ['number', 'null'],
          },
          aiuPercent: {
            type: ['number', 'null'],
          },
          aiuValue: {
            type: ['number', 'null'],
          },
          totalCost: {
            type: ['number', 'null'],
          },
          files: {
            type: ['number', 'null'],
          },
          observations: {
            type: ['string', 'null'],
          },
          prServiceTypeId: {
            type: ['number'],
          },
        },
        required: ['description', 'providerName', 'providerId', 'quantity', 'unitCost', 'totalCost', 'files'], // Puedes ajustar los campos requeridos según tus necesidades
      },
    },
    advanceCalls: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: ['string', 'null', 'number'] },
          shooting_id: { type: 'number' },
          department_id: { type: 'number' },
          adv_pick_up: { type: ['string', 'null'] },
          adv_call_time: { type: ['string', 'null'] },
          adv_wrap: { type: ['string', 'null'] },
          description: { type: ['string', 'null'] },
          created_at: { type: ['string', 'null'] },
          updated_at: { type: ['string', 'null'] },
          dep_name_eng: { type: ['string', 'null'] },
          dep_name_esp: { type: ['string', 'null'] },
        },
      },
    },
    castCalls: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: ['string', 'null'],
            maxLength: 250,
          },
          projectCastId: {
            type: 'number',
          },
          shootingId: {
            type: 'number',
          },
          pickUp: {
            type: ['string', 'null'],
          },
          callTime: {
            type: ['string', 'null'],
          },
          onMakeUp: {
            type: ['string', 'null'],
          },
          onWardrobe: {
            type: ['string', 'null'],
          },
          readyToShoot: {
            type: ['string', 'null'],
          },
          arrived: {
            type: ['string', 'null'],
          },
          wrap: {
            type: ['string', 'null'],
          },
          startProcesses: {
            type: ['string', 'null'],
          },
          wrapSet: {
            type: ['string', 'null'],
          },
          dropOff: {
            type: ['string', 'null'],
          },
          onProsthetic: {
            type: ['string', 'null']
          },
          outProsthetic: {
            type: ['string', 'null']
          },
          mealIn: {
            type: ['string', 'null'],
          },
          mealOut: {
            type: ['string', 'null'],
          },
          mealExtraIn: {
            type: ['string', 'null'],
          },
          mealExtraOut: {
            type: ['string', 'null'],
          },
          castName: {
            type: ['string', 'null'],
          },
          castNumber: {
            type: ['string', 'null'],
          },
          notes: {
            type: ['string', 'null'],
          },
          castCategory: {
            type: ['string', 'null'],
          },
          castCategoryId: {
            type: ['number', 'null'],
          },
          createdAt: {
            type: 'string',
          },
          updatedAt: {
            type: 'string',
          },
        },
      },
    },
    extraCalls: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          shootingId: {
            type: 'number',
          },
          projExtraId: {
            type: 'number',
          },
          pickUp: {
            type: ['string', 'null'],
          },
          callTime: {
            type: ['string', 'null'],
          },
          onMakeUp: {
            type: ['string', 'null'],
          },
          onWardrobe: {
            type: ['string', 'null'],
          },
          readyToShoot: {
            type: ['string', 'null'],
          },
          arrived: {
            type: ['string', 'null'],
          },
          wrap: {
            type: ['string', 'null'],
          },
          quantity: {
            type: ['number', 'null'],
          },
          extraName: {
            type: ['string', 'null'],
          },
          talentAgency: {
            type: ['string', 'null'],
          },
          notes: {
            type: ['string', 'null'],
          },
          createdAt: {
            type: 'string',
          },
          updatedAt: {
            type: 'string',
          },
        },
      },
    },
    crewCalls: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: ['string', 'null'],
          },
          visible: {
            type: ['boolean', 'null'],
          },
          name: {
            type: ['string', 'null'],
          },
          departmentEsp: {
            type: ['string', 'null'],
          },
          departmentEng: {
            type: ['string', 'null'],
          },
          position: {
            type: ['string', 'null'],
          },
          call: {
            type: ['string', 'null'],
          },
          callPlace: {
            type: ['string', 'null'],
          },
          wrap: {
            type: ['string', 'null'],
          },
          onCall: {
            type: ['boolean', 'null'],
          },
          projCrewId: {
            type: ['number', 'null'],
          }
        },
        required: [], // No required fields since all can be null
        additionalProperties: false
      },
    },
    pictureCars: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            maxLength: 250,
          },
          pictureCarId: {
            type: 'number',
          },
          quantity: {
            type: 'number',
          },
          pictureCarName: {
            type: 'string',
          },
          callTime: {
            type: 'string',
          },
        },
      },
    },
    otherCalls: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            maxLength: 250,
          },
          callTime: {
            type: 'string',
          },
          otherCallId: {
            type: 'number',
          },
          quantity: {
            type: 'number',
          },
          otherCallName: {
            type: 'string',
          },
        },
      },
    },
  },
  required: ['projectId', 'unitId', 'scenes'],
} as const;

export const shootingSchemaTyped = toTypedRxJsonSchema(shootingSchemaLiteral);
export const shootingSchema: RxJsonSchema<ShootingDocType> = shootingSchemaLiteral;

const shootingSchemaInput = {
  shootings: {
    schema: shootingSchema,
    checkpointFields: [
      'id',
      'updatedAt',
      'previousProjectId',
    ],
    deletedField: 'deleted',
  },
};

export default class ShootingsSchema extends DatabaseSchema {
  static schemaName = 'shootings';

  static endpointPullName = environment.SHOOTINGS_ENDPOINT_PULL;

  static endpointPushName = environment.SHOOTINGS_ENDPOINT_PUSH;

  getEndpointPullName() {
    return ShootingsSchema.endpointPullName;
  }

  getEndpointPushName() {
    return ShootingsSchema.endpointPushName;
  }

  getSchemaName() {
    return ShootingsSchema.schemaName;
  }

  constructor() {
    const { schemaName } = ShootingsSchema;
    const schemaInput = shootingSchemaInput;
    super(schemaName, schemaInput);
  }
}
