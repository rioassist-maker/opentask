/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  const tasks = new Collection({
    id: "tasks",
    name: "tasks",
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

  tasks.schema.addField(new TextField({
    system: false,
    id: "tasks_title",
    name: "title",
    type: "text",
    hidden: false,
    unique: false,
    required: true,
    presentable: false,
    indexed: false,
  }));

  tasks.schema.addField(new TextField({
    system: false,
    id: "tasks_description",
    name: "description",
    type: "text",
    hidden: false,
    unique: false,
    required: false,
    presentable: false,
    indexed: false,
  }));

  tasks.schema.addField(new RelationField({
    system: false,
    id: "tasks_project",
    name: "project",
    type: "relation",
    collectionId: "projects",
    required: false,
    presentable: false,
    multiple: false,
  }));

  tasks.schema.addField(new SelectField({
    system: false,
    id: "tasks_status",
    name: "status",
    type: "select",
    hidden: false,
    maxSelect: 1,
    values: ["backlog", "in_progress", "blocked", "done"],
    required: false,
    presentable: false,
  }));

  tasks.schema.addField(new SelectField({
    system: false,
    id: "tasks_assigned_to",
    name: "assigned_to",
    type: "select",
    hidden: false,
    maxSelect: 1,
    values: ["human", "pm", "developer", "reviewer", "test-architect", "security-auditor"],
    required: false,
    presentable: false,
  }));

  tasks.schema.addField(new TextField({
    system: false,
    id: "tasks_assigned_human",
    name: "assigned_human",
    type: "text",
    hidden: false,
    unique: false,
    required: false,
    presentable: false,
    indexed: false,
  }));

  tasks.schema.addField(new SelectField({
    system: false,
    id: "tasks_priority",
    name: "priority",
    type: "select",
    hidden: false,
    maxSelect: 1,
    values: ["low", "medium", "high", "urgent"],
    required: false,
    presentable: false,
  }));

  tasks.schema.addField(new TextField({
    system: false,
    id: "tasks_created_by",
    name: "created_by",
    type: "text",
    hidden: false,
    unique: false,
    required: false,
    presentable: false,
    indexed: false,
  }));

  tasks.schema.addField(new DateField({
    system: false,
    id: "tasks_completed_at",
    name: "completed_at",
    type: "date",
    hidden: false,
    required: false,
    presentable: false,
  }));

  return dao.saveCollection(tasks);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tasks");
  return dao.deleteCollection(collection);
})
