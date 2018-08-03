let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
let expect = chai.expect;
let should = chai.should();
let scholar = require('../index');

describe('papers', () => {
	
	var results;

	it('search should return an object.', (done) => {

		expect(scholar.search("chairmouse")).to.eventually.be.an('object').then(function(promiseResults) {
			
			results = promiseResults;
			console.log(JSON.stringify(results));
		
		}).should.notify(done);
		
	}).timeout(0);
	
	it('search should return results.', () => {
		
		expect(results.results).to.be.an('array');
		
	});

});