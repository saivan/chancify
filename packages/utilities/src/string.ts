
import { v4 as uuid } from 'uuid'

export function titleCase (str: string) {
  return str.replace(/\b\w/g, l => l.toUpperCase())
}

export function snakeToTitleCase (str: string) {
  return titleCase(str.replace(/_/g, ' '))
}

export function kebabToTitleCase (str: string) {
  return titleCase(str.replace(/-/g, ' '))
}

export function camelToTitle(camelCaseStr: string): string {
  const words = camelCaseStr.match(/([A-Z]?[^A-Z]*)/g)?.filter(Boolean) || []
  const titleCaseStr = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  return titleCaseStr
}

export function sortableString(value: any): string {
  if (typeof value === 'number') return value.toString().padStart(40, '0')
  else if (value == null) return ''
  else if (value instanceof Date) return value.toISOString()
  else if (typeof value === 'string') return value
  else if (typeof value === 'boolean') return value ? 'true' : 'false'
  else if (typeof value === 'object') return JSON.stringify(value)
  else if (typeof value === 'symbol') return value.toString()
  else if (typeof value === 'function') return value.toString()
  else return ''
}


export function base16ToBase62(hex: string): string {
  const base62Chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  let decimal = BigInt(`0x${hex}`)
  let base62 = ''
  while (decimal > 0) {
    const remainder = decimal % 62n
    base62 = base62Chars[Number(remainder)] + base62
    decimal = decimal / 62n
  }
  return base62
}


export function uuidToShortString(uuid: string): string {
  const hex = uuid.replace(/-/g, '')
  return base16ToBase62(hex)
}


export function shortId () {
  const uuidString = uuid()
  const shortString = uuidToShortString(uuidString)
  return shortString
}


export function friendlyId() {
  const adjectives: string[] = [
      "jumping", "happy", "bright", "shiny", "brave", "calm", "eager",
      "fancy", "gentle", "kind", "lively", "mighty", "proud", "quick",
      "quiet", "silly", "witty", "zealous", "bold", "clever", "curious",
      "fierce", "graceful", "jolly", "keen", "loyal", "merry", "noble",
      "optimistic", "playful", "radiant", "spirited", "thoughtful",
      "upbeat", "vibrant", "wise", "youthful", "zany", "adventurous",
      "breezy", "cheerful", "daring", "elegant", "fearless", "gallant",
      "heroic", "inventive", "joyful", "kindhearted", "luminous",
      "mystical", "nurturing", "observant", "peaceful", "resilient",
      "serene", "tenacious", "uplifted", "valiant", "dynamic", "enthusiastic",
      "fearless", "gracious", "humble", "imaginative", "jubilant", "knowledgeable",
      "legendary", "motivated", "notable", "outgoing", "passionate", "reliable",
      "sincere", "trustworthy", "unique", "versatile", "warm", "xenial", "youthful",
      "zestful", "affectionate", "amiable", "charming", "delightful", "encouraging",
      "faithful", "friendly", "generous", "hilarious", "inspiring", "jovial",
      "likable", "modest", "neighborly", "open", "polite", "quiet", "respectful",
      "sociable", "tactful", "understanding", "vivacious", "welcoming", "xenodochial",
      "yare", "zippy", "agile", "bouncy", "chipper", "diligent", "energetic",
      "frisky", "giddy", "hearty", "intrepid", "jaunty", "keen", "lively",
      "mirthful", "nimble", "peppy", "quick", "rousing", "sprightly", "tireless",
      "upbeat", "vigorous", "whimsical", "zany", "zippy"
  ]
  const nouns: string[] = [
      "lion", "tiger", "bear", "eagle", "shark", "wolf", "panda",
      "fox", "owl", "whale", "dolphin", "hawk", "falcon", "dragon",
      "phoenix", "griffin", "unicorn", "pegasus", "panther", "jaguar",
      "lynx", "raven", "cobra", "cheetah", "leopard", "bison", "rhino",
      "giraffe", "zebra", "hippo", "elephant", "kangaroo", "koala",
      "otter", "penguin", "seal", "walrus", "chimp", "gorilla",
      "alligator", "crocodile", "gecko", "iguana", "lemur", "meerkat",
      "porcupine", "sloth", "tapir", "vulture", "wolverine", "yak",
      "armadillo", "badger", "beaver", "buffalo", "chameleon", "dingo",
      "emu", "flamingo", "gazelle", "hedgehog", "ibex", "jackal",
      "kiwi", "lemur", "manatee", "narwhal", "ocelot", "platypus",
      "quokka", "raccoon", "salamander", "toucan", "urchin", "viper",
      "wombat", "xerus", "yak", "zebu", "antelope", "barracuda", "caribou",
      "dromedary", "echidna", "ferret", "gibbon", "heron", "impala",
      "jellyfish", "kudu", "lobster", "mongoose", "newt", "octopus",
      "puffin", "quail", "roadrunner", "stork", "tarantula", "urchin",
      "vicuna", "weasel", "xerus", "yak", "zebu", "alpaca", "bison",
      "cassowary", "dugong", "eel", "flounder", "gazelle", "heron",
      "ibis", "jaguarundi", "kinkajou", "lemur", "marmoset", "nighthawk",
      "ocelot", "puma", "quetzal", "rhinoceros", "sable", "tamarin",
      "uakari", "vicuña", "wallaby", "xerus", "yabby", "zebu"
  ]
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective}-${noun}`
}



