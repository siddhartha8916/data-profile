/* eslint-disable @typescript-eslint/no-explicit-any */
import request from 'supertest'
import { createApp } from '../../app'

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
          dataType: 'TIMESTAMP',
          isUnique: false,
          columnName: 'dateOfBirth',
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

const createProfiles = async (profiles: { profile_name: string; table_name: string }[]) => {
  for (const profileData of profiles) {
    await request(app)
      .post('/api/v1/data-profile')
      .send({ ...validMockCreateDataProfileProps, ...profileData })
      .expect(200)
  }
}

describe('Test GET /api/v1/data-profile - (Get All Data Profile)', () => {
  test('Can fetch a list of all data profiles', async () => {
    const profilesToCreate = [
      { profile_name: 'Profile1', table_name: 'Table1' },
      { profile_name: 'Profile2', table_name: 'Table2' },
      { profile_name: 'Profile3', table_name: 'Table3' }
    ]
    await createProfiles(profilesToCreate)
    const response = await request(app).get('/api/v1/data-profile').query({ limit: 2, page: 1 }).expect(200)
    expect(response.body.data.length).toEqual(2)
  })

  test('Can filter data profile', async () => {
    const profilesToCreate = [
      { profile_name: 'Profile1', table_name: 'Table1' },
      { profile_name: 'RandomProfile2', table_name: 'Table2' },
      { profile_name: 'Profile3', table_name: 'Table3' }
    ]
    await createProfiles(profilesToCreate)
    const response = await request(app)
      .get('/api/v1/data-profile')
      .query({ search_term: 'Profile', limit: 2, page: 1 })
      .expect(200)
    expect(response.body.data?.length).toEqual(2)
  })

  test('Give empty data response if filter doesnot match', async () => {
    const profilesToCreate = [
      { profile_name: 'Profile1', table_name: 'Table1' },
      { profile_name: 'Profile2', table_name: 'Table2' },
      { profile_name: 'Profile3', table_name: 'Table3' }
    ]
    await createProfiles(profilesToCreate)
    const response = await request(app)
      .get('/api/v1/data-profile')
      .query({ search_term: 'jnnnbv', limit: 2, page: 1 })
      .expect(200)
    expect(response.body.data.length).toEqual(0)
  })

  test('Give 400 Bad Request Error when fields other than search_term, limit and page are provided ', async () => {
    const profilesToCreate = [
      { profile_name: 'Profile1', table_name: 'Table1' },
      { profile_name: 'Profile2', table_name: 'Table2' },
      { profile_name: 'Profile3', table_name: 'Table3' }
    ]
    await createProfiles(profilesToCreate)
    await request(app)
      .get('/api/v1/data-profile')
      .query({ search_term: 'Siddhartha', limit: 2, page: 1, in_valid: '' })
      .expect(400)
  })
})

describe('Test GET /api/v1/data-profile/:profile_id - (Get Data Profile Details)', () => {
  test('Can fetch a data profile if valid ID provided', async () => {
    const profilesToCreate = [
      { profile_name: 'Profile1', table_name: 'Table1' },
      { profile_name: 'RandomProfile2', table_name: 'Table2' },
      { profile_name: 'Profile3', table_name: 'Table3' }
    ]
    await createProfiles(profilesToCreate)
    const response1 = await request(app).get('/api/v1/data-profile').query({ limit: 3, page: 1 }).expect(200)
    const profile_id = response1.body.data?.[1].profile_id
    const response = await request(app).get(`/api/v1/data-profile/${profile_id}`).expect(200)
    expect(response.body.data.length).toEqual(1)
    expect(response.body.data?.[0].profile_name).toEqual(profilesToCreate[1].profile_name)
  })

  test('Throws 404 error if invalid ID provided', async () => {
    const profilesToCreate = [
      { profile_name: 'Profile1', table_name: 'Table1' },
      { profile_name: 'RandomProfile2', table_name: 'Table2' },
      { profile_name: 'Profile3', table_name: 'Table3' }
    ]
    await createProfiles(profilesToCreate)
    const response1 = await request(app).get('/api/v1/data-profile').query({ limit: 3, page: 1 }).expect(200)
    const profile_id = response1.body.data?.[1].profile_id + 23
    await request(app).get(`/api/v1/data-profile/${profile_id}`).expect(404)
  })
})
