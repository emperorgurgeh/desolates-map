import Image from "next/image"
import solIcon from '../public/sol_coin.png'
import product_img from '../public/product1.png'

const product = {
  name: '#03 REFIK ANADOL',
  href: '#',
  price: '2.72',
  description:
    "Welcome to The first NFT Magazine to be read and collected on Ethereum! With this NFT Cover, you can access the exclusive READERS CLUB to read the magazine and participate in decisions on the topics to be included, rankings, interviews, cover, and more of THE NFT MAGAZINE!",
  imageSrc: product_img,
  imageAlt: 'Model wearing light green backpack with black canvas straps and front zipper pouch.',
  breadcrumbs: [
    { id: 1, name: 'NFT', href: '#' },
    { id: 2, name: 'NFT Magazine', href: '#' },
  ],
  sizes: [
    { name: '18L', description: 'Perfect for a reasonable amount of snacks.' },
    { name: '20L', description: 'Enough room for a serious amount of snacks.' },
  ],
}
const reviews = { average: 4, totalCount: 1624 }

export default function Example() {

  return (
    <div className="bg-desolate-bg mt-10 md:mt-10 lg:mt-0">
      <div className="max-w-2xl mx-5 mt-40 mb-20 pt-80 px-4 lg:max-w-7xl lg:px-8 lg:mt-0 lg:pt-10 lg:grid lg:grid-cols-2 lg:gap-x-8">
      <div className=" lg:flex lg:justify-left">
        <button
            type="button"
            className="inline-flex items-center font-exo px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← Back to MarketPlace
          </button>
      </div>
                  {/* Product image */}
        <div className="mt-10 lg:mt-0 lg:col-start-1 lg:row-span-2 lg:self-center ">
          <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border border-white-500 hover:shadow-lg">
            <Image src={product.imageSrc} alt={product.imageAlt} className="w-full h-full object-center object-cover " layout="fill" />
          </div>
        </div>
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end lg:col-start-2">
          <div className="mt-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-cool sm:text-4xl">{product.name}</h1>
          </div>
          <section aria-labelledby="information-heading" className="mt-4">
            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>
            <div className="flex items-center">
            <Image src={solIcon} width="25px" height="25px" alt="SOL" /><p className="pl-2 text-lg text-white font-bold sm:text-xl">{product.price}</p><p className="pl-2 text-lg text-white sm:text-xl"> SOL</p>
            </div>
            <div className="mt-6 flex items-center bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 font-exo">Creator</h3>
        <a className="mt-1 max-w-2xl text-sm text-gray-500 font-exo" href="#">HAKk...fDTk </a>
      </div>
    </div>
            <div className="mt-4 space-y-2">
    <p className="mt-6 block text-sm font-medium text-white">Description</p>
              <p className="text-base text-white font-exo">{product.description}</p>
            </div>
    <p className="mt-6 mb-2 block text-sm font-medium text-white">Attributes</p>
<div className="mt-0 flex items-center bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 font-exo">Attribute Name</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500 font-exo">Attribute Value</p>
      </div>
    </div>
          </section>
        </div>
        {/* Product form */}
        <div className="lg:mt-0 lg:max-w-lg lg:col-start-2 lg:row-start-3 lg:self-start">
          <section aria-labelledby="options-heading">
            <form>
              <div className="lg:flex mt-10 flex justify-center lg:justify-left">
                <button
                  type="submit"
                  className="w-60 bg-indigo-600 font-exo border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                  Buy Now
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
