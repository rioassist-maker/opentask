/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  // Update tasks collection permissions
  const tasksCollection = dao.findCollectionByNameOrId("tasks");
  tasksCollection.listRule = "";  // Anyone can list
  tasksCollection.viewRule = "";  // Anyone can view
  tasksCollection.createRule = "@request.auth.id != ''";  // Authenticated users can create
  tasksCollection.updateRule = "@request.auth.id != ''";  // Authenticated users can update
  tasksCollection.deleteRule = "@request.auth.id != ''";  // Authenticated users can delete
  dao.saveCollection(tasksCollection);

  // Update projects collection permissions
  const projectsCollection = dao.findCollectionByNameOrId("projects");
  projectsCollection.listRule = "";
  projectsCollection.viewRule = "";
  projectsCollection.createRule = "@request.auth.id != ''";
  projectsCollection.updateRule = "@request.auth.id != ''";
  projectsCollection.deleteRule = "@request.auth.id != ''";
  dao.saveCollection(projectsCollection);

  // Update activity_log collection permissions
  const activityCollection = dao.findCollectionByNameOrId("activity_log");
  activityCollection.listRule = "";
  activityCollection.viewRule = "";
  activityCollection.createRule = "@request.auth.id != ''";
  activityCollection.updateRule = null;  // No updates on logs
  activityCollection.deleteRule = null;  // No deletes on logs
  dao.saveCollection(activityCollection);
}, (db) => {
  const dao = new Dao(db);

  // Revert to admin-only permissions
  const tasksCollection = dao.findCollectionByNameOrId("tasks");
  tasksCollection.listRule = null;
  tasksCollection.viewRule = null;
  tasksCollection.createRule = null;
  tasksCollection.updateRule = null;
  tasksCollection.deleteRule = null;
  dao.saveCollection(tasksCollection);

  const projectsCollection = dao.findCollectionByNameOrId("projects");
  projectsCollection.listRule = null;
  projectsCollection.viewRule = null;
  projectsCollection.createRule = null;
  projectsCollection.updateRule = null;
  projectsCollection.deleteRule = null;
  dao.saveCollection(projectsCollection);

  const activityCollection = dao.findCollectionByNameOrId("activity_log");
  activityCollection.listRule = null;
  activityCollection.viewRule = null;
  activityCollection.createRule = null;
  activityCollection.updateRule = null;
  activityCollection.deleteRule = null;
  dao.saveCollection(activityCollection);
});
