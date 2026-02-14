/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("s6unrizwt1oxloj");

  // Add created_by field (relation to users)
  collection.schema.addField({
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
  });

  // Add claimed_by field (optional relation to users)
  collection.schema.addField({
    "system": false,
    "id": "claimed_by",
    "name": "claimed_by",
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
  });

  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("s6unrizwt1oxloj");

  // Remove the fields to rollback
  collection.schema.removeField("created_by");
  collection.schema.removeField("claimed_by");

  return dao.saveCollection(collection);
});
