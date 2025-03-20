import { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { RadioGroup } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByIdAsync, selectProductsById } from '../productSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCartAsync, selectItems } from '../../cart/CartSlice';
import { selectLoggedInUserData } from '../../user/userSlice';
import { discountPrice } from '../../../app/const';

// TODO: In server data we will add colors, sizes , highlights. to each product

const colors = [
  { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400' },
  { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400' },
  { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900' },
];
const sizes = [
  { name: 'XXS', inStock: false },
  { name: 'XS', inStock: true },
  { name: 'S', inStock: true },
  { name: 'M', inStock: true },
  { name: 'L', inStock: true },
  { name: 'XL', inStock: true },
  { name: '2XL', inStock: true },
  { name: '3XL', inStock: true },
];

const highlights = [
  'Hand cut and sewn locally',
  'Dyed with our proprietary colors',
  'Pre-washed & pre-shrunk',
  'Ultra-soft 100% cotton',
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// TODO : Loading UI  

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[2]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const product = useSelector(selectProductsById);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedInUserData);
  const items = useSelector(selectItems);

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/600x400?text=Product+Image';
    e.target.onerror = null; // Prevent infinite error loop
  };

  // Get a reliable image URL with fallback
  const getImageUrl = (imageUrl, index) => {
    if (!imageUrl || imageUrl.includes('dummyjson.com')) {
      // For dummyjson.com URLs that are failing, use placeholder
      return `https://placehold.co/600x400?text=Product+${index || ''}`;
    }
    return imageUrl;
  };
  
  const handleCart = (e) => {
    e.preventDefault();
    if (!product) {
      console.error('Cannot add to cart: Product data is missing');
      return;
    }
    
    if (!user || !user.id) {
      console.error('Cannot add to cart: User is not logged in');
      alert('You must be logged in to add items to cart');
      navigate('/login');
      return;
    }
    
    if (items.findIndex(item => item.product && item.product.id === product.id) < 0) {
      const newProduct = {
        product: product.id,
        user: user.id,
        quantity: 1
      };
      dispatch(addToCartAsync(newProduct));
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000); // Hide message after 3 seconds
    } else {
      console.log("Product already exists in cart");
      alert("This product is already in your cart");
    }
  };
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log('ProductDetail - Loading product with ID:', params.id);
    
    const fetchProduct = async () => {
      try {
        // Check if the ID is a valid MongoDB ObjectId or a numeric ID
        if (!/^[0-9a-fA-F]{24}$/.test(params.id) && isNaN(parseInt(params.id))) {
          console.error('Invalid product ID format:', params.id);
          setError(`The product ID "${params.id}" is not valid. Please check the URL and try again.`);
          setLoading(false);
          return;
        }

        console.log('Dispatching fetchProductsByIdAsync with ID:', params.id);
        await dispatch(fetchProductsByIdAsync(params.id)).unwrap();
        console.log('Product loaded successfully');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [dispatch, params.id]);
  
  // If loading, show loading message
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // If error or no product, show error message
  if (error || !product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Product Not Available</h2>
          <p className="text-gray-600 mb-8">{error || "We couldn't find the product you're looking for. It may have been removed or is temporarily unavailable."}</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {addedToCart && (
        <div className="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span><strong>{product.title}</strong> has been added to your cart!</span>
          </div>
        </div>
      )}
      
      <div className="pt-6">
        <nav aria-label="Breadcrumb">
          <ol
            className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
          >
            {product.breadcrumbs &&
              product.breadcrumbs.map((breadcrumb) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center">
                    <a
                      href={breadcrumb.href}
                      className="mr-2 text-sm font-medium text-gray-900"
                    >
                      {breadcrumb.name}
                    </a>
                    <svg
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="h-5 w-4 text-gray-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  </div>
                </li>
              ))}
            <li className="text-sm">
              <a
                href="#"
                aria-current="page"
                className="font-medium text-gray-500 hover:text-gray-600"
              >
                {product.title}
              </a>
            </li>
          </ol>
        </nav>

        {/* Image gallery */}
        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
          <div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
            <img
              src={getImageUrl(product.images && product.images.length > 0 ? product.images[0] : product.thumbnail, 1)}
              alt={product.title}
              className="h-full w-full object-cover object-center"
              onError={handleImageError}
            />
          </div>
          <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={getImageUrl(product.images && product.images.length > 1 ? product.images[1] : product.thumbnail, 2)}
                alt={product.title}
                className="h-full w-full object-cover object-center"
                onError={handleImageError}
              />
            </div>
            <div className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg">
              <img
                src={getImageUrl(product.images && product.images.length > 2 ? product.images[2] : product.thumbnail, 3)}
                alt={product.title}
                className="h-full w-full object-cover object-center"
                onError={handleImageError}
              />
            </div>
          </div>
          <div className="aspect-h-5 aspect-w-4 lg:aspect-h-4 lg:aspect-w-3 sm:overflow-hidden sm:rounded-lg">
            <img
              src={getImageUrl(product.images && product.images.length > 3 ? product.images[3] : product.thumbnail, 4)}
              alt={product.title}
              className="h-full w-full object-cover object-center"
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Product info */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {product.title}
            </h1>
          </div>

          {/* Options */}
          <div className="mt-4 lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl line-through tracking-tight text-gray-400">
             ${product.price ? product.price : 0}
            </p>
            <p className="text-3xl tracking-tight text-gray-900">
             ${product.price ? discountPrice(product.price, product.discountPercentage || 0) : 0}
            </p>
            {/* Reviews */}
            <div className="mt-6">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product.rating > rating
                          ? 'text-gray-900'
                          : 'text-gray-200',
                        'h-5 w-5 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
              </div>
            </div>

            <form className="mt-10">
              {/* Colors */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>

                <RadioGroup
                  value={selectedColor}
                  onChange={setSelectedColor}
                  className="mt-4"
                >
                  <RadioGroup.Label className="sr-only">
                    Choose a color
                  </RadioGroup.Label>
                  <div className="flex items-center space-x-3">
                    {colors.map((color) => (
                      <RadioGroup.Option
                        key={color.name}
                        value={color}
                        className={({ active, checked }) =>
                          classNames(
                            color.selectedClass,
                            active && checked ? 'ring ring-offset-1' : '',
                            !active && checked ? 'ring-2' : '',
                            'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none'
                          )
                        }
                      >
                        <RadioGroup.Label as="span" className="sr-only">
                          {color.name}
                        </RadioGroup.Label>
                        <span
                          aria-hidden="true"
                          className={classNames(
                            color.class,
                            'h-8 w-8 rounded-full border border-black border-opacity-10'
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Sizes */}
              {product.category && 
               ['clothing', 'apparel', 'fashion', 'mens-shirts', 'womens-dresses', 'mens-shoes', 'womens-shoes'].includes(product.category.toLowerCase()) ? (
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <a
                      href="#"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Size guide
                    </a>
                  </div>

                  <RadioGroup
                    value={selectedSize}
                    onChange={setSelectedSize}
                    className="mt-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a size
                    </RadioGroup.Label>
                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                      {sizes.map((size) => (
                        <RadioGroup.Option
                          key={size.name}
                          value={size}
                          disabled={!size.inStock}
                          className={({ active }) =>
                            classNames(
                              size.inStock
                                ? 'cursor-pointer bg-white text-gray-900 shadow-sm'
                                : 'cursor-not-allowed bg-gray-50 text-gray-200',
                              active ? 'ring-2 ring-indigo-500' : '',
                              'group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6'
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <RadioGroup.Label as="span">
                                {size.name}
                              </RadioGroup.Label>
                              {size.inStock ? (
                                <span
                                  className={classNames(
                                    active ? 'border' : 'border-2',
                                    checked
                                      ? 'border-indigo-500'
                                      : 'border-transparent',
                                    'pointer-events-none absolute -inset-px rounded-md'
                                  )}
                                  aria-hidden="true"
                                />
                              ) : (
                                <span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200"
                                >
                                  <svg
                                    className="absolute inset-0 h-full w-full stroke-2 text-gray-200"
                                    viewBox="0 0 100 100"
                                    preserveAspectRatio="none"
                                    stroke="currentColor"
                                  >
                                    <line
                                      x1={0}
                                      y1={100}
                                      x2={100}
                                      y2={0}
                                      vectorEffect="non-scaling-stroke"
                                    />
                                  </svg>
                                </span>
                              )}
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              ) : null}
                             
              <button
                onClick={handleCart}
                type="submit"
                className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to cart
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            {/* Description and details */}
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Highlights</h3>

              <div className="mt-4">
                <ul role="list" className="list-disc space-y-2 pl-4 text-sm">
                  {highlights.map((highlight) => (
                    <li key={highlight} className="text-gray-400">
                      <span className="text-gray-600">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-medium text-gray-900">Details</h2>

              <div className="mt-4 space-y-6">
                <p className="text-sm text-gray-600">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}