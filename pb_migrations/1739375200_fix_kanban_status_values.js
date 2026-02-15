/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tasks");

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

  dao.saveCollection(collection);

  // Update existing records: convert 'backlog' to 'todo' and 'in_review' to 'todo'
  try {
    const tasks = dao.findRecordsByExpr("tasks");
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const status = task.get("status");
      if (status === "backlog" || status === "in_review") {
        task.set("status", "todo");
        dao.saveRecord(task);
      }
    }
  } catch (e) {
    // No records yet, continue
  }

  return null;
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tasks");

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

  dao.saveCollection(collection);

  // Restore records: convert 'todo' back to 'backlog'
  try {
    const tasks = dao.findRecordsByExpr("tasks");
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (task.get("status") === "todo") {
        task.set("status", "backlog");
        dao.saveRecord(task);
      }
    }
  } catch (e) {
    // No records yet, continue
  }

  return null;
});
