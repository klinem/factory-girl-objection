process.env.NODE_ENV = 'test';

var adapter = require('..')();
var config = require('config');
var Factory = require('factory-girl').Factory;
var tests = require('factory-girl/lib/adapter-tests');
var Model = require('objection').Model;

describe('Objection adapter', () => {
  init();

  function Author() {
    Model.apply(this, arguments);
  }
  Author.tableName = 'authors';
  Model.extend(Author);

  function Book() {
    Model.apply(this, arguments);
  }
  Book.tableName = 'books';
  Model.extend(Book);

  Author.relationMappings = {
    books: {
      relation: Model.OneToManyRelation,
      modelClass: Book,
      join: {
        from: 'authors.id',
        to: 'books.author_id'
      }
    }
  };

  Book.relationMappings = {
    author: {
      relation: Model.OneToOneRelation,
      modelClass: Author,
      join: {
        from: 'books.author_id',
        to: 'authors.id'
      }
    }
  };

  tests(adapter, Author, countModels);

  describe('associations', function () {
    var factory;

    before(function () {
      factory = new Factory();
      factory.setAdapter(adapter);

      factory.define('author', Author);
      factory.define('book', Book, {
        author_id: factory.assoc('author', 'id')
      });
    });

    it('creates hasMany', function (done) {
      factory.create('book', function (err, book) {
        if (err) return done(err);
        book.should.be.an.instanceOf(Book);
        book.$relatedQuery('author')
          .eager('books')
          .then(function (author) {
            author[0].should.be.an.instanceOf(Author);
            author[0].books.length.should.equal(1);

            done();
          })
          .catch(done);
      });
    });
  });

  function countModels(cb) {
    Author.query().count('id as count').then(function (result) {
      return cb(null, result[0].count);
    }, cb);
  }
});

function init() {
  var knex = require('knex')(config.get('database'));
  Model.knex(knex);

  before(function () {
    return knex.schema.dropTableIfExists('books')
      .then(function () {
        return knex.schema.dropTableIfExists('authors');
      })
      .then(function () {
        return knex.schema.createTable('authors', function (t) {
          t.increments();
          t.string('name')
        });
      })
      .then(function () {
        return knex.schema.createTable('books', function (t) {
          t.increments();
          t.integer('author_id').references('author.id');
        });
      });
  });
}
