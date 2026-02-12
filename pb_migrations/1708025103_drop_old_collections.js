/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  // This migration removes old collections to prepare for recreation with correct IDs
  const dao = new Dao(db);
  
  try {
    const activityLog = dao.findCollectionByNameOrId("activity_log");
    if (activityLog) {
      dao.deleteCollection(activityLog);
    }
  } catch (e) {
    // Collection doesn't exist, continue
  }
  
  try {
    const tasks = dao.findCollectionByNameOrId("tasks");
    if (tasks) {
      dao.deleteCollection(tasks);
    }
  } catch (e) {
    // Collection doesn't exist, continue
  }
  
  try {
    const projects = dao.findCollectionByNameOrId("projects");
    if (projects) {
      dao.deleteCollection(projects);
    }
  } catch (e) {
    // Collection doesn't exist, continue
  }
}, (db) => {
  // Rollback is handled by recreating in previous migrations
  return true;
})
