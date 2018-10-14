'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function () {
  it('should return the default of 10 Notes as an array', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(9);
      });
  });

  it('should return an array of objects with the id, title, and content', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(res => {
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });

  it('should return correct search results for a valid query', function() {
    let searchQuery = 'boring';
    return chai.request(app)
      .get(`/api/notes/?searchTerm=${searchQuery}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.at.least(1);
        res.body.forEach(function(item) {
          expect(item.title).to.include.string(`${searchQuery}`);
        });
      });
  });

  it('should return an empty array for an incorrect query', function() {
    let searchQuery ='boring123';
    return chai.request(app)
      .get(`/api/notes/?searchTerm=${searchQuery}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array').that.is.empty;
      });
  });
});
//END /api/notes test

describe('POST /api/notes/:id', function() {
  it('should return correct note object', function() {
    let noteId = 1001;
    return chai.request(app)
      .get(`/api/notes/${noteId}`)
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.all.keys('id', 'title','content');
        expect(res.body.id).to.equal(noteId);
      });
  });

  it('should respond with a 404 for an invalid id', function() {
    let noteId = 2001;
    return chai.request(app)
      .get(`/api/notes/${noteId}`)
      .then(res => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.keys('message');
      });
  });
});
//END /api/notes/:id test

describe('POST /api/notes', function() {
  it('should create and return a new item with location header when provided valid data', function() {
    const newNote = {title: 'our test note', content: 'test note body content1'};
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(res => {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newNote, {id: res.body.id}));
      });
  });
  it('should return an object with a message property "Missing title in request body" when missing "title" field' , function() {
    const newNote = {content: 'test note body content1'};
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(res => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.string('Missing `title` in request body');
      });
  });

});
//END POST /api/notes

describe('PUT/api/notes/:id', function(){
  it('should update and return a note object when given valid data', function(){
    const updateNote = { title:'boring15', content:'more content to test with eh' };
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        updateNote.id = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${updateNote.id}`)
          .send(updateNote);
      })
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res).to.be.a('object');
        expect(res.body).to.deep.equal(updateNote);
      });

  });

  it('should respond with a 404 for an invalid id', function(){
    const updateNote = { id:2010, title:'borin16', content:'hey, we just testing over here.' };
    return chai.request(app)
      .put(`/api/notes/${updateNote.id}`)
      .send(updateNote)
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });

  it('should return an object with a message property "Missing `title` in request body" when missing "title" field', function(){
    const updateNote = {id:'1015', title: '', content:'we testin and having fun!' };
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        updateNote.id = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${updateNote.id}`)
          .send(updateNote);
      })
      .then(function(res){
        expect(res.body.message).to.be.string('Missing `title` in request body');
      });
  });

});

describe('DELETE/api/notes/:id', function(){
  it('should delete item by id', function(){
    return chai.request(app)
      .get('/api/notes/')
      .then(function(res){
        return chai.request(app).delete(`/api/notes/${res.body[0].id}`);
      })
      .then(function(res){
        expect(res).to.have.status(204);
      });
  });
});