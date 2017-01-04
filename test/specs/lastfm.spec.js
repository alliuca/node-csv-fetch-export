const expect = require('expect');
const request = require('supertest');

const config = require('../../config');
const { app } = require('./../../server');

describe('Last.fm API', () => {

  it('should fetch album info', (done) => {
    request(config.LASTFM_API_URL)
      .get(config.getAPIResource('album.getinfo', '&artist=Cher&album=Believe'))
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.body.album.name).toBe('Believe');
        expect(res.body.album.artist).toBe('Cher');
        done();
      });
  });

});