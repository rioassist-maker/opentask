/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s6unrizwt1oxloj")

  // add mentions field
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mentions_field",
    "name": "mentions",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("s6unrizwt1oxloj")

  // remove mentions field
  collection.schema.removeField("mentions_field")

  return dao.saveCollection(collection)
})
