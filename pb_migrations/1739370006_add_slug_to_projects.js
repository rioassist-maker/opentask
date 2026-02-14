/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  try {
    const collection = dao.findCollectionByNameOrId("projects");
    
    // Check if slug field already exists
    const slugFieldExists = collection.schema.getFieldByName("slug") !== null;
    
    if (!slugFieldExists) {
      // Add slug field
      collection.schema.addField({
        "system": false,
        "id": "slug",
        "name": "slug",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": true,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      });
    }
    
    return dao.saveCollection(collection);
  } catch (e) {
    // Collection doesn't exist, nothing to do
    console.log("Projects collection not found, skipping slug field migration");
  }
}, (db) => {
  const dao = new Dao(db);
  
  try {
    const collection = dao.findCollectionByNameOrId("projects");
    
    // Check if slug field exists before removing
    const slugFieldExists = collection.schema.getFieldByName("slug") !== null;
    
    if (slugFieldExists) {
      collection.schema.removeField("slug");
    }
    
    return dao.saveCollection(collection);
  } catch (e) {
    // Collection doesn't exist, nothing to do
    console.log("Projects collection not found, skipping slug field removal");
  }
});
