/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest'
import { createApp } from '../../app'
import { knexTestClient, test_run_history_table, test_schema, test_table } from '../../test/setup'

const app = createApp()

const mockCreateDataProfileProps: any = {
  profile_name: 'Profile1',
  table_name: 'Table1',
  schema: 'public',
  profile_def: {
    schema: 'public',
    columnDef: {
      indexColumns: [
        {
          notNull: true,
          regex: null,
          dataType: 'VARCHAR',
          isPrimary: true,
          columnName: 'empId',
          references: null,
          defaultValue: null,
          maxAllowedChars: 10
        },
        {
          notNull: true,
          regex: null,
          dataType: 'VARCHAR',
          isPrimary: false,
          columnName: 'firstName',
          references: null,
          defaultValue: null,
          maxAllowedChars: 16
        },
        {
          notNull: true,
          regex: null,
          dataType: 'VARCHAR',
          isPrimary: false,
          columnName: 'lastName',
          references: null,
          defaultValue: null,
          maxAllowedChars: 16
        },
        {
          notNull: false,
          dataType: 'DATE',
          isPrimary: false,
          columnName: 'dateOfJoining',
          references: null,
          defaultValue: '2023-12-20',
          maxAllowedChars: null
        }
      ],
      regularColumns: [
        {
          notNull: true,
          regex: null,
          dataType: 'TIMESTAMP',
          isUnique: false,
          columnName: 'dateOfBirth',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          regex: null,
          dataType: 'TIMESTAMP_TZ',
          isUnique: false,
          columnName: 'profileUpdatedAt',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          regex: null,
          dataType: 'INT',
          isUnique: true,
          columnName: 'contactNo',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: false,
          dataType: 'CHAR',
          isUnique: true,
          columnName: 'gender',
          references: null,
          defaultValue: 'M',
          maxAllowedChars: 1
        },
        {
          notNull: true,
          regex: null,
          dataType: 'INT',
          isUnique: true,
          columnName: 'age',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          regex: null,
          dataType: 'NUMERIC',
          isUnique: true,
          columnName: 'salary',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          regex: null,
          dataType: 'INT',
          isUnique: true,
          columnName: 'bonus',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          regex: null,
          dataType: 'INT',
          isUnique: true,
          columnName: 'increment',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          regex: null,
          dataType: 'VARCHAR',
          isUnique: true,
          columnName: 'reportsTo',
          references: null,
          defaultValue: null,
          maxAllowedChars: 45
        }
      ],
      derivedColumns: [
        {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'fullName',
          maxAllowedChars: 45,
          operation: 'CONCATENATE',
          onValue: null,
          onColumns: ['firstName', 'lastName']
        },
        {
          notNull: true,
          dataType: 'NUMERIC',
          columnName: 'anyColName2',
          maxAllowedChars: null,
          operation: 'SUM',
          onValue: null,
          onColumns: ['salary', 'age']
        },
        {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'anyColName3',
          maxAllowedChars: 45,
          operation: 'CONCATENATE',
          onValue: null,
          onColumns: ['firstName']
        },
        {
          notNull: true,
          dataType: 'INT',
          columnName: 'anyColName4',
          maxAllowedChars: null,
          operation: 'SUM',
          onValue: 45,
          onColumns: ['age']
        }
      ]
    }
  },
  target_connection_id: 1001
}

const validMockCreateDataProfileProps = JSON.parse(JSON.stringify(mockCreateDataProfileProps))

const mockUpdateDataProfileProps: any = {
  profile_id: 1,
  profile_name: 'ProfileUpdatedNew',
  profile_def: {
    columnDef: {
      indexColumns: [
        {
          notNull: true,
          dataType: 'VARCHAR',
          isPrimary: true,
          columnName: 'empId',
          references: null,
          defaultValue: null,
          maxAllowedChars: 10
        },
        {
          notNull: true,
          dataType: 'VARCHAR',
          isPrimary: false,
          columnName: 'firstName',
          references: null,
          defaultValue: null,
          maxAllowedChars: 16
        },
        {
          notNull: true,
          dataType: 'VARCHAR',
          isPrimary: false,
          columnName: 'lastName',
          references: null,
          defaultValue: null,
          maxAllowedChars: 16
        },
        {
          notNull: false,
          dataType: 'DATE',
          isPrimary: false,
          columnName: 'dateOfJoining',
          references: null,
          defaultValue: '2023-12-20',
          maxAllowedChars: null
        }
      ],
      regularColumns: [
        {
          notNull: true,
          dataType: 'DATE',
          isUnique: false,
          columnName: 'dateOfBirth',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          dataType: 'INT',
          isUnique: true,
          columnName: 'contactNo',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: false,
          dataType: 'CHAR',
          isUnique: true,
          columnName: 'gender',
          references: null,
          defaultValue: 'M',
          maxAllowedChars: 1
        },
        {
          notNull: true,
          dataType: 'INT',
          isUnique: true,
          columnName: 'age',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          dataType: 'NUMERIC',
          isUnique: true,
          columnName: 'salary',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          dataType: 'TIMESTAMP_TZ',
          isUnique: false,
          columnName: 'profileUpdatedAt',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          dataType: 'INT',
          isUnique: true,
          columnName: 'bonus',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          dataType: 'INT',
          isUnique: true,
          columnName: 'increment',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        },
        {
          notNull: true,
          dataType: 'VARCHAR',
          isUnique: true,
          columnName: 'reportsTo',
          references: null,
          defaultValue: null,
          maxAllowedChars: 45
        }
      ],
      derivedColumns: [
        {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'fullName',
          maxAllowedChars: 45,
          operation: 'CONCATENATE',
          onValue: null,
          onColumns: ['firstName', 'lastName']
        },
        {
          notNull: true,
          dataType: 'NUMERIC',
          columnName: 'anyColName2',
          maxAllowedChars: null,
          operation: 'SUM',
          onValue: null,
          onColumns: ['salary', 'age']
        },
        {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'anyColName3',
          maxAllowedChars: 45,
          operation: 'CONCATENATE',
          onValue: null,
          onColumns: ['firstName']
        },
        {
          notNull: true,
          dataType: 'NUMERIC',
          columnName: 'anyColName1',
          maxAllowedChars: null,
          operation: 'MOD',
          onValue: null,
          onColumns: ['age', 'bonus']
        }
      ]
    }
  },
  version: 0
}

