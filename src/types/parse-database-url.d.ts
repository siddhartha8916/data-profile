declare module 'parse-database-url' {
  export interface ParsedDatabaseUrl {
    driver: string
    user: string
    password: string
    database: string
    host: string
    port: string
  }

  export default function parseDatabaseUrl(url: string): ParsedDatabaseUrl
}
