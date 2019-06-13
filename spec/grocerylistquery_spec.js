const sequelize = require("../db/models/index").sequelize;
const User = require("../db/models").User;
const GroceryList = require("../db/models").GroceryList;
const ListItems = require("../db/models").ListItems;
const GroceryListQueries = require("../db/queries/grocerylistqueries.js");

describe("GroceryListQueries", () => {
  this.user;
  this.list;

  beforeEach((done) => {
    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });

    sequelize.sync({force: true}).then((res) => {

      User.create({
        handle: "testUser1"
      })
      .then((user) => {
        this.user = user;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

      GroceryList.create({
        listName: "testList1",
        active: true,
        createdBy: 1
      })
      .then((list) => {
        this.list = list;
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

      ListItems.create({
        itemName: "Item1",
        complete: false,
        listId: 1
      })
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

      ListItems.create({
        itemName: "Item2",
        complete: false,
        listId: 1
      })
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });

    });
  });

  describe("#listItems()", () => {
    it("should return a list of items belonging to the grocerylist", (done) => {
      GroceryListQueries.getAllItems(1, (err, items) => {
        if(err) {
          console.log(err);
        }
        else {
          expect(items).toBeDefined();
        }
      });
    });
  });
});
