const { GraphQL } = require('@graphite/server')
const { get } = require('lodash')

const { loaderSearchArtist, loaderAlbumsByArtist  } = require('../loaders')

const Artist = GraphQL('Artist')({
  id: ['ID'],
  name: ['String'],
  genres: ['[String]'],
  popularity: ['String'],
  type: ['String'],
  followers: ['String'],

  'images: [Image]': (artist = {}) => get(artist, 'images', null),

  'albums: [Album]': async({ id }) => {
    const { items = [] } = await loaderAlbumsByArtist.load(id)
    return items
  },

  Query: {
    'getArtists(artist: String!): [Artist]': async(_, { artist }) => {
      const data = await loaderSearchArtist.load(artist)
      const items = get(data, 'artists.items', [])
      return items.map(item => mapArtist(item))
    },
  },
})

const mapArtist = (artist = {}) => {
  const followers = get(artist, 'followers.total', '0')
  return { ...artist, followers }
}


module.exports = { Artist, mapArtist }
