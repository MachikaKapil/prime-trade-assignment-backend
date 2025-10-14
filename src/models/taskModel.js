const db = require('../config/db');


async function ensureTasksTable() {
const exists = await db.schema.hasTable('tasks');
if (!exists) {
await db.schema.createTable('tasks', table => {
table.increments('id').primary();
table.integer('user_id').unsigned().notNullable();
table.string('title').notNullable();
table.text('description').nullable();
table.string('status').defaultTo('pending');
table.timestamp('created_at').defaultTo(db.fn.now());
table.timestamp('updated_at').defaultTo(db.fn.now());
table.foreign('user_id').references('users.id').onDelete('CASCADE');
});
}
}


module.exports = { db, ensureTasksTable };