/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  // Check if collection already exists
  let collection;
  try {
    collection = dao.findCollectionByNameOrId("projects");
    // Collection exists, just update permissions
    collection.listRule = "@request.auth.id != ''";
    collection.viewRule = "@request.auth.id != ''";
    collection.createRule = "@request.auth.id != ''";
    collection.updateRule = "@request.auth.id != ''";
    collection.deleteRule = "@request.auth.id != ''";
  } catch (e) {
    // Collection doesn't exist, create it
    collection = new Collection({
      "id": "es23vfsic2artwl",
      "name": "projects",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "name",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": true,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "description",
          "name": "description",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "created_by",
          "name": "created_by",
          "type": "relation",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": ["email"]
          }
        }
      ],
      "indexes": [
        "CREATE INDEX `idx_created_by` ON `projects` (`created_by`)"
      ],
      "listRule": "@request.auth.id != ''",
      "viewRule": "@request.auth.id != ''",
      "createRule": "@request.auth.id != ''",
      "updateRule": "@request.auth.id != ''",
      "deleteRule": "@request.auth.id != ''",
      "options": {}
    });
  }

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  try {
    const collection = dao.findCollectionByNameOrId("es23vfsic2artwl");
    return dao.deleteCollection(collection);
  } catch (e) {
    // Collection doesn't exist, nothing to delete
  }
});
