const request = require('request')
const uuidv4 = require('uuid/v4')
const fs = require('fs')

const writeStream = fs.createWriteStream('products.json')
writeStream.write('{ \n "products": \t[\n')

let styles = ["modern", "sartorial", "transitional", "traditional", "retro"]
let types = ["jeans", "T-shirt", "chair", "table", "wall art", "coffee", "beer", "accessory"]
// let itemTypes = ["shirt", "shorts", "socks", "pants", "jackets", "accessories"]
let sizes = ["small", "medium", "large", "xl", "xs"]
// let ages = ["Under 2", "2-4", "4-6", "6-8", "8 and Up"]


createRandomProducts(100)

function createRandomProducts(n) {
  request('http://hipsterjesus.com/api', (err, body, res) => {

    if(err) {
      console.log('error:', err)
      return
    }
    else {
      // console.log('body: ', body.body)
      let jsonRes = {}
      jsonRes = JSON.parse(body.body)
      const text = jsonRes.text
      // console.log(text)
      // start building a random product
      const textArray = text.split(' ')

      for(let i=0; i < n; i++) {
        writeProduct(textArray)
        writeStream.write(',\n')
      }

      writeProduct(textArray)
      writeStream.write('\n\t]\n}')
    }
  })
}

function randomString(data, length) {
  let answer = ""

  for(let i=0; i < length-1; i++) {
    let index = Math.floor(Math.random() * data.length)
    answer += data[index] + " "
  }
  let index = Math.floor(Math.random() * data.length)
  answer += data[index]

  return answer
}

const badIds = ['636', '792', '205', '578', '462', '895', '226',
                '644', '763', '601', '285', '470', '226', '148',
                '597', '303', '333', '332', '150', '748', '754',
                '734', '647', '712', '1034']

function writeProduct(textArray) {
  writeStream.write('\t\t')

  const product = {}

  let nameLength = Math.floor(Math.random() * 5)
  let descriptionLength = Math.floor(Math.random() * 15) + 8
  let numberTags = Math.floor(Math.random() * 3) + 4

  product.id = uuidv4()
  product.name = randomString(textArray, nameLength)
  product.description = randomString(textArray, descriptionLength)
  product.tags = []
  for(let i=0; i<numberTags; i++) {
    let index = Math.floor(Math.random() * textArray.length)
    product.tags.push(textArray[index])
  }
  product.style = styles[Math.floor(Math.random() * styles.length)]
  product.type  = types[Math.floor(Math.random() * types.length)]
  product.size  = sizes[Math.floor(Math.random() * sizes.length)]
  // product.age = ages[Math.floor(Math.random() * ages.length)]
  product.price = ((Math.random() * 20000)/100).toFixed(2)
  let imageId
  do {
    imageId = Math.floor(Math.random() * 1084)
  } while(badIds.includes(imageId.toString()))

  product.image = `https://unsplash.it/400/200?image=${imageId}`

  writeStream.write(JSON.stringify(product))
}
