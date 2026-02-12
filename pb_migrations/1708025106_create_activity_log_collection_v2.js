/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  const activity_log = new Collection({
    id: "cezfaeh64i1td6o",
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
    collectionId: "s6unrizwt1oxloj",
    required: false,
    presentable: false,
    multiple: false,
    cascadeDelete: true,
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
    indexed: false,
  }));

  activity_log.schema.addField(new JsonField({
    system: false,
    id: "activity_details",
    name: "details",
    type: "json",
    hidden: false,
    required: false,
    presentable: false,
  }));

  return dao.saveCollection(activity_log);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("cezfaeh64i1td6o");
  return dao.deleteCollection(collection);
})
