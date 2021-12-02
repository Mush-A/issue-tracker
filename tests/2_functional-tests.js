const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const projectTest = "apitest";

let newIssueToDelete;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // this.timeout(5000);
  test('Valid POST with every field request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .post('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      issue_title: "test",
      issue_text: "test",
      created_by: "test",
      assigned_to: "test",
      status_text: "test"
    })
    .end(function (err, res) {
      newIssueToDelete = res.body._id;

      assert.equal(res.body.assigned_to, 'test');
      assert.equal(res.body.status_text, 'test');
      assert.equal(res.body.issue_text, 'test');
      assert.equal(res.body.issue_title, 'test');
      assert.equal(res.body.created_by, 'test');
      assert.equal(res.body.open, true);
      assert.isNotNull(res.body._id);
      assert.isNotNull(res.body.created_on);
      assert.isNotNull(res.body.updated_on);
      done();
    });
  });

  test('Valid POST with required field request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .post('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      issue_title: "test",
      issue_text: "test",
      created_by: "test"
    })
    .end(function (err, res) {
      assert.equal(res.body.assigned_to, '');
      assert.equal(res.body.status_text, '');
      assert.equal(res.body.issue_text, 'test');
      assert.equal(res.body.issue_title, 'test');
      assert.equal(res.body.created_by, 'test');
      assert.equal(res.body.open, true);
      assert.isNotNull(res.body._id);
      assert.isNotNull(res.body.created_on);
      assert.isNotNull(res.body.updated_on);
      done();
    });
  });

  test('Invalid POST with missing required field request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .post('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({})
    .end(function (err, res) {
      assert.equal(res.body.error, 'required field(s) missing');
      done();
    });
  });

  test('Valid GET request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .get('/api/issues/' + projectTest)
    .end(function (err, res) {
      assert.isArray(res.body);
      done();
    });
  });

  test('Valid GET, with one filter, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .get('/api/issues/' + projectTest + '?open=false')
    .end(function (err, res) {
      assert.isArray(res.body);
      res.body.map(issue => assert.equal(issue.open, false))
      done();
    });
  });

  test('Valid GET, with multiple filters, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .get('/api/issues/' + projectTest + '?open=true&issue_title=test')
    .end(function (err, res) {
      assert.isArray(res.body);
      res.body.map(issue => {
        assert.equal(issue.open, true);
        assert.equal(issue.issue_title, 'test')
      })
      done();
    });
  });

  test('Valid PUT, update one field, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .put('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      _id: '61a38a7e56f766eb32f9b2a0',
      issue_title: 'updated_test'
    })
    .end(function (err, res) {
      assert.equal(res.body.result, 'successfully updated');
      assert.equal(res.body._id, '61a38a7e56f766eb32f9b2a0');
      done();
    });
  });

  test('Valid PUT, update multiple field, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .put('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      _id: '61a38a7e56f766eb32f9b2a0',
      issue_title: 'updated_test',
      issue_text: 'updated_test'
    })
    .end(function (err, res) {
      assert.equal(res.body.result, 'successfully updated');
      assert.equal(res.body._id, '61a38a7e56f766eb32f9b2a0');
      done();
    });
  });

  test('Valid PUT, update no field, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .put('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      _id: '61a38a7e56f766eb32f9b2a0'
    })
    .end(function (err, res) {
      assert.equal(res.body.error, 'no update field(s) sent');
      assert.equal(res.body._id, '61a38a7e56f766eb32f9b2a0');
      done();
    });
  });

  test('Valid PUT, missing _id, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .put('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({})
    .end(function (err, res) {
      assert.equal(res.body.error, 'missing _id');
      done();
    });
  });

  test('Valid PUT, invalid _id, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .put('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      _id: '61a38a7e56f766eb32f9b2a0XX',
      issue_title: 'updated_test'
    })
    .end(function (err, res) {
      assert.equal(res.body.error, 'could not update');
      assert.equal(res.body._id, '61a38a7e56f766eb32f9b2a0XX');
      done();
    });
  });

  test('Valid DELETE request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .delete('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      _id: newIssueToDelete
    })
    .end(function (err, res) {
      assert.equal(res.body.result, 'successfully deleted');
      assert.equal(res.body._id, newIssueToDelete);
      done();
    });
  });

  test('Valid DELETE, invalid id, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .delete('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({
      _id: '61a38a7e56f766eb32f9b2a0XX'
    })
    .end(function (err, res) {
      assert.equal(res.body.error, 'could not delete');
      assert.equal(res.body._id, '61a38a7e56f766eb32f9b2a0XX');
      done();
    });
  });

  test('Valid DELETE, missing id, request to /api/issues/' + projectTest, function (done) {
    chai
    .request(server)
    .delete('/api/issues/' + projectTest)
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({})
    .end(function (err, res) {
      assert.equal(res.body.error, 'missing _id');
      done();
    });
  });
});
