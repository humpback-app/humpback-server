import test from 'ava';
import {md5Image} from '../../src/util/md5Image.js';

test('md5Image', (t) => {
  const albumHash = md5Image(
    'https://cdns-images.dzcdn.net/images/cover/2e018122cb56986277102d2041a592c8/1000x1000-000000-80-0-0.jpg',
  );
  t.is(albumHash, '2e018122cb56986277102d2041a592c8');

  const artistHash = md5Image(
    'https://cdns-images.dzcdn.net/images/artist/f2bc007e9133c946ac3c3907ddc5d2ea/1000x1000-000000-80-0-0.jpg',
  );
  t.is(artistHash, 'f2bc007e9133c946ac3c3907ddc5d2ea');
});
