var Lab = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();
var AdminGroup = require('../../models/admin-group');


lab.experiment('AdminGroup Class Methods', function () {

    lab.before(function (done) {

        AdminGroup.connect(function (err, db) {

            done(err);
        });
    });


    lab.after(function (done) {

        AdminGroup.remove({}, function (err, result) {

            AdminGroup.disconnect();

            done(err);
        });
    });


    lab.test('it returns a new instance when create succeeds', function (done) {

        AdminGroup.create('Sales', function (err, result) {

            Code.expect(err).to.not.exist();
            Code.expect(result).to.be.an.instanceOf(AdminGroup);

            done();
        });
    });


    lab.test('it returns an error when create fails', function (done) {

        var realInsert = AdminGroup.insert;
        AdminGroup.insert = function () {

            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();

            callback(Error('insert failed'));
        };

        AdminGroup.create('Support', function (err, result) {

            Code.expect(err).to.be.an.object();
            Code.expect(result).to.not.exist();

            AdminGroup.insert = realInsert;

            done();
        });
    });
});


lab.experiment('AdminGroup Instance Methods', function () {

    lab.before(function (done) {

        AdminGroup.connect(function (err, db) {

            done(err);
        });
    });


    lab.after(function (done) {

        AdminGroup.remove({}, function (err, result) {

            AdminGroup.disconnect();

            done(err);
        });
    });


    lab.test('it returns false when permissions are not found', function (done) {

        AdminGroup.create('Sales', function (err, adminGroup) {

            Code.expect(err).to.not.exist();
            Code.expect(adminGroup).to.be.an.instanceOf(AdminGroup);
            Code.expect(adminGroup.hasPermissionTo('SPACE_MADNESS')).to.equal(false);

            done();
        });
    });


    lab.test('it returns boolean values for set permissions', function (done) {

        AdminGroup.create('Support', function (err, adminGroup) {

            Code.expect(err).to.not.exist();
            Code.expect(adminGroup).to.be.an.instanceOf(AdminGroup);

            adminGroup.permissions = {
                SPACE_MADNESS: true,
                UNTAMED_WORLD: false
            };

            Code.expect(adminGroup.hasPermissionTo('SPACE_MADNESS')).to.equal(true);
            Code.expect(adminGroup.hasPermissionTo('UNTAMED_WORLD')).to.equal(false);

            done();
        });
    });
});
