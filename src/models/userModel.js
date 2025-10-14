const db = require('../config/db');


async function ensureUsersTable() {
const exists = await db.schema.hasTable('users');
if (!exists) {
await db.schema.createTable('users', table => {
table.increments('id').primary();
table.string('name').notNullable();
table.string('email').notNullable().unique();
table.string('password').notNullable();
table.timestamp('created_at').defaultTo(db.fn.now());
table.timestamp('updated_at').defaultTo(db.fn.now());
});
}
}


module.exports = { db, ensureUsersTable };