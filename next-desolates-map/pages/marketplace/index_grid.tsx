import Image from "next/image";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import solIcon from "../public/sol_coin.png";

const products = [
  {
    id: 1,
    name: "Earthen Bottle",
    author: "The NFT Magazine",
    verified: false,
    href: "#",
    price: "48",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg",
    imageAlt:
      "Tall slender porcelain bottle with natural clay textured body and cork stopper.",
  },
  {
    id: 2,
    name: "Nomad Tumbler",
    author: "The NFT Magazine",
    verified: true,
    href: "#",
    price: "0.35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 3,
    name: "Focus Paper Refill",
    author: "Nyla Collection",
    verified: false,
    href: "#",
    price: "89",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 4,
    name: "Machined Mechanical Pencil",
    author: "Crypto_chicks",
    verified: true,
    href: "#",
    price: "35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  {
    id: 5,
    name: "Machined Mechanical Pencil",
    author: "Crypto_chicks",
    verified: true,
    href: "#",
    price: "35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  {
    id: 6,
    name: "Focus Paper Refill",
    author: "Nyla Collection",
    verified: false,
    href: "#",
    price: "0.89",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg",
    imageAlt:
      "Person using a pen to cross a task off a productivity paper card.",
  },
  {
    id: 7,
    name: "Nomad Tumbler",
    author: "The NFT Magazine",
    verified: true,
    href: "#",
    price: "35",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    imageAlt:
      "Olive drab green insulated bottle with flared screw lid and flat top.",
  },
  {
    id: 8,
    name: "Machined Mechanical Pencil",
    author: "Crypto_chicks",
    verified: false,
    href: "#",
    price: "1.5",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg",
    imageAlt:
      "Hand holding black machined steel mechanical pencil with brass tip and top.",
  },
  // More products...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <div className="section bg-desolate-bg mt-80 sm:mt-10 lg:mt-0">
      <div className="container mt-80 pt-80 sm:pt-0 lg:mt-0 lg:pt-0">
        <div className="container_inner pt-80 sm:pt-0 lg:pt-0">
          <div className="pt-60">
            <div className="max-w-2xl mt-40 sm:mt-0 lg:mt-0 mb-0 pt-80 sm:pt-0 lg:pt-0 px-4 lg:max-h-full lg:max-w-full lg:px-8 lg:pb-5 lg:pt-20 ">
              <main className="max-w-7xl mx-auto px-4 py-8 sm:px-2 lg:px-2 lg:pb-6 ">
                <div className="pt-80 lg:pt-0 pb-2 relative z-10 flex items-baseline justify-between border-b border-gray-200">
                  <h2 className="text-3xl font-bold tracking-tight text-white font-exo">
                    NFTs For Sale
                  </h2>
                  <div className="flex items-center">
                    <div className="relative inline-block text-left">
                      <Menu
                        as="div"
                        className="relative inline-block text-left "
                      >
                        <div>
                          <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ">
                            Newest
                            <ChevronDownIcon
                              className="-mr-1 ml-2 h-5 w-5"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      "bg-gray-100 text-gray-900",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Newest
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Price
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href="#"
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Most popular
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm mt-2 text-white lg:pb-1">
                    {products.length} results
                  </p>
                </div>
              </main>

              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {products.map((product) => (
                  <a
                    key={product.id}
                    href={product.href}
                    className="group rounded-xl space-x-2"
                  >
                    <div className="rounded-xl w-52 h-65 mx-auto bg-gradient-to-r p-[4px] from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]	">
                      <div className="flex flex-col justify-between h-full bg-desolate-bg text-white rounded-lg ">
                        <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                          <Image
                            src={product.imageSrc}
                            alt={product.imageAlt}
                            layout="fill"
                            className="w-full h-full object-center object-cover group-hover:opacity-75	"
                          />
                        </div>
                        <div className="p-3">
                          <div className="flex items-center">
                            <p className="mt-1 text-lg font-cool font-bold text-gray-900 pr-1 text-gray-200">
                              {product.author}
                            </p>
                          </div>
                          <h3 className="mt-0 text-sm text-gray-500 font-exo truncate">
                            {product.name}
                          </h3>
                          <div className="flex items-center">
                            <Image
                              src={solIcon}
                              width="25px"
                              height="25px"
                              alt="SOL"
                            />
                            <p className="pl-2 mt-1 text-lg font-bold text-white">
                              {" "}
                              {product.price}
                              <span className="text-lg font-light text-white">
                                {" "}
                                SOL
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-10 pb-20 lg:pb-0 flex justify-center">
                <a
                  href="#"
                  className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 font-exo hover:bg-indigo-700"
                >
                  Load More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
