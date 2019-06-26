const sequelize = require("../db/models/index").sequelize;
const User = require("../db/models").User;
const GroceryList = require("../db/models").GroceryList;
const ListItems = require("../db/models").ListItems;
const GroceryListQueries = require("../db/queries/grocerylistqueries.js");

beforeEach((done) => {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

    User.findOrCreate({where: {email: "testuser1@email.com"}, defaults: {
      handle: "testuser1",
      email: "testuser1@email.com",
      password: "password1",
      GroceryListId: [1]
    }})
    .then((user) => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

    User.findOrCreate({where: {email: "testuser2@email.com"}, defaults: {
      handle: "testuser2",
      email: "testuser2@email.com",
      password: "password2",
      GroceryListId: [1,2]
    }})
    .then((user) => {
      this.user1 = user;
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

    GroceryList.findOrCreate({where: {listName: "testList1"}, defaults: {
      listName: "testList1",
      active: true,
      createdBy: 1,
      UserId: [1,2]
    }})
    .then((list) => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

    GroceryList.findOrCreate({where: {listName: "testList2"}, defaults: {
      listName: "testList2",
      active: true,
      createdBy: 2,
      UserId: [2]
    }})
    .then((list) => {
      this.list = list;
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

    ListItems.findOrCreate({where: {itemName: "Item1-1"}, defaults: {
      itemName: "Item1-1",
      complete: false,
      listId: 1
    }})
    .then((res) => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

    ListItems.findOrCreate({where: {itemName: "Item1-2"}, defaults: {
      itemName: "Item1-2",
      complete: false,
      listId: 1
    }})
    .then((res) => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

    ListItems.findOrCreate({where: {itemName: "Item2-1"}, defaults: {
      itemName: "Item2-1",
      complete: false,
      listId: 2
    }})
    .then((res) => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

    ListItems.findOrCreate({where: {itemName: "Item2-2"}, defaults: {
      itemName: "Item2-2",
      complete: false,
      listId: 2
    }})
    .then((res) => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });
  });


describe("GroceryListQueries", () => {
  
  describe("#getAllItems()", () => {
    it("should return a list of items belonging to the grocerylist", (done) => {
      GroceryListQueries.getAllItems(1, (err, items) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          console.log(items);
          expect(items[0].itemName).toBe("Item1-1");
          expect(items[1].itemName).toBe("Item1-2");
          done();
        }
      });
    });
  });

  describe("#getUserMembers()", () => {
    it("should return a list of users shared on a grocerylist", (done) => {
      GroceryListQueries.getUserMembers(2, (err, users) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          console.log(users);
          expect(users[0].handle).toBe("testuser2")
          done();
        }
      });
    });
  });

  describe("#getGroceryLists()", () => {
    it("should return a list of grocery lists that a user belongs to", (done) => {
      GroceryListQueries.getGroceryLists(2, (err, lists) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          console.log(lists);
          expect(lists).toBeDefined();
          done();
        }
      });
    });
  });

  describe("#addUserToList()", () => {
    it("should add a user id to a grocery list's UserId array field", (done) => {
      GroceryListQueries.addUserToList(2, 1, (err, rows) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          expect(rows[0]).toBe(1);
          done();
        }
      });
    });
  });

  describe("#addListToUser()", () => {
    it("should add a grocery list to a user's GroceryListId field", (done) => {
      GroceryListQueries.addListToUser(2, 2, (err, rows) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          expect(rows[0]).toBe(1);
          done();
        }
      });
    });
  });

  describe("#removeUserFromList()", () => {
    it("should find a remove a user id from a grocery list's UserId array field", (done) => {
      GroceryListQueries.removeUserFromList(1, 1, (err, rows) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          expect(rows[0]).toBe(1);
          done();
        }
      });
    });
  });

  describe("#removeListFromUser()", () => {
    it("should find a remove a grocery list id from a user's GroceryListId array field", (done) => {
      GroceryListQueries.removeListFromUser(2, 1, (err, rows) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          expect(rows[0]).toBe(1);
          done();
        }
      });
    });
  });

  describe("#deleteList()", () => {
    it("should soft delete the appropriate row from the GroceryList table", (done) => {
      GroceryListQueries.deleteList(1, (err, rows) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          expect(rows).toBe(1);
          done();
        }
      });
    });
  });

  describe("#deleteListItem()", () => {
    it("should soft delete the appropriate row from the ListItems table", (done) => {
      GroceryListQueries.deleteListItem(1, (err, rows) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          expect(rows).toBe(1);
          done();
        }
      });
    });
  });

  describe("#updateListItem()", () => {
    it("Should update a list item using an item list object and return 1 in an array", (done) => {
      var newItem = {
        id: 2,
        itemName: "Item1-2",
        complete: true,
        listId: 1
      }
      GroceryListQueries.updateListItem(newItem, (err, rows) => {
        if(err) {
          console.log(err);
          done();
        }
        else {
          expect(rows[0]).toBe(1);
          done();
        }
      });
    });
  });
});
