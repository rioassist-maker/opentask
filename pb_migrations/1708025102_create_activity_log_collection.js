/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  const activity_log = new Collection({
    id: "activity_log",
    name: "activity_log",
    type: "base",
    system: false,
    auth: false,
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
  });

  activity_log.schema.addField(new RelationField({
    system: false,
    id: "activity_task",
    name: "task",
    type: "relation",
    collectionId: "tasks",
    required: false,
    presentable: false,
    multiple: false,
  }));

  activity_log.schema.addField(new TextField({
    system: false,
    id: "activity_actor",
    name: "actor",
    type: "text",
    hidden: false,
    unique: false,
    required: false,
    presentable: false,
    indexed: false,
  }));

  activity_log.schema.addField(new SelectField({
    system: false,
    id: "activity_action",
    name: "action",
    type: "select",
    hidden: false,
    maxSelect: 1,
    values: ["created", "updated", "assigned", "completed", "commented", "status_changed"],
    required: false,
    presentable: false,
  }));

  activity_log.schema.addField(new TextField({
    system: false,
    id: "activity_details",
    name: "details",
    type: "text",
    hidden: false,
    unique: false,
    required: false,
    presentable: false,
    indexed: false,
  }));

  return dao.saveCollection(activity_log);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("activity_log");
  return dao.deleteCollection(collection);
})