const validMockUpdateDataProfileProps = JSON.parse(JSON.stringify(mockUpdateDataProfileProps))

const createProfiles = async (profiles: { profile_name: string; table_name: string }[]) => {
  for (const profileData of profiles) {
    await request(app)
      .post('/api/v1/data-profile')
      .send({ ...validMockCreateDataProfileProps, ...profileData })
      .expect(200)
  }
}

const getProfileID = async (): Promise<number> => {
  const res = await request(app).get('/api/v1/data-profile').query({ limit: 3, page: 1 }).expect(200)
  expect(res.body.data.length).toEqual(3)
  const profile_id = res.body.data[0].profile_id
  return profile_id
}

describe('Validate PUT /update/last-sync-time API (Update Last Sync Time)', () => {
  test('Throws Error if PUT body is missing', async () => {
    await request(app).put('/api/v1/data-profile/update/last-sync-time').send({}).expect(400)
  })

  test('Throws Error if PUT body contains properties other than profile_id and last_sync_time', async () => {
    const res = await request(app).post('/api/v1/data-profile').send(validMockCreateDataProfileProps).expect(200)
    const body = {
      profile_id: res.body.data?.[0].profile_id,
      last_sync_time: '3000-10-05T14:48:00.000Z',
      invalidKey: '566'
    }
    await request(app).put('/api/v1/data-profile/update/last-sync-time').send(body).expect(400)
  })

  test('Throws Error if profile_id is string', async () => {
    await request(app).post('/api/v1/data-profile').send(validMockCreateDataProfileProps).expect(200)
    const body = {
      profile_id: 'string',
      last_sync_time: '3000-10-05T14:48:00.000Z'
    }
    await request(app).put('/api/v1/data-profile/update/last-sync-time').send(body).expect(400)
  })

  test('Throws Error if last_sync_time is invalid date', async () => {
    const res = await request(app).post('/api/v1/data-profile').send(validMockCreateDataProfileProps).expect(200)
    const body = {
      profile_id: res.body.data?.[0].profile_id,
      last_sync_time: 'invalid-data-string'
    }
    await request(app).put('/api/v1/data-profile/update/last-sync-time').send(body).expect(400)
  })

  test('Throws 404 Not Found Error if profile_id is invalid', async () => {
    const res = await request(app).post('/api/v1/data-profile').send(validMockCreateDataProfileProps).expect(200)
    const body = {
      profile_id: res.body.data?.[0].profile_id + 67,
      last_sync_time: '3000-10-05T14:48:00.000Z'
    }
    await request(app).put('/api/v1/data-profile/update/last-sync-time').send(body).expect(404)
  })

  test('Detects and handles concurrency issues during update', async () => {
    const createRes = await request(app).post('/api/v1/data-profile').send(validMockCreateDataProfileProps).expect(200)

    const profileId = createRes.body.data?.[0].profile_id

    const update1 = {
      profile_id: profileId,
      last_sync_time: '2000-10-05T14:48:00.000Z'
    }

    const update2 = {
      profile_id: profileId,
      last_sync_time: '3000-10-05T15:00:00.000Z'
    }

    const update3 = {
      profile_id: profileId,
      last_sync_time: '2003-10-05T15:00:00.000Z'
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // Make a parallel request. The first succeeds
    const [updateRes1, updateRes2] = await Promise.all([
      request(app).put('/api/v1/data-profile/update/last-sync-time').send(update1),
      request(app).put('/api/v1/data-profile/update/last-sync-time').send(update2)
    ])

    // Second update should fail due to concurrency issues
    const failedUpdates = [updateRes1, updateRes2].filter((res) => res.status !== 200)
    expect(failedUpdates.length).toBe(1) // One failed updates
    failedUpdates.forEach((update) => {
      expect(update.body.errors[0].message).toBe('ExecLockRows')
      expect(update.body.errors[0].code).toBe('40001')
    })

    // Check that the profile's last_sync_time remains the same as initial
    const profileRes = await request(app).get(`/api/v1/data-profile/${profileId}`).expect(200)
    expect(profileRes.body.data?.[0].last_sync_time).not.toEqual(update2.last_sync_time)

    // Again do the update after operation is completed
    await request(app).put('/api/v1/data-profile/update/last-sync-time').send(update3)
    const profileResUpdated = await request(app).get(`/api/v1/data-profile/${profileId}`).expect(200)
    // Check if the last_sync_time matches the update3
    expect(profileResUpdated.body.data?.[0].last_sync_time).toEqual(update3.last_sync_time)
  })

  test('Success if update/last-sync-time succeeds', async () => {
    const res = await request(app).post('/api/v1/data-profile').send(validMockCreateDataProfileProps).expect(200)
    const body = {
      profile_id: res.body.data?.[0].profile_id,
      last_sync_time: '2017-10-05T14:48:00.000Z'
    }

    await request(app).put('/api/v1/data-profile/update/last-sync-time').send(body).expect(200)
    const profileRes = await request(app)
      .get(`/api/v1/data-profile/${res.body.data?.[0].profile_id}`)
      .expect(200)
    expect(profileRes.body.data?.[0].last_sync_time).toEqual('2017-10-05T14:48:00.000Z')
  })
})

describe('Validate PUT /update API (Update Profile Details)', () => {
  beforeEach(async () => {
    const profilesToCreate = [
      { profile_name: 'ProfileNew', table_name: 'Table1' },
      { profile_name: 'Profile2New', table_name: 'Table2' },
      { profile_name: 'Profile3New', table_name: 'Table3' }
    ]
    await createProfiles(profilesToCreate)
  })

  afterEach(async () => {
    await knexTestClient.raw(`DELETE FROM ${test_schema}.${test_run_history_table} CASCADE`)
    await knexTestClient.raw(`DELETE FROM ${test_schema}.${test_table}`)
  })

  test('Throws error if PUT body is missing', async () => {
    await request(app).put('/api/v1/data-profile').send({}).expect(400)
  })
  test('Thorws error if PUT body contains missing properties', async () => {
    const mutableMockProps = JSON.parse(JSON.stringify(mockUpdateDataProfileProps))
    delete mutableMockProps.profile_name
    delete mutableMockProps.version
    delete mutableMockProps.profile_id
    await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
  })
  test('Throws error if profile_id is string', async () => {
    const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
    mutableMockProps.profile_id = 'abc'
    await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
  })
  test('Throws error if profile_name is empty', async () => {
    const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
    mutableMockProps.profile_id = await getProfileID()
    mutableMockProps.profile_name = ''
    await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
  })
  test('Throws error if version is null', async () => {
    const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
    mutableMockProps.profile_id = await getProfileID()
    mutableMockProps.version = null
    await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
  })
  test('Throws error if version number provided is invalid', async () => {
    const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
    mutableMockProps.profile_id = await getProfileID()
    mutableMockProps.version = 455
    await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
  })
  test('Throws error for concurrent updates', async () => {
    const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
    const profileId = await getProfileID()
    const update1 = {
      ...mutableMockProps,
      profile_name: 'ProfileUpdate1',
      profile_id: profileId
    }

    const update2 = {
      ...mutableMockProps,
      profile_name: 'ProfileUpdate2',
      profile_id: profileId
    }

    const update3 = {
      ...mutableMockProps,
      profile_name: 'ProfileUpdate3',
      profile_id: profileId
    }

    const [updateRes1, updateRes2, updateRes3] = await Promise.all([
      request(app).put('/api/v1/data-profile').send(update1),
      request(app).put('/api/v1/data-profile').send(update2),
      request(app).put('/api/v1/data-profile').send(update3)
    ])

    const failedUpdates = [updateRes1, updateRes2, updateRes3].filter((res) => res.status !== 200)
    expect(failedUpdates.length).toBe(2) // Two failed updates
    failedUpdates.forEach((update) => {
      expect(update.body.errors[0].message).toBe('ExecLockRows')
      expect(update.body.errors[0].code).toBe('40001')
    })
  })
  test('Success if Profile Update succeeds', async () => {
    const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
    mutableMockProps.profile_id = await getProfileID()
    await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
  })
  describe('Validate profile_def in PUT body', () => {
    test('Throws Error if profile_def numeric', async () => {
      const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
      mutableMockProps.profile_id = await getProfileID()
      mutableMockProps.profile_def = 456
      await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
    })
    test('Throws Error if profile_def schema is numeric', async () => {
      const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
      mutableMockProps.profile_id = await getProfileID()
      mutableMockProps.profile_def.schema = 67
      await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
    })
    test('Throws Error if profile_def columnDef is missing', async () => {
      const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
      mutableMockProps.profile_id = await getProfileID()
      delete mutableMockProps.profile_def.columnDef
      await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
    })
    test('Throws Error if profile_def columnDef is any other data type than object', async () => {
      const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
      mutableMockProps.profile_id = await getProfileID()
      mutableMockProps.profile_def.columnDef = []
      await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      mutableMockProps.profile_def.columnDef = 67
      await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
    })
    test('Error if duplicate columnNames are provided', async () => {
      const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
      mutableMockProps.profile_id = await getProfileID()
      mutableMockProps.profile_def.columnDef.indexColumns[0].columnName = 'randomColumnName'
      mutableMockProps.profile_def.columnDef.regularColumns[2].columnName = 'randomColumnName'
      mutableMockProps.profile_def.columnDef.derivedColumns[2].columnName = 'randomColumnName'
      mutableMockProps.profile_def.columnDef.indexColumns[2].columnName = 'randomColumnName'
      await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
    })
    describe('Validate indexColumns in columnDef', () => {
      test('Throws Error if indexColumns is missing', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        delete mutableMockProps.profile_def.columnDef.indexColumns
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if indexColumns length is greater than 4', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns.push({
          notNull: true,
          dataType: 'VARCHAR',
          isPrimary: true,
          columnName: 'RecordID',
          references: null,
          defaultValue: null,
          maxAllowedChars: 566
        })
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if references property is set on dataType other than CHAR and VARCHAR', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const mockData1 = {
          notNull: true,
          dataType: 'INT',
          isPrimary: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: null
        }
        const mockData2 = {
          notNull: true,
          dataType: 'BOOLEAN',
          isPrimary: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: null
        }
        const mockData3 = {
          notNull: true,
          dataType: 'NUMERIC',
          isPrimary: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: null
        }
        const mockData4 = {
          notNull: true,
          dataType: 'VARCHAR',
          isPrimary: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: 56
        }
        mutableMockProps.profile_def.columnDef.indexColumns[0] = mockData1
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.indexColumns[0] = mockData2
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.indexColumns[0] = mockData3
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.indexColumns[0] = mockData4
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
      test('Throws Error if references property is number', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const mockData1 = {
          notNull: true,
          dataType: 'VARCHAR',
          isPrimary: true,
          columnName: 'RecordID',
          references: 45,
          defaultValue: null,
          maxAllowedChars: 56
        }
        const mockData2 = {
          notNull: true,
          dataType: 'VARCHAR',
          isPrimary: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: 56
        }

        mutableMockProps.profile_def.columnDef.indexColumns[0] = mockData1
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.indexColumns[0] = mockData2
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
      test('Throws Error if indexColumns is other datatype than array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns = 67
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.indexColumns = ''
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.indexColumns = { key: 'value' }
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if indexColumns is empty array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns = []
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if indexColumns is array of string', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns = ['hello', 'world']
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has missing fields', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        delete mutableMockProps.profile_def.columnDef.indexColumns[0].defaultValue
        delete mutableMockProps.profile_def.columnDef.indexColumns[2].isPrimary
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has extra prop', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].randomKey = 'randomValue'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has all isPrimary true', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].isPrimary = true
        mutableMockProps.profile_def.columnDef.indexColumns[1].isPrimary = true
        mutableMockProps.profile_def.columnDef.indexColumns[2].isPrimary = true
        mutableMockProps.profile_def.columnDef.indexColumns[3].isPrimary = true
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has no isPrimary true', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].isPrimary = false
        mutableMockProps.profile_def.columnDef.indexColumns[1].isPrimary = false
        mutableMockProps.profile_def.columnDef.indexColumns[2].isPrimary = false
        mutableMockProps.profile_def.columnDef.indexColumns[3].isPrimary = false
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Success if items has atleast one isPrimary true', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].isPrimary = false
        mutableMockProps.profile_def.columnDef.indexColumns[1].isPrimary = false
        mutableMockProps.profile_def.columnDef.indexColumns[2].isPrimary = true
        mutableMockProps.profile_def.columnDef.indexColumns[3].isPrimary = false
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
      test('Throws error if notNull is other data type than boolean', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].notNull = 'hello'
        mutableMockProps.profile_def.columnDef.regularColumns[1].notNull = ['hello']
        mutableMockProps.profile_def.columnDef.derivedColumns[2].notNull = 65
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if dataType is other data specified', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].dataType = 'hello'
        mutableMockProps.profile_def.columnDef.indexColumns[1].dataType = ['hello']
        mutableMockProps.profile_def.columnDef.indexColumns[2].dataType = 65
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any string field contains HTML Tags', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].columnName = 'random<Column Name>'
        mutableMockProps.profile_def.columnDef.indexColumns[1].columnName = '$RandomColumnName^'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any dataType is VARCHAR and defaultValue is array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].dataType = 'VARCHAR'
        mutableMockProps.profile_def.columnDef.indexColumns[0].defaultValue = 65
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any dataType is CHAR and defaultValue is multiple chars', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].dataType = 'CHAR'
        mutableMockProps.profile_def.columnDef.indexColumns[0].defaultValue = 'hello'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any dataType is TIMESTAMP and defaultValue is invalid date format', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].dataType = 'TIMESTAMP'
        mutableMockProps.profile_def.columnDef.indexColumns[0].defaultValue = '2011-1005T14:48:00.000Z'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any maxAllowedChars is other than number or null', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.indexColumns[0].maxAllowedChars = 56
        mutableMockProps.profile_def.columnDef.indexColumns[1].maxAllowedChars = 'hello'
        mutableMockProps.profile_def.columnDef.indexColumns[2].maxAllowedChars = ['hello']
        mutableMockProps.profile_def.columnDef.indexColumns[3].maxAllowedChars = { hello: 'hello' }
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
    })
    describe('Validate regularColumns in columnDef', () => {
      test('Throws Error if regularColumns is missing', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        delete mutableMockProps.profile_def.columnDef.regularColumns
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if regularColumns length is greater than 4', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns.push({
          notNull: true,
          dataType: 'VARCHAR',
          isPrimary: true,
          columnName: 'RecordID',
          references: null,
          defaultValue: null,
          maxAllowedChars: 56
        })
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if references property is set on dataType other than CHAR and VARCHAR', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const mockData1 = {
          notNull: true,
          dataType: 'INT',
          isUnique: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: null
        }
        const mockData2 = {
          notNull: true,
          dataType: 'BOOLEAN',
          isUnique: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: null
        }
        const mockData3 = {
          notNull: true,
          dataType: 'NUMERIC',
          isUnique: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: null
        }
        const mockData4 = {
          notNull: true,
          dataType: 'VARCHAR',
          isUnique: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: 56
        }
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData1
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData2
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData3
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData4
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
      test('Throws Error if references property is number', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const mockData1 = {
          notNull: true,
          dataType: 'VARCHAR',
          isUnique: true,
          columnName: 'RecordID',
          references: 45,
          defaultValue: null,
          maxAllowedChars: 56
        }
        const mockData2 = {
          notNull: true,
          dataType: 'VARCHAR',
          isUnique: true,
          columnName: 'RecordID',
          references: {
            tableName: 'state_in_india',
            columnName: 'name'
          },
          defaultValue: null,
          maxAllowedChars: 56
        }

        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData1
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData2
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })

      test('Throws Error if regularColumns is other datatype than array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns = 67
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns = ''
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns = { key: 'value' }
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if regularColumns is empty array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns = []
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if regularColumns is array of string', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns = ['hello', 'world']
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has missing fields', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        delete mutableMockProps.profile_def.columnDef.regularColumns[0].defaultValue
        delete mutableMockProps.profile_def.columnDef.regularColumns[2].isPrimary
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has extra prop', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].randomKey = 'randomValue'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has isUnique property as other than boolean', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].isUnique = ''

        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if notNull is other data type than boolean', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].notNull = 'hello'
        mutableMockProps.profile_def.columnDef.regularColumns[1].notNull = ['hello']
        mutableMockProps.profile_def.columnDef.regularColumns[2].notNull = 65
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if dataType is other data specified', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].dataType = 'hello'
        mutableMockProps.profile_def.columnDef.regularColumns[1].dataType = ['hello']
        mutableMockProps.profile_def.columnDef.regularColumns[2].dataType = 65
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any string field contains HTML Tags', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].columnName = 'random<Column Name>'
        mutableMockProps.profile_def.columnDef.regularColumns[1].columnName = '$RandomColumnName^'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any dataType is VARCHAR and defaultValue is array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].dataType = 'VARCHAR'
        mutableMockProps.profile_def.columnDef.regularColumns[0].defaultValue = 65
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any dataType is CHAR and defaultValue is multiple chars', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].dataType = 'CHAR'
        mutableMockProps.profile_def.columnDef.regularColumns[0].defaultValue = 'hello'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any dataType is TIMESTAMP and defaultValue is invalid date format', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].dataType = 'TIMESTAMP'
        mutableMockProps.profile_def.columnDef.regularColumns[0].defaultValue = '2011-1005T14:48:00.000Z'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any maxAllowedChars is other than number or null', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.regularColumns[0].maxAllowedChars = 56
        mutableMockProps.profile_def.columnDef.regularColumns[1].maxAllowedChars = 'hello'
        mutableMockProps.profile_def.columnDef.regularColumns[2].maxAllowedChars = ['hello']
        mutableMockProps.profile_def.columnDef.regularColumns[3].maxAllowedChars = { hello: 'hello' }
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('For CHAR dataType maxAllowedChars must be 1 or null', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(mockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const mockData1 = {
          notNull: true,
          dataType: 'CHAR',
          isPrimary: true,
          columnName: 'randomColumn',
          references: null,
          defaultValue: null,
          maxAllowedChars: 45
        }
        const mockData2 = {
          notNull: true,
          dataType: 'CHAR',
          isUnique: true,
          columnName: 'randomColumn',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        }
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData1
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData2
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
      test('For DATE dataType maxAllowedChars must be null', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(mockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const mockData1 = {
          notNull: true,
          dataType: 'DATE',
          isUnique: true,
          columnName: 'randomColumn',
          references: null,
          defaultValue: null,
          maxAllowedChars: 45
        }
        const mockData2 = {
          notNull: true,
          dataType: 'DATE',
          isUnique: true,
          columnName: 'randomColumn',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        }
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData1
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData2
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
      test('For TIMESTAMP dataType maxAllowedChars must be null', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(mockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const mockData1 = {
          notNull: true,
          dataType: 'TIMESTAMP',
          isUnique: true,
          columnName: 'randomColumn',
          references: null,
          defaultValue: null,
          maxAllowedChars: 45
        }
        const mockData2 = {
          notNull: true,
          dataType: 'TIMESTAMP',
          isUnique: true,
          columnName: 'randomColumn',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        }
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData1
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData2
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
      test('For TIMESTAMP_TZ dataType maxAllowedChars must be null', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(mockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const mockData1 = {
          notNull: true,
          dataType: 'TIMESTAMP_TZ',
          isUnique: true,
          columnName: 'randomColumn',
          references: null,
          defaultValue: null,
          maxAllowedChars: 45
        }
        const mockData2 = {
          notNull: true,
          dataType: 'TIMESTAMP_TZ',
          isUnique: true,
          columnName: 'randomColumn',
          references: null,
          defaultValue: null,
          maxAllowedChars: null
        }
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData1
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        mutableMockProps.profile_def.columnDef.regularColumns[0] = mockData2
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
    })
    describe('Validate derivedColumns in columnDef', () => {
      test('Throws Error if derivedColumns is missing', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        delete mutableMockProps.profile_def.columnDef.derivedColumns
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Success if derivedColumns is defined and empty array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.derivedColumns = []
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
      })
      test('Throws Error if derivedColumns is other datatype than array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.derivedColumns = 87
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if derivedColumns is array of string', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.derivedColumns = ['hello', 'world']
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has missing fields', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        delete mutableMockProps.profile_def.columnDef.derivedColumns[0].notNull
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws Error if items has extra props', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.derivedColumns[0].randomKey = 'randomValue'
        mutableMockProps.profile_def.columnDef.derivedColumns[0].isPrimary = true
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if notNull is other data type than boolean', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.derivedColumns[0].notNull = 56
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if dataType is other data specified', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.derivedColumns[0].dataType = 'NOT_SPECIFIED'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any string field contains HTML Tags', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        mutableMockProps.profile_def.columnDef.derivedColumns[1].columnName = '$RandomColumnName^'
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if any maxAllowedChars is other than number or null', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const body = {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'fullName',
          maxAllowedChars: 'FGRFGF',
          operation: 'CONCATENATE',
          onValue: null,
          onColumns: ['firstName', 'lastName']
        }
        mutableMockProps.profile_def.columnDef.derivedColumns[0] = body
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if operation and onValue field are missing', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        delete mutableMockProps.profile_def.columnDef.derivedColumns[0].operation
        delete mutableMockProps.profile_def.columnDef.derivedColumns[1].onValue
        delete mutableMockProps.profile_def.columnDef.derivedColumns[2].operation
        delete mutableMockProps.profile_def.columnDef.derivedColumns[3].onValue
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if operation is other than specified', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const body = {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'fullName',
          maxAllowedChars: 56,
          operation: 'NOT_VALID_OPERATION',
          onValue: null,
          onColumns: ['firstName', 'lastName']
        }
        mutableMockProps.profile_def.columnDef.derivedColumns[0] = body
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if onColumns property is numbers array', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(mockCreateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const body = {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'fullName',
          maxAllowedChars: 56,
          operation: 'CONCATENATE',
          onValue: null,
          onColumns: [5, 5]
        }
        mutableMockProps.profile_def.columnDef.derivedColumns[0] = body
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if onColumns property is undefined', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(mockCreateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        delete mutableMockProps.profile_def.columnDef.derivedColumns[0].onColumns
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if onColumns property contains values other than what specified in indexColumns or regularColumns', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(mockCreateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const body = {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'fullName',
          maxAllowedChars: 56,
          operation: 'CONCATENATE',
          onValue: null,
          onColumns: ['invalidColumn', 'lastName']
        }
        mutableMockProps.profile_def.columnDef.derivedColumns[0] = body
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
      test('Throws error if more than 4 onColumns property in derived Columns', async () => {
        const mutableMockProps = JSON.parse(JSON.stringify(mockCreateDataProfileProps))
        mutableMockProps.profile_id = await getProfileID()
        const body = {
          notNull: true,
          dataType: 'VARCHAR',
          columnName: 'fullName',
          maxAllowedChars: 56,
          operation: 'CONCATENATE',
          onValue: null,
          onColumns: ['firstName', 'lastName', 'firstName', 'lastName']
        }
        mutableMockProps.profile_def.columnDef.derivedColumns[0] = body
        await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
      })
    })
    describe('Validate OPERATIONS in derivedColumns', () => {
      describe('Validation for CONCATENATE operation', () => {
        test('Throws error if operation is CONCATENATE and value is number', async () => {
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0].operation = 'CONCATENATE'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onValue = 89
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('For CONCATENATE operation dataType must be VARCHAR', async () => {
          const mockData = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomDerivedColumn',
            maxAllowedChars: 45,
            operation: 'CONCATENATE',
            onValue: null,
            onColumns: ['firstName']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns.push(mockData)
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Throws error if for CONCATENATE operation dataType is other than VARCHAR', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'CONCATENATE',
            onValue: null,
            onColumns: ['firstName']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'BOOLEAN',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'CONCATENATE',
            onValue: null,
            onColumns: ['firstName']
          }
          const mockData3 = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'CONCATENATE',
            onValue: null,
            onColumns: ['firstName']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('For CONCATENATE operation onColumns dataType must be VARCHAR or CHAR', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'CONCATENATE',
            onValue: null,
            onColumns: ['contactNo', 'age']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'CONCATENATE',
            onValue: null,
            onColumns: ['firstName', 'lastName']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Throws error if for CONCATENATE operation onColumns dataType is other than VARCHAR or CHAR', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'CONCATENATE',
            onValue: null,
            onColumns: ['dateOfBirth', 'dateOfJoining']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })
      })
      describe('Validation for SUM operation', () => {
        test('For SUM operation dataType must be INT or NUMERIC', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'SUM',
            onValue: null,
            onColumns: ['contactNo', 'age']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'SUM',
            onValue: null,
            onColumns: ['contactNo', 'age']
          }

          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Suucess if dataType is NUMERIC and onColumns dataType is either INT or NUMERIC', async () => {
          const mockData3 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'SUM',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Throws error if for SUM operation dataType is other than INT or NUMERIC', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'BOOLEAN',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'SUM',
            onValue: null,
            onColumns: ['contactNo', 'age']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'TIMESTAMP',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'SUM',
            onValue: null,
            onColumns: ['contactNo', 'age']
          }
          const mockData3 = {
            notNull: true,
            dataType: 'DATE',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'SUM',
            onValue: null,
            onColumns: ['contactNo', 'age']
          }
          const mockData4 = {
            notNull: true,
            dataType: 'TIMESTAMP_TZ',
            columnName: 'randomColName12',
            maxAllowedChars: 45,
            operation: 'SUM',
            onValue: null,
            onColumns: ['contactNo', 'age']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData4
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if for SUM operation dataType is INT and onColumns dataType is other than INT', async () => {
          const mockData3 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'SUM',
            onValue: null,
            onColumns: ['firstName', 'lastName']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if for SUM operation dataType is NUMERIC and onColumns dataType is other than INT or NUMERIC', async () => {
          const mockData3 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'SUM',
            onValue: null,
            onColumns: ['salary', 'gender']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })
      })
      describe('Validation for DIFF operation', () => {
        test('For DIFF operation dataType must be INT or NUMERIC', async () => {
          const mockData = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'DIFF',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Throws error if for DIFF operation dataType is other than INT or NUMERIC', async () => {
          const mockData = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName12',
            maxAllowedChars: 56,
            operation: 'DIFF',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if for DIFF operation dataType is INT and onColumns dataType is other than INT', async () => {
          const mockData = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'DIFF',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if for DIFF operation dataType is NUMERIC and onColumns dataType is other than INT or NUMERIC', async () => {
          const mockData = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'DIFF',
            onValue: null,
            onColumns: ['firstName', 'lastName']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if operation is DIFF, onValue is null and onColumns contains more than two columns', async () => {
          const mockData = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'DIFF',
            onValue: null,
            onColumns: ['salary', 'bonus', 'age']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if operation is DIFF, onValue is provided and onColumns contains more than one column', async () => {
          const mockData = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'DIFF',
            onValue: 56,
            onColumns: ['salary', 'bonus', 'age']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Success if operation is DIFF, onValue is provided and onColumns contains one column', async () => {
          const mockData = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'DIFF',
            onValue: 56,
            onColumns: ['salary']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Success if operation is DIFF, onValue is null and onColumns contains two column', async () => {
          const mockData = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName12',
            maxAllowedChars: null,
            operation: 'DIFF',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })
      })
      describe('Validation for PRODUCT operation', () => {
        test('For PRODUCT operation dataType must be INT or NUMERIC - 1', async () => {
          const mockData = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName22',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('For PRODUCT operation dataType must be INT or NUMERIC - 2', async () => {
          const mockData = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName22',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['age', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Throws error if for PRODUCT operation dataType is other than INT or NUMERIC', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName22',
            maxAllowedChars: 56,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['age', 'bonus']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'BOOLEAN',
            columnName: 'randomColName22',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['age', 'bonus']
          }
          const mockData3 = {
            notNull: true,
            dataType: 'DATE',
            columnName: 'randomColName22',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['age', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if for PRODUCT operation dataType is INT and onColumns dataType is other than INT', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName22',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName22',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['dateOfBirth', 'dateOfJoining']
          }
          const mockData3 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName22',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['firstName', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if for PRODUCT operation dataType is NUMERIC and onColumns dataType is other than INT or NUMERIC', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName22',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['firstName', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if operation is PRODUCT and onColumns contains columns with dataType as VARCHAR or CHAR', async () => {
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.indexColumns[0].dataType = 'VARCHAR'
          mutableMockProps.profile_def.columnDef.indexColumns[2].dataType = 'VARCHAR'
          mutableMockProps.profile_def.columnDef.indexColumns[0].columnName = 'firstName'
          mutableMockProps.profile_def.columnDef.indexColumns[2].columnName = 'lastName'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].operation = 'PRODUCT'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onColumns = ['firstName', 'lastName']
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })
      })
      describe('Validation for MOD operation', () => {
        test('For MOD operation dataType must be INT or NUMERIC - 1', async () => {
          const mockData = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'MOD',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('For MOD operation dataType must be INT or NUMERIC - 2', async () => {
          const mockData = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'MOD',
            onValue: null,
            onColumns: ['age', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Throws error if for MOD operation dataType is other than INT or NUMERIC', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName33',
            maxAllowedChars: 56,
            operation: 'MOD',
            onValue: null,
            onColumns: ['age', 'bonus']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'BOOLEAN',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'MOD',
            onValue: null,
            onColumns: ['age', 'bonus']
          }
          const mockData3 = {
            notNull: true,
            dataType: 'DATE',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'MOD',
            onValue: null,
            onColumns: ['age', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if for MOD operation dataType is INT and onColumns dataType is other than INT', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'MOD',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'MOD',
            onValue: null,
            onColumns: ['dateOfBirth', 'dateOfJoining']
          }
          const mockData3 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'MOD',
            onValue: null,
            onColumns: ['firstName', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if for MOD operation dataType is NUMERIC and onColumns dataType is other than INT or NUMERIC', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['salary', 'bonus']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['dateOfBirth', 'dateOfJoining']
          }
          const mockData3 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'PRODUCT',
            onValue: null,
            onColumns: ['firstName', 'bonus']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('Throws error if operation is MOD and onColumns contains columns with dataType as VARCHAR or CHAR', async () => {
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.indexColumns[0].dataType = 'VARCHAR'
          mutableMockProps.profile_def.columnDef.indexColumns[2].dataType = 'VARCHAR'
          mutableMockProps.profile_def.columnDef.indexColumns[0].columnName = 'firstName'
          mutableMockProps.profile_def.columnDef.indexColumns[2].columnName = 'lastName'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].operation = 'MOD'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onColumns = ['firstName', 'lastName']
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if operation is MOD, onValue is null and onColumns contains more than two columns', async () => {
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0].operation = 'MOD'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onValue = null
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onColumns = ['contactNo', 'age', 'age']
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if operation is MOD, onValue is defined and onColumns contains more than one columns', async () => {
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0].operation = 'MOD'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onValue = 56
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onColumns = ['contactNo', 'age']
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })
      })

      describe('Validation for DIVIDE operation', () => {
        test('Throws error if operation is DIVIDE and onColumns contains columns with dataType as VARCHAR or CHAR', async () => {
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.indexColumns[0].dataType = 'VARCHAR'
          mutableMockProps.profile_def.columnDef.indexColumns[2].dataType = 'VARCHAR'
          mutableMockProps.profile_def.columnDef.indexColumns[0].columnName = 'firstName'
          mutableMockProps.profile_def.columnDef.indexColumns[2].columnName = 'lastName'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].operation = 'divide'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onColumns = ['firstName', 'lastName']
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if operation is DIVIDE, onValue is defined and onColumns contains more than one columns', async () => {
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0].operation = 'DIVIDE'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onValue = 56
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onColumns = ['contactNo', 'age']
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })

        test('Throws error if operation is DIVIDE, onValue is not and onColumns contains more than two columns', async () => {
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0].operation = 'DIVIDE'
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onValue = null
          mutableMockProps.profile_def.columnDef.derivedColumns[0].onColumns = ['contactNo', 'age', 'age']
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
        })
      })

      describe('Validation for AGE operation', () => {
        test('For AGE operation dataType must be INT', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'VARCHAR',
            columnName: 'randomColName33',
            maxAllowedChars: 56,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'BOOLEAN',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth']
          }
          const mockData3 = {
            notNull: true,
            dataType: 'DATE',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth']
          }
          const mockData4 = {
            notNull: true,
            dataType: 'NUMERIC',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth']
          }
          const mockData5 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData3
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData4
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData5
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('For AGE operation onValue must be null', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: 45,
            onColumns: ['dateOfBirth']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('For AGE operation onColumns length must be 1', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth', 'dateOfJoining']
          }
          const mockData2 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(400)
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData2
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('For AGE operation onColumns dataType must be DATE, TIMESTAMP, TIMESTAMP_TZ - 1', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfBirth']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('For AGE operation onColumns dataType must be DATE, TIMESTAMP, TIMESTAMP_TZ - 2', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['profileUpdatedAt']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })

        test('For AGE operation onColumns dataType must be DATE, TIMESTAMP, TIMESTAMP_TZ - 3', async () => {
          const mockData1 = {
            notNull: true,
            dataType: 'INT',
            columnName: 'randomColName33',
            maxAllowedChars: null,
            operation: 'AGE',
            onValue: null,
            onColumns: ['dateOfJoining']
          }
          const mutableMockProps = JSON.parse(JSON.stringify(validMockUpdateDataProfileProps))
          mutableMockProps.profile_id = await getProfileID()
          mutableMockProps.profile_def.columnDef.derivedColumns[0] = mockData1
          await request(app).put('/api/v1/data-profile').send(mutableMockProps).expect(200)
        })
      })
    })
  })
})
