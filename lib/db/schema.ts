import { pgTable, serial, text, varchar, timestamp, jsonb, boolean, index } from "drizzle-orm/pg-core"

export const generations = pgTable(
  "generations",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    ip: varchar("ip", { length: 45 }).notNull(),
    mode: varchar("mode", { length: 20 }).notNull(),
    keywords: text("keywords").notNull(),
    targetName: varchar("target_name", { length: 12 }),
    status: varchar("status", { length: 30 }).notNull(),
    model: varchar("model", { length: 50 }),
    names: jsonb("names"),
    errorCode: varchar("error_code", { length: 50 }),
    cached: boolean("cached").default(false).notNull(),
  },
  (table) => [
    index("idx_generations_created_at").on(table.createdAt),
    index("idx_generations_ip").on(table.ip),
    index("idx_generations_status").on(table.status),
  ],
)
