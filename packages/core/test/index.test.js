require('./wx')
const Debug = require('../src/libs/index').default

test('test event', (done) => {
        const badge = Debug.createBadge()

        Debug.event.on('debug:badge-' + badge.id + ':emit', (res) => {
            expect(res.show).toBe(true)
            done()
        })

        badge.emit({
            show: true
        })

})