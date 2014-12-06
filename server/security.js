function trueFunc() {return true;}
function falseFunc() {return false;}

Meteor.startup(function() {

    Collections.Files.allow({
      insert: trueFunc,
      update: trueFunc,
      remove: trueFunc,
      download: trueFunc
    });

    Collections.Files.deny({
      insert: falseFunc,
      update: falseFunc,
      remove: falseFunc,
      download: falseFunc
    });

    Collections.Images.allow({
      insert: trueFunc,
      update: trueFunc,
      remove: trueFunc,
      download: trueFunc
    });

    Collections.Images.deny({
      insert: falseFunc,
      update: falseFunc,
      remove: falseFunc,
      download: falseFunc
    });

    Collections.Docs.allow({
      insert: trueFunc,
      update: trueFunc,
      remove: trueFunc
    });

    Collections.Docs.deny({
      insert: falseFunc,
      update: falseFunc,
      remove: falseFunc
    });

    Collections.Docs2.allow({
      insert: trueFunc,
      update: trueFunc,
      remove: trueFunc
    });

    Collections.Docs2.deny({
      insert: falseFunc,
      update: falseFunc,
      remove: falseFunc
    });
});
