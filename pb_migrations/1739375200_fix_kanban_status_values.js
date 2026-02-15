/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("s6unrizwt1oxloj");

  // Update the status field to use 'todo' instead of 'backlog'
  // and remove 'in_review' if present
  const statusField = collection.schema.getFieldByName("status");
  if (statusField) {
    statusField.options = {
      maxSelect: 1,
      values: [
        "todo",
        "in_progress",
        "blocked",
        "done"
      ]
    };
  }

  // Update existing records: convert 'backlog' to 'todo'
  db.exec(`UPDATE tasks SET status = 'todo' WHERE status = 'backlog'`);
  
  // Update existing records: remove 'in_review' -> convert to 'todo'
  db.exec(`UPDATE tasks SET status = 'todo' WHERE status = 'in_review'`);

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("s6unrizwt1oxloj");

  // Rollback: restore original status values
  const statusField = collection.schema.getFieldByName("status");
  if (statusField) {
    statusField.options = {
      maxSelect: 1,
      values: [
        "backlog",
        "in_progress",
        "blocked",
        "done"
      ]
    };
  }

  // Restore records: convert 'todo' back to 'backlog'
  db.exec(`UPDATE tasks SET status = 'backlog' WHERE status = 'todo'`);

  return dao.saveCollection(collection);
});
