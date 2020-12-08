require('./wx');
const Debug = require('../src/index').default;

test('test event', done => {
  const badge = Debug.createBadge();

  Debug.event.on('debug:badge-' + badge.id + ':emit', res => {
    expect(res.show).toBe(true);
    done();
  });

  badge.emit({
    show: true
  });
});

test('test event emit result', done => {
  function returnPromiseA(v) {
    return Promise.resolve(v);
  }

  function returnPromiseB(v) {
    return Promise.resolve(++v);
  }

  Debug.event.on('debug:test-promise', returnPromiseA);
  Debug.event.on('debug:test-promise', returnPromiseB);

  const result = Debug.event.emit('debug:test-promise', 1);
  Promise.all(result).then(res => {
    expect(res).toStrictEqual([1, 2]);
    done();
  });
});
