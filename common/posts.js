

// push "fileId" property to addToPostSchema, so that it's later added to postSchema

addToPostSchema.push(
  {
    propertyName: 'Files',
    propertySchema: {
      type: '[String]',
      optional: true,
      editable: true,
      autoform: {
        type: "cfs-files",
        collection: "files"
      }
    }
  }
);

